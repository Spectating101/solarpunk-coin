"""
Market Design Framework for Cryptocurrency Energy Derivatives
==============================================================

This module provides market structure design for trading cryptocurrency
energy cost derivatives, including:
- Market participant modeling
- Contract specifications
- Clearing and settlement mechanisms
- Liquidity provision framework
- Regulatory considerations

For publication in Journal of Financial Markets / Energy Economics
"""

from dataclasses import dataclass
from typing import List, Dict, Tuple, Optional
from enum import Enum
import numpy as np
from decimal import Decimal


class ParticipantType(Enum):
    """Market participant types."""
    MINER = "miner"                    # Bitcoin miners (natural hedgers)
    ENERGY_PRODUCER = "energy_producer"  # Renewable energy producers
    SPECULATOR = "speculator"          # Market makers, prop traders
    ARBITRAGEUR = "arbitrageur"        # Cross-market arbitrage
    INSTITUTIONAL = "institutional"     # Funds, banks


class HedgingObjective(Enum):
    """Hedging objectives for participants."""
    MINIMIZE_VARIANCE = "min_variance"
    MAXIMIZE_SHARPE = "max_sharpe"
    TARGET_PERCENTILE = "target_percentile"
    DYNAMIC_DELTA = "dynamic_delta"


@dataclass
class ContractSpecification:
    """Standardized contract specifications."""

    # Basic specs
    underlying: str = "BTC_ENERGY_COST"
    contract_size: float = 1.0  # 1 kWh energy equivalent
    tick_size: float = 0.0001   # $0.0001 minimum price movement

    # Strikes and maturities
    strike_grid: List[float] = None  # e.g., [0.08, 0.10, 0.12, 0.14]
    maturities: List[int] = None     # e.g., [30, 60, 90, 180, 365] days

    # Settlement
    settlement_type: str = "physical"  # or "cash"
    settlement_currency: str = "USD"

    # Trading hours
    trading_hours: str = "24/7"

    # Margin requirements
    initial_margin_pct: float = 0.10   # 10% initial margin
    maintenance_margin_pct: float = 0.05  # 5% maintenance

    # Position limits
    max_position_size: int = 10000     # contracts

    def __post_init__(self):
        if self.strike_grid is None:
            self.strike_grid = [0.08, 0.09, 0.10, 0.11, 0.12]
        if self.maturities is None:
            self.maturities = [30, 60, 90, 180, 360]


@dataclass
class MarketParticipant:
    """Model of a market participant."""

    participant_id: str
    participant_type: ParticipantType

    # Risk preferences
    risk_aversion: float = 1.0         # Higher = more risk averse
    hedging_objective: HedgingObjective = HedgingObjective.MINIMIZE_VARIANCE

    # Constraints
    budget: float = 1_000_000.0        # USD budget
    max_leverage: float = 2.0

    # Inventory
    energy_exposure: float = 0.0        # kWh exposure (miners: negative)
    option_positions: Dict = None       # {contract_id: quantity}

    # Behavior
    trading_frequency: int = 1          # trades per day
    information_quality: float = 0.5    # 0-1, signal accuracy

    def __post_init__(self):
        if self.option_positions is None:
            self.option_positions = {}


class MarketMicrostructure:
    """Market microstructure model for energy derivatives."""

    def __init__(
        self,
        contract_spec: ContractSpecification,
        tick_size: float = 0.0001
    ):
        self.contract_spec = contract_spec
        self.tick_size = tick_size

        # Order book
        self.bids: Dict[str, List[Tuple[float, int]]] = {}  # contract_id -> [(price, size)]
        self.asks: Dict[str, List[Tuple[float, int]]] = {}

        # Trade history
        self.trades: List[Dict] = []

        # Market makers
        self.market_makers: List[MarketParticipant] = []

    def compute_bid_ask_spread(self, contract_id: str) -> float:
        """Compute bid-ask spread for contract."""
        if contract_id not in self.bids or contract_id not in self.asks:
            return float('inf')

        if not self.bids[contract_id] or not self.asks[contract_id]:
            return float('inf')

        best_bid = max(price for price, size in self.bids[contract_id])
        best_ask = min(price for price, size in self.asks[contract_id])

        return best_ask - best_bid

    def estimate_transaction_cost(
        self,
        contract_id: str,
        quantity: int,
        side: str  # 'buy' or 'sell'
    ) -> Dict[str, float]:
        """Estimate transaction costs including spread, slippage, fees."""

        spread = self.compute_bid_ask_spread(contract_id)

        # Spread cost (half-spread for market order)
        spread_cost = spread / 2 * abs(quantity) * self.contract_spec.contract_size

        # Slippage (linear impact model)
        slippage_rate = 0.0001 * abs(quantity) / 100  # 1 bp per 100 contracts
        slippage_cost = slippage_rate * abs(quantity) * self.contract_spec.contract_size

        # Exchange fees (assume 0.1% taker fee)
        exchange_fee = 0.001 * abs(quantity) * self.contract_spec.contract_size

        total_cost = spread_cost + slippage_cost + exchange_fee

        return {
            'spread_cost': spread_cost,
            'slippage_cost': slippage_cost,
            'exchange_fee': exchange_fee,
            'total_cost': total_cost
        }


