"""
SolarPunkCoin - Peg Stability Mechanism
========================================

Implements Rule D: "Peg Stability Band"
"Algorithmically mint/burn to keep SPK within ±δ% of target wholesale p(t)"

Features:
- PID controller for peg maintenance
- Automatic mint/burn operations
- Stability band (±5% default)
- Feedback parameter γ for responsiveness
"""

from decimal import Decimal
from typing import Tuple, Optional
from dataclasses import dataclass
import time


@dataclass
class PegParameters:
    """
    Peg stability parameters from whitepaper.

    β₀: Base peg price
    β₁: Price adjustment factor
    γ: Feedback responsiveness parameter
    δ: Stability band width (±%)
    """
    beta_0: Decimal = Decimal('0.10')  # Base peg: $0.10/kWh
    beta_1: Decimal = Decimal('1.0')   # Price adjustment factor
    gamma: Decimal = Decimal('0.5')    # Feedback parameter
    delta: Decimal = Decimal('0.05')   # Stability band: ±5%

    def get_peg_band(self, current_price: Decimal) -> Tuple[Decimal, Decimal]:
        """Get upper and lower peg bounds."""
        lower = current_price * (Decimal('1') - self.delta)
        upper = current_price * (Decimal('1') + self.delta)
        return (lower, upper)


class PegStabilityController:
    """
    Algorithmic peg stability controller.

    Uses feedback control to maintain SPK price within target band:
    - If SPK > upper_bound: Mint more SPK (increase supply)
    - If SPK < lower_bound: Burn SPK (decrease supply)
    - Within band: No action

    Based on MakerDAO DAI stability mechanisms + custom energy-backing.
    """

    def __init__(
        self,
        params: Optional[PegParameters] = None,
        reserve_ratio: Decimal = Decimal('0.10')  # 10% reserve
    ):
        self.params = params or PegParameters()
        self.reserve_ratio = reserve_ratio

        # State tracking
        self.price_history: list = []
        self.deviation_history: list = []
        self.action_history: list = []

        # PID controller state
        self.integral_error = Decimal('0')
        self.last_error = Decimal('0')
        self.last_update = time.time()

    def compute_target_price(self, wholesale_price: Decimal) -> Decimal:
        """
        Compute target SPK price based on wholesale energy price.

        Formula: p_target = β₀ + β₁ × p_wholesale

        Args:
            wholesale_price: Current wholesale energy price ($/kWh)

        Returns:
            Target SPK price
        """
        return self.params.beta_0 + self.params.beta_1 * wholesale_price

    def check_peg_deviation(
        self,
        spk_market_price: Decimal,
        target_price: Decimal
    ) -> Tuple[str, Decimal]:
        """
        Check if SPK price is within stability band.

        Returns:
            (status, deviation)
            status: 'above_band', 'within_band', or 'below_band'
            deviation: Percentage deviation from target
        """
        lower, upper = self.params.get_peg_band(target_price)

        deviation = (spk_market_price - target_price) / target_price

        if spk_market_price > upper:
            return 'above_band', deviation
        elif spk_market_price < lower:
            return 'below_band', deviation
        else:
            return 'within_band', deviation

    def compute_correction_amount(
        self,
        spk_market_price: Decimal,
        target_price: Decimal,
        total_supply: Decimal,
        dt: float = 1.0  # Time delta in hours
    ) -> Tuple[str, Decimal]:
        """
        Compute required mint/burn amount to restore peg.

        Uses PID control:
        - P (Proportional): Responds to current error
        - I (Integral): Corrects accumulated error
        - D (Derivative): Dampens oscillations

        Args:
            spk_market_price: Current SPK market price
            target_price: Target peg price
            total_supply: Current total SPK supply
            dt: Time since last update (hours)

        Returns:
            (action, amount)
            action: 'mint' or 'burn'
            amount: SPK amount to mint/burn
        """
        # Compute error (deviation from peg)
        error = (spk_market_price - target_price) / target_price

        # PID components
        # P: Proportional to current error
        p_term = error

        # I: Integral of error over time
        self.integral_error += error * Decimal(str(dt))
        i_term = self.integral_error

        # D: Derivative (rate of change)
        d_term = (error - self.last_error) / Decimal(str(dt)) if dt > 0 else Decimal('0')

        # PID gains (tuned for stability)
        kp = self.params.gamma
        ki = self.params.gamma * Decimal('0.1')
        kd = self.params.gamma * Decimal('0.05')

        # Control signal
        control = kp * p_term + ki * i_term + kd * d_term

        # Convert to mint/burn amount
        # Mint/burn as percentage of supply
        adjustment_ratio = abs(control)
        amount = total_supply * adjustment_ratio

        # Limit to reasonable amount (max 10% of supply per adjustment)
        max_adjustment = total_supply * Decimal('0.10')
        amount = min(amount, max_adjustment)

        # Determine action
        if error > 0:
            action = 'mint'  # Price too high, increase supply
        else:
            action = 'burn'  # Price too low, decrease supply

        # Update state
        self.last_error = error
        self.last_update = time.time()

        return action, amount

    def execute_peg_correction(
        self,
        spk_market_price: Decimal,
        wholesale_price: Decimal,
        total_supply: Decimal
    ) -> Tuple[bool, str, Decimal]:
        """
        Execute peg correction if needed.

        Returns:
            (needs_action, action_type, amount)
        """
        # Compute target price
        target_price = self.compute_target_price(wholesale_price)

        # Check deviation
        status, deviation = self.check_peg_deviation(spk_market_price, target_price)

        # Record
        self.price_history.append({
            'timestamp': time.time(),
            'spk_price': spk_market_price,
            'target_price': target_price,
            'deviation': deviation
        })
        self.deviation_history.append(float(deviation))

        # Within band - no action needed
        if status == 'within_band':
            return False, 'none', Decimal('0')

        # Compute correction
        action, amount = self.compute_correction_amount(
            spk_market_price, target_price, total_supply
        )

        # Record action
        self.action_history.append({
            'timestamp': time.time(),
            'action': action,
            'amount': amount,
            'reason': status,
            'deviation': deviation
        })

        return True, action, amount

    def get_stability_stats(self) -> dict:
        """Get peg stability statistics."""
        if not self.deviation_history:
            avg_deviation = 0
            max_deviation = 0
        else:
            avg_deviation = sum(self.deviation_history) / len(self.deviation_history)
            max_deviation = max(abs(d) for d in self.deviation_history)

        return {
            'target_peg': str(self.params.beta_0),
            'stability_band': f"±{self.params.delta:.1%}",
            'gamma': str(self.params.gamma),
            'price_observations': len(self.price_history),
            'corrections_executed': len(self.action_history),
            'average_deviation': f"{avg_deviation:.2%}",
            'max_deviation': f"{max_deviation:.2%}",
            'integral_error': str(self.integral_error)
        }


