"""
Comprehensive Test Suite - Peg Stability
=========================================

Tests for:
- PID controller
- Peg band computation
- Mint/burn decisions
- Seigniorage auctions
- Stability statistics
"""

import pytest
from decimal import Decimal

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from contracts.peg_stability import (
    PegStabilityController, PegParams,
    SeigniorageAuction
)


class TestPegParameters:
    """Test peg parameter configuration."""

    def test_default_parameters(self):
        """Test default parameters initialization."""
        params = PegParams()

        assert params.base_price == Decimal('0.10')
        assert params.delta == Decimal('0.05')
        assert params.gamma == Decimal('1.0')

    def test_peg_band_calculation(self):
        """Test peg band calculation."""
        params = PegParams()
        target = Decimal('0.10')

        lower, upper = params.get_peg_band(target)

        assert lower == Decimal('0.095')  # 0.10 * (1 - 0.05)
        assert upper == Decimal('0.105')  # 0.10 * (1 + 0.05)

    def test_peg_band_with_different_target(self):
        """Test peg band with different target prices."""
        params = PegParams()

        lower1, upper1 = params.get_peg_band(Decimal('0.08'))
        lower2, upper2 = params.get_peg_band(Decimal('0.12'))

        assert upper2 > upper1
        assert lower2 > lower1


class TestTargetPriceComputation:
    """Test target price computation."""

    def test_compute_target_price(self):
        """Test target price computation."""
        controller = PegStabilityController()

        target = controller.compute_target_price(Decimal('0.08'))

        # Formula: β0 + β1 * wholesale_price
        # = 0.10 + 0.0 * 0.08 = 0.10
        assert target == Decimal('0.10')

    def test_target_price_with_beta1(self):
        """Test target price with non-zero β1."""
        controller = PegStabilityController()
        controller.params.beta1 = Decimal('0.5')

        target = controller.compute_target_price(Decimal('0.10'))

        # = 0.10 + 0.5 * 0.10 = 0.15
        expected = Decimal('0.15')
        assert target == expected


class TestPegCorrection:
    """Test peg correction mechanism."""

    def test_price_within_band(self):
        """Test no action when price within band."""
        controller = PegStabilityController()

        needs_action, action, amount = controller.execute_peg_correction(
            spk_market_price=Decimal('0.100'),
            wholesale_price=Decimal('0.08'),
            total_supply=Decimal('1000000')
        )

        assert not needs_action

    def test_price_above_band_triggers_mint(self):
        """Test mint when price above upper band."""
        controller = PegStabilityController()

        needs_action, action, amount = controller.execute_peg_correction(
            spk_market_price=Decimal('0.110'),  # Above 0.105
            wholesale_price=Decimal('0.08'),
            total_supply=Decimal('1000000')
        )

        assert needs_action
        assert action == 'mint'
        assert amount > 0

    def test_price_below_band_triggers_burn(self):
        """Test burn when price below lower band."""
        controller = PegStabilityController()

        needs_action, action, amount = controller.execute_peg_correction(
            spk_market_price=Decimal('0.090'),  # Below 0.095
            wholesale_price=Decimal('0.08'),
            total_supply=Decimal('1000000')
        )

        assert needs_action
        assert action == 'burn'
        assert amount > 0

    def test_exactly_at_upper_bound(self):
        """Test price exactly at upper bound."""
        controller = PegStabilityController()

        needs_action, action, amount = controller.execute_peg_correction(
            spk_market_price=Decimal('0.105'),
            wholesale_price=Decimal('0.08'),
            total_supply=Decimal('1000000')
        )

        assert not needs_action  # Exactly at bound is OK

    def test_exactly_at_lower_bound(self):
        """Test price exactly at lower bound."""
        controller = PegStabilityController()

        needs_action, action, amount = controller.execute_peg_correction(
            spk_market_price=Decimal('0.095'),
            wholesale_price=Decimal('0.08'),
            total_supply=Decimal('1000000')
        )

        assert not needs_action  # Exactly at bound is OK


