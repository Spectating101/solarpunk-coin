"""
SPK Token Configuration
=======================

Configuration system for SolarPunkCoin token parameters.
Provides a clean interface for SPK design parameters.
"""

from dataclasses import dataclass
from typing import Optional


@dataclass
class SPKConfig:
    """
    Configuration for SolarPunkCoin token design.

    All pricing and design parameters in one place.
    """

    # Token Identity
    name: str = "SolarPunkCoin"
    symbol: str = "SPK"
    description: str = "Renewable energy-backed stablecoin"

    # Redemption Mechanics
    redemption_enabled: bool = True
    redemption_fee: float = 0.001  # 0.1% fee
    redemption_delay_days: int = 0  # Immediate redemption
    min_redemption_amount: float = 0.1  # Minimum 0.1 SPK

    # Backing & Collateral
    backing_ratio: float = 1.10  # 110% backing (energy/token)
    reserve_ratio: float = 1.05  # 105% reserves
    confidence_level: float = 0.95  # 95% confidence for VaR

    # Peg Mechanism
    peg_target: float = 1.0  # $1 target price
    peg_band: float = 0.05  # ±5% band
    mint_burn_enabled: bool = True
    stability_fee: float = 0.0001  # 0.01% stability fee

    # Time Parameters
    default_maturity: float = 1.0  # 1 year default
    risk_free_rate: float = 0.05  # 5% (use treasury rate)

    # Governance
    governance_enabled: bool = True
    min_stake_for_vote: float = 100.0  # 100 SPK minimum

    # Energy Parameters
    energy_unit: str = "kWh"
    energy_source: str = "renewable"  # renewable, solar, wind, etc.

    def __post_init__(self):
        """Validate configuration."""
        if self.backing_ratio < 1.0:
            raise ValueError("Backing ratio must be >= 1.0 (100%)")

        if self.peg_band < 0 or self.peg_band > 0.5:
            raise ValueError("Peg band must be between 0 and 0.5 (50%)")

        if self.confidence_level < 0.5 or self.confidence_level > 0.999:
            raise ValueError("Confidence level must be between 0.5 and 0.999")

    def to_dict(self):
        """Convert to dictionary."""
        return {
            'name': self.name,
            'symbol': self.symbol,
            'description': self.description,
            'redemption_enabled': self.redemption_enabled,
            'redemption_fee': self.redemption_fee,
            'backing_ratio': self.backing_ratio,
            'reserve_ratio': self.reserve_ratio,
            'peg_target': self.peg_target,
            'peg_band': self.peg_band,
            'maturity': self.default_maturity,
            'risk_free_rate': self.risk_free_rate,
        }

    @classmethod
    def conservative(cls):
        """Conservative SPK configuration (high backing, tight peg)."""
        return cls(
            backing_ratio=1.20,  # 120% backing
            reserve_ratio=1.15,
            peg_band=0.02,  # ±2%
            confidence_level=0.99,  # 99% confidence
        )

    @classmethod
    def balanced(cls):
        """Balanced SPK configuration (default)."""
        return cls()  # Use defaults

    @classmethod
    def aggressive(cls):
        """Aggressive SPK configuration (lower backing, wider peg)."""
        return cls(
            backing_ratio=1.05,  # 105% backing
            reserve_ratio=1.02,
            peg_band=0.10,  # ±10%
            confidence_level=0.90,  # 90% confidence
        )


# Preset configurations
SPK_PRESETS = {
    'conservative': SPKConfig.conservative(),
    'balanced': SPKConfig.balanced(),
    'aggressive': SPKConfig.aggressive(),
}


def get_preset(name: str) -> SPKConfig:
    """
    Get a preset SPK configuration.

    Parameters:
    -----------
    name : str
        'conservative', 'balanced', or 'aggressive'

    Returns:
    --------
    SPKConfig
    """
    if name not in SPK_PRESETS:
        raise ValueError(f"Unknown preset: {name}. Choose from: {list(SPK_PRESETS.keys())}")

    return SPK_PRESETS[name]


# Example usage
if __name__ == "__main__":
    print("SPK Configuration Presets:\n")

    for name, config in SPK_PRESETS.items():
        print(f"{name.upper()}:")
        print(f"  Backing Ratio: {config.backing_ratio:.0%}")
        print(f"  Peg Band: ±{config.peg_band:.0%}")
        print(f"  Confidence: {config.confidence_level:.0%}")
        print()