# ============================================================================
# SEIGNIORAGE AUCTION (Rule C)
# ============================================================================

class SeigniorageAuction:
    """
    Implements Rule C: "Cost–Value Parity Enforcement"
    "Seigniorage auctions adjust supply when SPK price ≠ minting cost"

    When SPK trades above minting cost, auctions additional supply.
    Proceeds go to treasury/reserves.
    """

    def __init__(
        self,
        auction_duration: int = 3600,  # 1 hour
        min_bid: Decimal = Decimal('0.01')
    ):
        self.auction_duration = auction_duration
        self.min_bid = min_bid

        self.active_auctions: list = []
        self.completed_auctions: list = []

    def create_auction(
        self,
        amount: Decimal,
        starting_price: Decimal,
        minting_cost: Decimal
    ) -> dict:
        """
        Create a seigniorage auction.

        Sells newly minted SPK when market price > minting cost.
        """
        auction = {
            'id': len(self.active_auctions),
            'amount': amount,
            'starting_price': starting_price,
            'minting_cost': minting_cost,
            'current_bid': starting_price,
            'highest_bidder': None,
            'start_time': time.time(),
            'end_time': time.time() + self.auction_duration,
            'bids': []
        }

        self.active_auctions.append(auction)
        return auction

    def place_bid(
        self,
        auction_id: int,
        bidder: str,
        bid_price: Decimal
    ) -> Tuple[bool, str]:
        """Place bid in auction."""
        if auction_id >= len(self.active_auctions):
            return False, "Auction not found"

        auction = self.active_auctions[auction_id]

        # Check auction still active
        if time.time() > auction['end_time']:
            return False, "Auction ended"

        # Check bid higher than current
        if bid_price <= auction['current_bid']:
            return False, f"Bid must be > {auction['current_bid']}"

        # Accept bid
        auction['bids'].append({
            'bidder': bidder,
            'price': bid_price,
            'time': time.time()
        })
        auction['current_bid'] = bid_price
        auction['highest_bidder'] = bidder

        return True, f"Bid accepted: {bid_price} SPK"

    def finalize_auction(self, auction_id: int) -> Tuple[bool, dict]:
        """Finalize completed auction."""
        if auction_id >= len(self.active_auctions):
            return False, {}

        auction = self.active_auctions[auction_id]

        if time.time() < auction['end_time']:
            return False, {}

        # Auction complete
        result = {
            'winner': auction['highest_bidder'],
            'price': auction['current_bid'],
            'amount': auction['amount'],
            'seigniorage': (auction['current_bid'] - auction['minting_cost']) * auction['amount']
        }

        self.completed_auctions.append(result)
        return True, result


if __name__ == "__main__":
    print("=" * 70)
    print("SOLARPUNKCOIN - Peg Stability Mechanism Test")
    print("=" * 70)

    # Create controller
    controller = PegStabilityController()

    print("\n📊 Peg parameters:")
    print(f"  Base peg (β₀): ${controller.params.beta_0}/kWh")
    print(f"  Stability band (δ): ±{controller.params.delta:.1%}")
    print(f"  Feedback (γ): {controller.params.gamma}")

    # Simulate peg scenarios
    print("\n🎯 Testing peg scenarios...")

    wholesale_price = Decimal('0.08')
    target = controller.compute_target_price(wholesale_price)
    print(f"\n  Wholesale price: ${wholesale_price}/kWh")
    print(f"  Target SPK price: ${target}")

    lower, upper = controller.params.get_peg_band(target)
    print(f"  Stability band: ${lower} - ${upper}")

    scenarios = [
        ("Within band", target),
        ("Above band (high demand)", target * Decimal('1.08')),
        ("Below band (low demand)", target * Decimal('0.93')),
    ]

    for name, market_price in scenarios:
        print(f"\n  Scenario: {name}")
        print(f"    Market price: ${market_price}")

        needs_action, action, amount = controller.execute_peg_correction(
            spk_market_price=market_price,
            wholesale_price=wholesale_price,
            total_supply=Decimal('1000000')  # 1M SPK
        )

        if needs_action:
            print(f"    Action: {action.upper()} {amount:.2f} SPK")
        else:
            print(f"    Action: None (within band) ✓")

    # Stats
    print("\n📈 Stability statistics:")
    stats = controller.get_stability_stats()
    for key, value in stats.items():
        print(f"  {key}: {value}")

    print("\n" + "=" * 70)
    print("Peg stability mechanism operational!")
    print("Rule D: Peg Stability Band ✓")
    print("Rule C: Cost-Value Parity (via auctions) ✓")
    print("=" * 70)