class TestCorrectionAmount:
    """Test correction amount calculation."""

    def test_correction_proportional_to_deviation(self):
        """Test correction amount proportional to price deviation."""
        controller = PegStabilityController()

        _, _, amount_small = controller.execute_peg_correction(
            spk_market_price=Decimal('0.106'),  # 1% above band
            wholesale_price=Decimal('0.08'),
            total_supply=Decimal('1000000')
        )

        _, _, amount_large = controller.execute_peg_correction(
            spk_market_price=Decimal('0.110'),  # 5% above band
            wholesale_price=Decimal('0.08'),
            total_supply=Decimal('1000000')
        )

        assert amount_large > amount_small

    def test_correction_scales_with_supply(self):
        """Test correction scales with total supply."""
        controller = PegStabilityController()

        _, _, amount_small_supply = controller.execute_peg_correction(
            spk_market_price=Decimal('0.110'),
            wholesale_price=Decimal('0.08'),
            total_supply=Decimal('100000')
        )

        _, _, amount_large_supply = controller.execute_peg_correction(
            spk_market_price=Decimal('0.110'),
            wholesale_price=Decimal('0.08'),
            total_supply=Decimal('1000000')
        )

        assert amount_large_supply > amount_small_supply


class TestPIDController:
    """Test PID controller components."""

    def test_proportional_term(self):
        """Test proportional term responds to current error."""
        controller = PegStabilityController()

        # First deviation
        controller.execute_peg_correction(
            spk_market_price=Decimal('0.110'),
            wholesale_price=Decimal('0.08'),
            total_supply=Decimal('1000000')
        )

        # Proportional term should exist
        assert controller.last_error != 0

    def test_integral_accumulation(self):
        """Test integral term accumulates error over time."""
        controller = PegStabilityController()

        # Multiple corrections
        for _ in range(3):
            controller.execute_peg_correction(
                spk_market_price=Decimal('0.110'),
                wholesale_price=Decimal('0.08'),
                total_supply=Decimal('1000000')
            )

        # Integral should accumulate
        assert controller.integral_error != 0

    def test_derivative_term(self):
        """Test derivative term responds to rate of change."""
        controller = PegStabilityController()

        # First correction
        controller.execute_peg_correction(
            spk_market_price=Decimal('0.110'),
            wholesale_price=Decimal('0.08'),
            total_supply=Decimal('1000000')
        )

        initial_error = controller.last_error

        # Second correction with different price
        controller.execute_peg_correction(
            spk_market_price=Decimal('0.115'),
            wholesale_price=Decimal('0.08'),
            total_supply=Decimal('1000000')
        )

        # Error should have changed (derivative term active)
        assert controller.last_error != initial_error


class TestSeigniorageAuction:
    """Test seigniorage auction mechanism."""

    def test_create_auction(self):
        """Test auction creation."""
        controller = PegStabilityController()

        auction = controller.create_seigniorage_auction(
            spk_amount=Decimal('10000'),
            reserve_price=Decimal('0.11')
        )

        assert auction is not None
        assert auction.spk_amount == Decimal('10000')
        assert auction.reserve_price == Decimal('0.11')
        assert not auction.is_finalized

    def test_auction_bid(self):
        """Test placing bid in auction."""
        controller = PegStabilityController()

        auction = controller.create_seigniorage_auction(
            spk_amount=Decimal('10000'),
            reserve_price=Decimal('0.10')
        )

        success, msg = controller.place_bid(
            auction_id=auction.auction_id,
            bidder="SPKbidder1",
            bid_price=Decimal('0.11')
        )

        assert success
        assert len(auction.bids) == 1

    def test_reject_bid_below_reserve(self):
        """Test reject bid below reserve price."""
        controller = PegStabilityController()

        auction = controller.create_seigniorage_auction(
            spk_amount=Decimal('10000'),
            reserve_price=Decimal('0.10')
        )

        success, msg = controller.place_bid(
            auction_id=auction.auction_id,
            bidder="SPKbidder1",
            bid_price=Decimal('0.09')  # Below reserve
        )

        assert not success
        assert "reserve price" in msg.lower()

    def test_finalize_auction(self):
        """Test auction finalization."""
        controller = PegStabilityController()

        auction = controller.create_seigniorage_auction(
            spk_amount=Decimal('10000'),
            reserve_price=Decimal('0.10')
        )

        controller.place_bid(auction.auction_id, "SPKbidder1", Decimal('0.11'))
        controller.place_bid(auction.auction_id, "SPKbidder2", Decimal('0.12'))

        winner, winning_price = controller.finalize_auction(auction.auction_id)

        assert auction.is_finalized
        assert winner == "SPKbidder2"  # Highest bidder
        assert winning_price == Decimal('0.12')

    def test_reject_bid_after_finalization(self):
        """Test cannot bid after auction finalized."""
        controller = PegStabilityController()

        auction = controller.create_seigniorage_auction(
            spk_amount=Decimal('10000'),
            reserve_price=Decimal('0.10')
        )

        controller.place_bid(auction.auction_id, "SPKbidder1", Decimal('0.11'))
        controller.finalize_auction(auction.auction_id)

        success, msg = controller.place_bid(
            auction_id=auction.auction_id,
            bidder="SPKbidder2",
            bid_price=Decimal('0.12')
        )

        assert not success
        assert "finalized" in msg.lower()


