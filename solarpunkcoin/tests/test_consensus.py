"""
Comprehensive Test Suite - Proof-of-Stake Consensus
===================================================

Tests for:
- Validator registration
- Stake-weighted selection
- Green certification bonuses
- Reputation system
- Slashing mechanics
- Epoch rewards
"""

import pytest
from decimal import Decimal
import time

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from consensus.pos import ProofOfStake, Validator, ConsensusParams


class TestValidatorRegistration:
    """Test validator registration."""

    def test_register_validator(self):
        """Test basic validator registration."""
        pos = ProofOfStake()

        success, msg = pos.register_validator(
            address="SPKval1",
            stake=Decimal('1000'),
            green_certified=False
        )

        assert success
        assert "SPKval1" in pos.validators

    def test_register_green_validator(self):
        """Test green-certified validator registration."""
        pos = ProofOfStake()

        success, msg = pos.register_validator(
            address="SPKval_green",
            stake=Decimal('1000'),
            green_certified=True
        )

        assert success
        validator = pos.validators["SPKval_green"]
        assert validator.green_certified

    def test_minimum_stake_requirement(self):
        """Test minimum stake requirement enforced."""
        pos = ProofOfStake()

        success, msg = pos.register_validator(
            address="SPKval_low",
            stake=Decimal('50'),  # Below minimum
            green_certified=False
        )

        assert not success
        assert "minimum stake" in msg.lower()

    def test_duplicate_validator_registration(self):
        """Test cannot register same validator twice."""
        pos = ProofOfStake()

        pos.register_validator("SPKval1", Decimal('1000'), False)

        success, msg = pos.register_validator("SPKval1", Decimal('500'), False)

        assert not success
        assert "already registered" in msg.lower()

    def test_validator_initial_reputation(self):
        """Test new validators start with reputation 100."""
        pos = ProofOfStake()

        pos.register_validator("SPKval1", Decimal('1000'), False)
        validator = pos.validators["SPKval1"]

        assert validator.reputation == 100

    def test_validator_active_by_default(self):
        """Test validators are active by default."""
        pos = ProofOfStake()

        pos.register_validator("SPKval1", Decimal('1000'), False)
        validator = pos.validators["SPKval1"]

        assert validator.is_active


class TestValidatorSelection:
    """Test validator selection algorithm."""

    def test_select_validator(self):
        """Test validator selection returns valid address."""
        pos = ProofOfStake()

        # Register validators
        pos.register_validator("SPKval1", Decimal('1000'), False)
        pos.register_validator("SPKval2", Decimal('500'), False)

        selected = pos.select_validator(
            block_height=10,
            prev_block_hash="prev_hash_123"
        )

        assert selected in ["SPKval1", "SPKval2"]

    def test_only_active_validators_selected(self):
        """Test only active validators can be selected."""
        pos = ProofOfStake()

        pos.register_validator("SPKval_active", Decimal('1000'), False)
        pos.register_validator("SPKval_inactive", Decimal('1000'), False)

        # Deactivate one
        pos.validators["SPKval_inactive"].is_active = False

        # Select many times - should only get active validator
        for i in range(10):
            selected = pos.select_validator(i, f"hash_{i}")
            assert selected == "SPKval_active"

    def test_higher_stake_higher_probability(self):
        """Test higher stake increases selection probability."""
        pos = ProofOfStake()

        pos.register_validator("SPKval_high", Decimal('10000'), False)
        pos.register_validator("SPKval_low", Decimal('100'), False)

        # Select many times
        selections = {}
        for i in range(100):
            selected = pos.select_validator(i, f"hash_{i}")
            selections[selected] = selections.get(selected, 0) + 1

        # High stake should be selected more
        assert selections.get("SPKval_high", 0) > selections.get("SPKval_low", 0)

    def test_green_certification_bonus(self):
        """Test green certification increases selection weight."""
        pos = ProofOfStake()

        # Same stake, one green certified
        pos.register_validator("SPKval_green", Decimal('1000'), True)
        pos.register_validator("SPKval_regular", Decimal('1000'), False)

        # Select many times
        selections = {}
        for i in range(100):
            selected = pos.select_validator(i, f"hash_{i}")
            selections[selected] = selections.get(selected, 0) + 1

        # Green should be selected more (2x weight)
        assert selections.get("SPKval_green", 0) > selections.get("SPKval_regular", 0)

    def test_reputation_affects_selection(self):
        """Test reputation affects selection probability."""
        pos = ProofOfStake()

        pos.register_validator("SPKval_high_rep", Decimal('1000'), False)
        pos.register_validator("SPKval_low_rep", Decimal('1000'), False)

        # Modify reputation
        pos.validators["SPKval_high_rep"].reputation = 100
        pos.validators["SPKval_low_rep"].reputation = 20

        # Select many times
        selections = {}
        for i in range(100):
            selected = pos.select_validator(i, f"hash_{i}")
            selections[selected] = selections.get(selected, 0) + 1

        # High reputation should be selected more
        assert selections.get("SPKval_high_rep", 0) > selections.get("SPKval_low_rep", 0)

    def test_deterministic_for_same_inputs(self):
        """Test selection is deterministic for same inputs."""
        pos = ProofOfStake()

        pos.register_validator("SPKval1", Decimal('1000'), False)
        pos.register_validator("SPKval2", Decimal('500'), False)

        selected1 = pos.select_validator(10, "hash_abc")
        selected2 = pos.select_validator(10, "hash_abc")

        assert selected1 == selected2


