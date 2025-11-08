// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/Nonces.sol";

contract SolarPunkCoin is ERC20, ERC20Burnable, ERC20Votes, AccessControl, Pausable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;
    uint256 public totalEnergyBacking;
    bool public isGridStressed;

    event TokensMinted(address indexed to, uint256 amount, uint256 energyKwh);

    constructor(address admin) ERC20("SolarPunkCoin", "SPK") EIP712("SolarPunkCoin", "1") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
    }

    function mintFromSurplus(address to, uint256 energyKwh, bytes32)
        external
        onlyRole(MINTER_ROLE)
        whenNotPaused
        returns (uint256)
    {
        require(!isGridStressed, "Grid stressed");
        require(totalSupply() + energyKwh <= MAX_SUPPLY, "Max supply");

        totalEnergyBacking += energyKwh;
        _mint(to, energyKwh);

        emit TokensMinted(to, energyKwh, energyKwh);
        return energyKwh;
    }

    function setGridStress(bool stressed) external onlyRole(MINTER_ROLE) {
        isGridStressed = stressed;
    }

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Votes)
    {
        super._update(from, to, value);
    }

    function nonces(address owner)
        public
        view
        virtual
        override
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