class ClearingMechanism:
    """Clearing and settlement mechanism."""

    def __init__(self, contract_spec: ContractSpecification):
        self.contract_spec = contract_spec

        # Member positions
        self.positions: Dict[str, Dict[str, int]] = {}  # member_id -> {contract_id: quantity}
        self.margin_accounts: Dict[str, float] = {}     # member_id -> margin balance

    def calculate_margin_requirement(
        self,
        member_id: str,
        option_value: float,
        delta: float,
        gamma: float,
        vega: float
    ) -> float:
        """Calculate margin requirement using SPAN-like methodology."""

        # Base margin = percentage of option value
        base_margin = self.contract_spec.initial_margin_pct * option_value

        # Risk-based add-ons
        delta_risk = abs(delta) * 0.02  # 2% spot move
        gamma_risk = abs(gamma) * 0.01  # convexity adjustment
        vega_risk = abs(vega) * 0.05    # 5% vol move

        total_margin = base_margin + delta_risk + gamma_risk + vega_risk

        return total_margin

    def mark_to_market(
        self,
        member_id: str,
        contract_prices: Dict[str, float]
    ) -> float:
        """Mark positions to market and calculate P&L."""

        if member_id not in self.positions:
            return 0.0

        total_pnl = 0.0
        for contract_id, quantity in self.positions[member_id].items():
            if contract_id in contract_prices:
                # Assume previous price was stored (simplified)
                mark_price = contract_prices[contract_id]
                pnl = quantity * mark_price * self.contract_spec.contract_size
                total_pnl += pnl

        return total_pnl

    def check_margin_call(self, member_id: str, margin_requirement: float) -> bool:
        """Check if margin call is needed."""
        if member_id not in self.margin_accounts:
            return True

        available_margin = self.margin_accounts[member_id]
        maintenance_margin = margin_requirement * (
            self.contract_spec.maintenance_margin_pct /
            self.contract_spec.initial_margin_pct
        )

        return available_margin < maintenance_margin


class LiquidityProvider:
    """Market maker / liquidity provider model."""

    def __init__(
        self,
        participant: MarketParticipant,
        target_spread: float = 0.005,  # 50 bps target spread
        inventory_limit: int = 1000
    ):
        self.participant = participant
        self.target_spread = target_spread
        self.inventory_limit = inventory_limit

        self.current_inventory: Dict[str, int] = {}

    def compute_quote(
        self,
        contract_id: str,
        fair_value: float,
        inventory: int,
        volatility: float
    ) -> Tuple[float, float]:
        """Compute bid/ask quotes with inventory management."""

        # Base spread
        spread = self.target_spread

        # Widen spread with volatility
        vol_adjustment = volatility * 0.1  # 10% of vol
        spread += vol_adjustment

        # Inventory skew (push quotes to reduce inventory)
        inventory_skew = 0.0
        if abs(inventory) > self.inventory_limit * 0.5:
            # Skew quotes to encourage inventory reduction
            inventory_ratio = inventory / self.inventory_limit
            inventory_skew = inventory_ratio * spread * 0.5

        # Final quotes
        mid_price = fair_value + inventory_skew
        bid = mid_price - spread / 2
        ask = mid_price + spread / 2

        # Ensure no negative prices
        bid = max(bid, 0.0001)
        ask = max(ask, bid + self.target_spread / 2)

        return (bid, ask)

    def should_trade(
        self,
        contract_id: str,
        market_price: float,
        fair_value: float,
        position_size: int
    ) -> Optional[str]:
        """Decide whether to trade based on mispricing."""

        # Check inventory limits
        current_position = self.current_inventory.get(contract_id, 0)
        if abs(current_position + position_size) > self.inventory_limit:
            return None

        # Trade if mispricing exceeds threshold
        mispricing = market_price - fair_value
        threshold = self.target_spread * 0.3  # 30% of spread

        if mispricing > threshold:
            return "sell"  # Market price too high
        elif mispricing < -threshold:
            return "buy"   # Market price too low

        return None


