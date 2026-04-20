"""
chain_client.py — Read-only client for live SolarPunk Sepolia contracts.

Reads on-chain state without requiring a local node or private key.
Designed to feed live contract data into the pricing and analysis modules.

Dependencies
------------
pip install web3>=6.0

Contracts (Sepolia)
-------------------
- SolarPunkCoin:    0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F
- SolarPunkOption:  0xe40A88398b5f90D038f7A6F1f122112DCD9e4104
- ProtocolTreasury: 0x138e793f095a33D2790349eC1066FED3A756dd2c

Usage
-----
    from spk_derivatives.chain_client import SolarPunkChainClient

    client = SolarPunkChainClient()
    state = client.get_protocol_state()
    print(state)

    # Use live energy price in pricing models
    energy_price_usd = client.energy_price_per_kwh()
"""

from __future__ import annotations

import json
import warnings
from dataclasses import dataclass
from typing import Optional

# ── Minimal ABIs (view functions only) ───────────────────────────────────────

_SPK_ABI = json.loads("""[
  {"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"energyPricePerKwh","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"lastOraclePrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"usdcReserve","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"getReserveRatio","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"cumulativeSurplusKwh","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"gridStressed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"isPegStable","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"pegTarget","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"supplyCap","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"stabilityFeeShare","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
]""")

_OPT_ABI = json.loads("""[
  {"inputs":[],"name":"currentIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"tradingFeeBps","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
]""")

_TREASURY_ABI = json.loads("""[
  {"inputs":[{"internalType":"address","name":"operator","type":"address"}],"name":"keeperBonds","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
]""")

# ── Constants ─────────────────────────────────────────────────────────────────

SEPOLIA_RPC      = "https://rpc.sepolia.org"
SPK_ADDRESS      = "0x1D55C6c9B240966E24f7ab9A9EC8b2f924E0407F"
OPTION_ADDRESS   = "0xe40A88398b5f90D038f7A6F1f122112DCD9e4104"
TREASURY_ADDRESS = "0x138e793f095a33D2790349eC1066FED3A756dd2c"

_WAD = 10 ** 18
_USDC_DEC = 10 ** 6


# ── Data classes ──────────────────────────────────────────────────────────────

@dataclass
class ProtocolState:
    """Snapshot of live SolarPunk on-chain state."""

    # SolarPunkCoin
    total_supply_spk: float          # SPK outstanding
    energy_price_usd_per_kwh: float  # $USD per kWh (from energyPricePerKwh / 1e18)
    oracle_price_usd: float          # last posted oracle price (/ 1e18)
    usdc_reserve_usd: float          # USDC held in reserve (/ 1e6)
    reserve_ratio_pct: float         # reserve ratio in percent (bps / 100)
    cumulative_kwh: float            # total kWh of surplus verified
    grid_stressed: bool
    peg_stable: bool
    peg_target_usd: float
    supply_cap_spk: float
    stability_fee_share_pct: float   # percent routed to stability pool

    # SolarPunkOption
    current_index: float             # energy index used for option mark-to-market

    # Source
    rpc_url: str

    def __str__(self) -> str:
        lines = [
            "━━ SolarPunk Protocol State (Sepolia) ━━",
            f"  SPK Supply:          {self.total_supply_spk:,.4f} / {self.supply_cap_spk:,.0f}",
            f"  Energy Price:        ${self.energy_price_usd_per_kwh:.5f}/kWh",
            f"  Oracle Price:        ${self.oracle_price_usd:.4f}",
            f"  USDC Reserve:        ${self.usdc_reserve_usd:,.2f}",
            f"  Reserve Ratio:       {self.reserve_ratio_pct:.2f}%",
            f"  Surplus Verified:    {self.cumulative_kwh:,.2f} kWh",
            f"  Grid Stressed:       {'YES ⚠' if self.grid_stressed else 'no'}",
            f"  Peg Stable:          {'yes' if self.peg_stable else 'ADJUSTING'}",
            f"  Peg Target:          ${self.peg_target_usd:.2f}",
            f"  Stability Fee Share: {self.stability_fee_share_pct:.1f}%",
            f"  Option Index:        {self.current_index:.6f}",
        ]
        return "\n".join(lines)


# ── Client ────────────────────────────────────────────────────────────────────

