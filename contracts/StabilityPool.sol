// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title StabilityPool
 * @notice Dedicated vault for SPK peg-stability inventory.
 *
 * Replaces the `stabilityPool = address(this)` placeholder in SolarPunkCoin.
 * SolarPunkCoin mints/burns directly to/from this address via internal ERC20
 * functions — no approval needed for those paths.
 *
 * DISBURSER_ROLE holders (e.g. STABILIZER_ROLE address on SolarPunkCoin) can
 * withdraw tokens to a target address, which is how the peg-stability module
 * deploys inventory when SPK is above peg.
 *
 * Deployment:
 *   1. Deploy StabilityPool
 *   2. Call SolarPunkCoin.setStabilityPool(address(stabilityPool))
 *   3. Grant DISBURSER_ROLE to the STABILIZER_ROLE holder (or the coin contract)
 */
contract StabilityPool is AccessControl, Pausable {
    using SafeERC20 for IERC20;

    // ── Roles ──────────────────────────────────────────────────────────────

    bytes32 public constant DISBURSER_ROLE = keccak256("DISBURSER_ROLE");
    bytes32 public constant PAUSER_ROLE    = keccak256("PAUSER_ROLE");

    // ── Events ─────────────────────────────────────────────────────────────

    event Withdrawn(address indexed token, address indexed to, uint256 amount, address indexed by);
    event EmergencyWithdrawn(address indexed token, address indexed to, uint256 amount);

    // ── Constructor ────────────────────────────────────────────────────────

    constructor(address admin) {
        require(admin != address(0), "invalid admin");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
    }

    // ── Core: disbursement ─────────────────────────────────────────────────

    /**
     * @notice Withdraw `amount` of `token` to `to`.
     * @dev Called by the STABILIZER path when deploying peg inventory.
     *      PI controller mints and burns are handled entirely by SolarPunkCoin
     *      internal functions and do not go through this function.
     */
    function withdraw(address token, address to, uint256 amount)
        external
        onlyRole(DISBURSER_ROLE)
        whenNotPaused
    {
        require(token != address(0), "invalid token");
        require(to != address(0), "invalid recipient");
        require(amount > 0, "zero amount");

        IERC20(token).safeTransfer(to, amount);
        emit Withdrawn(token, to, amount, msg.sender);
    }

    // ── View ───────────────────────────────────────────────────────────────

    /// @notice Current balance of `token` held in this pool
    function balance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }

    // ── Emergency ─────────────────────────────────────────────────────────

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @notice Emergency withdrawal — admin only, bypasses pause
     */
    function emergencyWithdraw(address token, address to, uint256 amount)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        IERC20(token).safeTransfer(to, amount);
        emit EmergencyWithdrawn(token, to, amount);
    }
}