class TestStabilityStatistics:
    """Test stability statistics tracking."""

    def test_get_stability_stats(self):
        """Test stability statistics retrieval."""
        controller = PegStabilityController()

        stats = controller.get_stability_stats()

        assert 'total_corrections' in stats
        assert 'total_minted' in stats
        assert 'total_burned' in stats
        assert 'active_auctions' in stats

    def test_stats_update_after_correction(self):
        """Test statistics update after corrections."""
        controller = PegStabilityController()

        initial_stats = controller.get_stability_stats()
        initial_corrections = initial_stats['total_corrections']

        controller.execute_peg_correction(
            spk_market_price=Decimal('0.110'),
            wholesale_price=Decimal('0.08'),
            total_supply=Decimal('1000000')
        )

        new_stats = controller.get_stability_stats()
        assert new_stats['total_corrections'] == initial_corrections + 1

    def test_mint_tracking(self):
        """Test minted amount tracking."""
        controller = PegStabilityController()

        controller.execute_peg_correction(
            spk_market_price=Decimal('0.110'),
            wholesale_price=Decimal('0.08'),
            total_supply=Decimal('1000000')
        )

        stats = controller.get_stability_stats()
        assert stats['total_minted'] > 0

    def test_burn_tracking(self):
        """Test burned amount tracking."""
        controller = PegStabilityController()

        controller.execute_peg_correction(
            spk_market_price=Decimal('0.090'),
            wholesale_price=Decimal('0.08'),
            total_supply=Decimal('1000000')
        )

        stats = controller.get_stability_stats()
        assert stats['total_burned'] > 0


class TestFeedbackParameter:
    """Test gamma feedback parameter."""

    def test_gamma_affects_correction(self):
        """Test gamma parameter affects correction amount."""
        controller_low = PegStabilityController()
        controller_low.params.gamma = Decimal('0.5')

        controller_high = PegStabilityController()
        controller_high.params.gamma = Decimal('2.0')

        _, _, amount_low = controller_low.execute_peg_correction(
            spk_market_price=Decimal('0.110'),
            wholesale_price=Decimal('0.08'),
            total_supply=Decimal('1000000')
        )

        _, _, amount_high = controller_high.execute_peg_correction(
            spk_market_price=Decimal('0.110'),
            wholesale_price=Decimal('0.08'),
            total_supply=Decimal('1000000')
        )

        assert amount_high > amount_low


class TestEdgeCases:
    """Test edge cases and boundary conditions."""

    def test_very_large_supply(self):
        """Test correction with very large supply."""
        controller = PegStabilityController()

        needs_action, action, amount = controller.execute_peg_correction(
            spk_market_price=Decimal('0.110'),
            wholesale_price=Decimal('0.08'),
            total_supply=Decimal('1000000000')  # 1 billion
        )

        assert needs_action
        assert amount > 0

    def test_very_small_supply(self):
        """Test correction with very small supply."""
        controller = PegStabilityController()

        needs_action, action, amount = controller.execute_peg_correction(
            spk_market_price=Decimal('0.110'),
            wholesale_price=Decimal('0.08'),
            total_supply=Decimal('1000')  # Small supply
        )

        assert needs_action
        assert amount > 0

    def test_extreme_price_deviation(self):
        """Test correction with extreme price deviation."""
        controller = PegStabilityController()

        needs_action, action, amount = controller.execute_peg_correction(
            spk_market_price=Decimal('0.200'),  # 2x target
            wholesale_price=Decimal('0.08'),
            total_supply=Decimal('1000000')
        )

        assert needs_action
        assert action == 'mint'
        assert amount > 0


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