class SolarPunkChainClient:
    """
    Read-only interface to the live SolarPunk Sepolia contracts.

    Parameters
    ----------
    rpc_url : str, optional
        JSON-RPC endpoint for Sepolia. Defaults to public rpc.sepolia.org.
    spk_address : str, optional
        Override SolarPunkCoin contract address.
    option_address : str, optional
        Override SolarPunkOption contract address.
    treasury_address : str, optional
        Override ProtocolTreasury contract address.
    """

    def __init__(
        self,
        rpc_url: str = SEPOLIA_RPC,
        spk_address: str = SPK_ADDRESS,
        option_address: str = OPTION_ADDRESS,
        treasury_address: str = TREASURY_ADDRESS,
    ):
        try:
            from web3 import Web3
        except ImportError as exc:
            raise ImportError(
                "web3 is required for chain_client. Install it with: pip install web3>=6.0"
            ) from exc

        self._w3 = Web3(Web3.HTTPProvider(rpc_url))
        if not self._w3.is_connected():
            raise ConnectionError(f"Could not connect to RPC: {rpc_url}")

        self._spk      = self._w3.eth.contract(address=Web3.to_checksum_address(spk_address),      abi=_SPK_ABI)
        self._option   = self._w3.eth.contract(address=Web3.to_checksum_address(option_address),   abi=_OPT_ABI)
        self._treasury = self._w3.eth.contract(address=Web3.to_checksum_address(treasury_address), abi=_TREASURY_ABI)
        self._rpc_url  = rpc_url

    # ── High-level ────────────────────────────────────────────────────────

    def get_protocol_state(self) -> ProtocolState:
        """Fetch and return a full ProtocolState snapshot."""
        spk = self._spk
        opt = self._option

        return ProtocolState(
            total_supply_spk          = spk.functions.totalSupply().call()          / _WAD,
            energy_price_usd_per_kwh  = spk.functions.energyPricePerKwh().call()   / _WAD,
            oracle_price_usd          = spk.functions.lastOraclePrice().call()      / _WAD,
            usdc_reserve_usd          = spk.functions.usdcReserve().call()          / _USDC_DEC,
            reserve_ratio_pct         = spk.functions.getReserveRatio().call()      / 100,
            cumulative_kwh            = spk.functions.cumulativeSurplusKwh().call(),       # raw kWh integer, not 1e18
            grid_stressed             = spk.functions.gridStressed().call(),
            peg_stable                = spk.functions.isPegStable().call(),
            peg_target_usd            = spk.functions.pegTarget().call()            / _WAD,
            supply_cap_spk            = spk.functions.supplyCap().call()            / _WAD,
            stability_fee_share_pct   = spk.functions.stabilityFeeShare().call()   / 100,
            current_index             = opt.functions.currentIndex().call()         / _WAD,
            rpc_url                   = self._rpc_url,
        )

    # ── Convenience accessors ─────────────────────────────────────────────

    def energy_price_per_kwh(self) -> float:
        """USD per kWh — use this as `S` (spot price) in pricing models."""
        return self._spk.functions.energyPricePerKwh().call() / _WAD

    def oracle_price(self) -> float:
        """Latest posted SPK oracle price in USD."""
        return self._spk.functions.lastOraclePrice().call() / _WAD

    def option_index(self) -> float:
        """Current energy index used for option mark-to-market."""
        return self._option.functions.currentIndex().call() / _WAD

    def keeper_bond(self, operator: str) -> float:
        """USDC-equivalent bond held by `operator` in ProtocolTreasury."""
        from web3 import Web3
        raw = self._treasury.functions.keeperBonds(Web3.to_checksum_address(operator)).call()
        return raw / _USDC_DEC

    def is_healthy(self) -> bool:
        """True when grid is not stressed and peg is stable."""
        return (
            not self._spk.functions.gridStressed().call()
            and self._spk.functions.isPegStable().call()
        )


# ── CLI convenience ───────────────────────────────────────────────────────────

def _cli_main() -> None:
    """Print live protocol state when run as a script."""
    print("Connecting to Sepolia…")
    try:
        client = SolarPunkChainClient()
        state = client.get_protocol_state()
        print(state)
    except ImportError as e:
        print(f"ERROR: {e}")
    except ConnectionError as e:
        print(f"ERROR: {e}")
    except Exception as e:
        print(f"ERROR: {e}")


if __name__ == "__main__":
    _cli_main()