class TestStakeManagement:
    """Test stake updates."""

    def test_add_stake(self):
        """Test adding stake to validator."""
        pos = ProofOfStake()

        pos.register_validator("SPKval1", Decimal('1000'), False)

        success, msg = pos.add_stake("SPKval1", Decimal('500'))

        assert success
        assert pos.validators["SPKval1"].stake == Decimal('1500')

    def test_add_stake_nonexistent_validator(self):
        """Test cannot add stake to nonexistent validator."""
        pos = ProofOfStake()

        success, msg = pos.add_stake("SPKnonexistent", Decimal('100'))

        assert not success

    def test_remove_stake(self):
        """Test removing stake from validator."""
        pos = ProofOfStake()

        pos.register_validator("SPKval1", Decimal('1000'), False)

        success, msg = pos.remove_stake("SPKval1", Decimal('300'))

        assert success
        assert pos.validators["SPKval1"].stake == Decimal('700')

    def test_cannot_remove_below_minimum(self):
        """Test cannot remove stake below minimum."""
        pos = ProofOfStake()

        pos.register_validator("SPKval1", Decimal('200'), False)

        success, msg = pos.remove_stake("SPKval1", Decimal('150'))

        assert not success
        assert "minimum stake" in msg.lower()

    def test_remove_stake_deactivates_if_below_minimum(self):
        """Test validator deactivated if stake falls below minimum."""
        pos = ProofOfStake()

        pos.register_validator("SPKval1", Decimal('200'), False)

        # Force stake below minimum
        pos.validators["SPKval1"].stake = Decimal('50')

        # Validator should be inactive
        selected = pos.select_validator(1, "hash")
        assert selected is None  # No active validators


class TestSlashing:
    """Test slashing mechanics."""

    def test_slash_validator(self):
        """Test slashing reduces stake."""
        pos = ProofOfStake()

        pos.register_validator("SPKval_bad", Decimal('1000'), False)

        success, slashed_amount, msg = pos.slash_validator("SPKval_bad")

        assert success
        assert slashed_amount == Decimal('100')  # 10%
        assert pos.validators["SPKval_bad"].stake == Decimal('900')

    def test_slash_reduces_reputation(self):
        """Test slashing reduces reputation."""
        pos = ProofOfStake()

        pos.register_validator("SPKval_bad", Decimal('1000'), False)
        initial_reputation = pos.validators["SPKval_bad"].reputation

        pos.slash_validator("SPKval_bad")

        assert pos.validators["SPKval_bad"].reputation < initial_reputation

    def test_slash_nonexistent_validator(self):
        """Test cannot slash nonexistent validator."""
        pos = ProofOfStake()

        success, amount, msg = pos.slash_validator("SPKnonexistent")

        assert not success

    def test_multiple_slashes(self):
        """Test multiple slashes compound."""
        pos = ProofOfStake()

        pos.register_validator("SPKval_bad", Decimal('1000'), False)

        pos.slash_validator("SPKval_bad")
        stake_after_1 = pos.validators["SPKval_bad"].stake

        pos.slash_validator("SPKval_bad")
        stake_after_2 = pos.validators["SPKval_bad"].stake

        assert stake_after_2 < stake_after_1

    def test_slash_deactivates_if_too_low(self):
        """Test validator deactivated if slashed below minimum."""
        pos = ProofOfStake()

        pos.register_validator("SPKval_bad", Decimal('110'), False)

        pos.slash_validator("SPKval_bad")  # 10% slash = 11, leaves 99

        assert not pos.validators["SPKval_bad"].is_active