class RegulatoryFramework:
    """Regulatory framework for derivatives market."""

    def __init__(self):
        self.position_limits: Dict[str, int] = {}
        self.reporting_thresholds: Dict[str, float] = {}
        self.approved_participants: List[str] = []

    def check_compliance(
        self,
        participant_id: str,
        contract_id: str,
        proposed_quantity: int,
        current_positions: Dict[str, int]
    ) -> Tuple[bool, Optional[str]]:
        """Check if trade complies with regulations."""

        # Check participant approval
        if participant_id not in self.approved_participants:
            return (False, "Participant not approved for trading")

        # Check position limits
        if contract_id in self.position_limits:
            current = current_positions.get(contract_id, 0)
            if abs(current + proposed_quantity) > self.position_limits[contract_id]:
                return (False, "Would exceed position limit")

        # Check reporting threshold
        if contract_id in self.reporting_thresholds:
            notional = abs(proposed_quantity) * 0.10  # Assume $0.10 avg price
            if notional > self.reporting_thresholds[contract_id]:
                # Would need to report (but can still trade)
                return (True, f"Requires large trader reporting")

        return (True, None)

    def set_position_limit(self, contract_id: str, limit: int):
        """Set position limit for contract."""
        self.position_limits[contract_id] = limit

    def approve_participant(self, participant_id: str):
        """Approve participant for trading."""
        if participant_id not in self.approved_participants:
            self.approved_participants.append(participant_id)


class MarketDesign:
    """Complete market design framework."""

    def __init__(self):
        self.contract_spec = ContractSpecification()
        self.microstructure = MarketMicrostructure(self.contract_spec)
        self.clearing = ClearingMechanism(self.contract_spec)
        self.regulatory = RegulatoryFramework()

        self.participants: Dict[str, MarketParticipant] = {}

    def add_participant(self, participant: MarketParticipant):
        """Add market participant."""
        self.participants[participant.participant_id] = participant
        self.regulatory.approve_participant(participant.participant_id)

    def simulate_market_formation(
        self,
        num_miners: int = 50,
        num_producers: int = 20,
        num_speculators: int = 30
    ) -> Dict[str, any]:
        """Simulate market formation with different participant types."""

        # Create participants
        for i in range(num_miners):
            miner = MarketParticipant(
                participant_id=f"miner_{i}",
                participant_type=ParticipantType.MINER,
                energy_exposure=-10000,  # Short energy (need to buy)
                risk_aversion=1.5,
                budget=500_000
            )
            self.add_participant(miner)

        for i in range(num_producers):
            producer = MarketParticipant(
                participant_id=f"producer_{i}",
                participant_type=ParticipantType.ENERGY_PRODUCER,
                energy_exposure=20000,  # Long energy (want to sell)
                risk_aversion=1.2,
                budget=1_000_000
            )
            self.add_participant(producer)

        for i in range(num_speculators):
            spec = MarketParticipant(
                participant_id=f"spec_{i}",
                participant_type=ParticipantType.SPECULATOR,
                energy_exposure=0,
                risk_aversion=0.8,  # Less risk averse
                budget=2_000_000
            )
            self.add_participant(spec)

        return {
            'total_participants': len(self.participants),
            'miners': num_miners,
            'producers': num_producers,
            'speculators': num_speculators,
            'total_long_exposure': num_producers * 20000,
            'total_short_exposure': num_miners * 10000
        }

    def analyze_market_structure(self) -> Dict[str, any]:
        """Analyze designed market structure."""

        # Participant analysis
        participant_types = {}
        for p in self.participants.values():
            ptype = p.participant_type.value
            participant_types[ptype] = participant_types.get(ptype, 0) + 1

        # Exposure analysis
        total_long = sum(
            p.energy_exposure for p in self.participants.values()
            if p.energy_exposure > 0
        )
        total_short = sum(
            abs(p.energy_exposure) for p in self.participants.values()
            if p.energy_exposure < 0
        )

        # Contract analysis
        total_contracts = (
            len(self.contract_spec.strike_grid) *
            len(self.contract_spec.maturities)
        )

        return {
            'participant_distribution': participant_types,
            'total_long_exposure': total_long,
            'total_short_exposure': total_short,
            'exposure_balance': total_long / total_short if total_short > 0 else 0,
            'available_contracts': total_contracts,
            'contract_specifications': {
                'strikes': self.contract_spec.strike_grid,
                'maturities': self.contract_spec.maturities,
                'settlement': self.contract_spec.settlement_type
            }
        }


def demo_market_design():
    """Demonstrate market design framework."""

    print("=" * 80)
    print("CRYPTOCURRENCY ENERGY DERIVATIVES - MARKET DESIGN")
    print("=" * 80)

    # Initialize market
    market = MarketDesign()

    # Simulate market formation
    print("\n1. MARKET FORMATION")
    print("-" * 80)
    formation = market.simulate_market_formation(
        num_miners=50,
        num_producers=20,
        num_speculators=30
    )
    print(f"Total Participants: {formation['total_participants']}")
    print(f"  - Miners (hedgers): {formation['miners']}")
    print(f"  - Energy Producers: {formation['producers']}")
    print(f"  - Speculators: {formation['speculators']}")
    print(f"Total Long Exposure: {formation['total_long_exposure']:,} kWh")
    print(f"Total Short Exposure: {formation['total_short_exposure']:,} kWh")

    # Analyze structure
    print("\n2. MARKET STRUCTURE ANALYSIS")
    print("-" * 80)
    analysis = market.analyze_market_structure()
    print(f"Participant Distribution: {analysis['participant_distribution']}")
    print(f"Exposure Balance Ratio: {analysis['exposure_balance']:.2f}")
    print(f"Available Contracts: {analysis['available_contracts']}")
    print(f"Strike Grid: {analysis['contract_specifications']['strikes']}")
    print(f"Maturities: {analysis['contract_specifications']['maturities']} days")

    # Contract specifications
    print("\n3. CONTRACT SPECIFICATIONS")
    print("-" * 80)
    spec = market.contract_spec
    print(f"Underlying: {spec.underlying}")
    print(f"Contract Size: {spec.contract_size} kWh")
    print(f"Tick Size: ${spec.tick_size}")
    print(f"Settlement: {spec.settlement_type}")
    print(f"Trading Hours: {spec.trading_hours}")
    print(f"Initial Margin: {spec.initial_margin_pct:.1%}")
    print(f"Maintenance Margin: {spec.maintenance_margin_pct:.1%}")

    # Liquidity provision example
    print("\n4. LIQUIDITY PROVISION EXAMPLE")
    print("-" * 80)
    lp_participant = MarketParticipant(
        participant_id="mm_001",
        participant_type=ParticipantType.SPECULATOR,
        budget=5_000_000
    )
    lp = LiquidityProvider(lp_participant, target_spread=0.005)

    fair_value = 0.015  # $0.015 option value
    inventory = 50      # Long 50 contracts
    volatility = 0.45   # 45% vol

    bid, ask = lp.compute_quote("ATM_30D", fair_value, inventory, volatility)
    print(f"Fair Value: ${fair_value:.4f}")
    print(f"Market Maker Bid: ${bid:.4f}")
    print(f"Market Maker Ask: ${ask:.4f}")
    print(f"Spread: {(ask - bid):.4f} ({(ask-bid)/fair_value:.2%} of fair value)")

    # Transaction cost estimate
    print("\n5. TRANSACTION COST ANALYSIS")
    print("-" * 80)
    costs = market.microstructure.estimate_transaction_cost("ATM_30D", 100, "buy")
    print(f"Trading 100 contracts:")
    print(f"  Spread Cost: ${costs['spread_cost']:.2f}")
    print(f"  Slippage: ${costs['slippage_cost']:.2f}")
    print(f"  Exchange Fee: ${costs['exchange_fee']:.2f}")
    print(f"  Total Cost: ${costs['total_cost']:.2f}")
    print(f"  Cost per Contract: ${costs['total_cost']/100:.4f}")

    print("\n" + "=" * 80)
    print("Market design framework ready for academic publication!")
    print("=" * 80)


if __name__ == "__main__":
    demo_market_design()