class TestReputationSystem:
    """Test reputation mechanics."""

    def test_validate_block_increases_reputation(self):
        """Test successful validation increases reputation."""
        pos = ProofOfStake()

        pos.register_validator("SPKval_good", Decimal('1000'), False)
        initial_reputation = pos.validators["SPKval_good"].reputation

        pos.validate_block("SPKval_good", success=True)

        assert pos.validators["SPKval_good"].reputation > initial_reputation

    def test_invalid_block_decreases_reputation(self):
        """Test invalid block decreases reputation."""
        pos = ProofOfStake()

        pos.register_validator("SPKval_bad", Decimal('1000'), False)
        initial_reputation = pos.validators["SPKval_bad"].reputation

        pos.validate_block("SPKval_bad", success=False)

        assert pos.validators["SPKval_bad"].reputation < initial_reputation

    def test_reputation_capped_at_100(self):
        """Test reputation cannot exceed 100."""
        pos = ProofOfStake()

        pos.register_validator("SPKval_good", Decimal('1000'), False)
        pos.validators["SPKval_good"].reputation = 100

        # Validate many blocks
        for _ in range(10):
            pos.validate_block("SPKval_good", success=True)

        assert pos.validators["SPKval_good"].reputation == 100

    def test_reputation_floored_at_zero(self):
        """Test reputation cannot go below 0."""
        pos = ProofOfStake()

        pos.register_validator("SPKval_bad", Decimal('1000'), False)
        pos.validators["SPKval_bad"].reputation = 5

        # Invalidate many blocks
        for _ in range(10):
            pos.validate_block("SPKval_bad", success=False)

        assert pos.validators["SPKval_bad"].reputation >= 0


class TestEpochRewards:
    """Test epoch reward distribution."""

    def test_distribute_rewards(self):
        """Test rewards distributed to validators."""
        pos = ProofOfStake()

        pos.register_validator("SPKval1", Decimal('1000'), False)
        pos.register_validator("SPKval2", Decimal('500'), False)

        initial_stake1 = pos.validators["SPKval1"].stake
        initial_stake2 = pos.validators["SPKval2"].stake

        total_reward = Decimal('100')
        pos.distribute_epoch_rewards(total_reward)

        # Validators should have more stake
        assert pos.validators["SPKval1"].stake > initial_stake1
        assert pos.validators["SPKval2"].stake > initial_stake2

    def test_rewards_proportional_to_stake(self):
        """Test rewards distributed proportionally to stake."""
        pos = ProofOfStake()

        pos.register_validator("SPKval_high", Decimal('2000'), False)
        pos.register_validator("SPKval_low", Decimal('1000'), False)

        initial_high = pos.validators["SPKval_high"].stake
        initial_low = pos.validators["SPKval_low"].stake

        pos.distribute_epoch_rewards(Decimal('300'))

        reward_high = pos.validators["SPKval_high"].stake - initial_high
        reward_low = pos.validators["SPKval_low"].stake - initial_low

        # High stake should get 2x reward
        assert reward_high == reward_low * 2


class TestConsensusStats:
    """Test consensus statistics."""

    def test_get_consensus_stats(self):
        """Test consensus statistics retrieval."""
        pos = ProofOfStake()

        pos.register_validator("SPKval1", Decimal('1000'), True)
        pos.register_validator("SPKval2", Decimal('500'), False)

        stats = pos.get_consensus_stats()

        assert stats['total_validators'] == 2
        assert stats['active_validators'] == 2
        assert stats['total_staked'] == Decimal('1500')

    def test_green_stake_percentage(self):
        """Test green stake percentage calculation."""
        pos = ProofOfStake()

        pos.register_validator("SPKval_green", Decimal('600'), True)
        pos.register_validator("SPKval_regular", Decimal('400'), False)

        stats = pos.get_consensus_stats()

        assert stats['green_stake_percentage'] == 60.0

    def test_get_all_validators(self):
        """Test retrieving all validators."""
        pos = ProofOfStake()

        pos.register_validator("SPKval1", Decimal('1000'), True)
        pos.register_validator("SPKval2", Decimal('500'), False)

        validators = pos.get_all_validators()

        assert len(validators) == 2
        assert all('address' in v for v in validators)
        assert all('stake' in v for v in validators)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
