"""
SolarPunkCoin - Proof-of-Stake Consensus
=========================================

Green consensus mechanism for SPK following Rule F:
"Environmental Footprint Cap - PoS with certified green stake"

Features:
- Stake-based validator selection
- Slashing for misbehavior
- Epoch-based rewards
- Energy-efficient (no mining)
"""

import random
import time
from typing import List, Dict, Optional, Tuple
from decimal import Decimal
from dataclasses import dataclass, field


@dataclass
class Validator:
    """
    PoS Validator node.

    Attributes:
        address: SPK address
        stake: Amount of SPK staked
        is_active: Currently validating
        reputation: Score (0-100), decreases with slashing
        blocks_proposed: Total blocks proposed
        blocks_validated: Total blocks validated
        last_active: Timestamp of last activity
        green_certified: Has renewable energy cert (Rule F)
    """
    address: str
    stake: Decimal
    is_active: bool = True
    reputation: int = 100
    blocks_proposed: int = 0
    blocks_validated: int = 0
    last_active: float = field(default_factory=time.time)
    green_certified: bool = False
    join_time: float = field(default_factory=time.time)

    def can_validate(self) -> bool:
        """Check if validator can participate."""
        return (
            self.is_active and
            self.reputation >= 50 and
            self.stake >= Decimal('100')  # Minimum stake: 100 SPK
        )


class ProofOfStake:
    """
    Proof-of-Stake consensus engine for SPK.

    Selection algorithm:
    - Weighted random selection based on stake
    - Green-certified validators get 2x weight (Rule F)
    - Reputation affects selection probability
    - Penalties for misbehavior
    """

    def __init__(
        self,
        min_stake: Decimal = Decimal('100'),
        block_reward: Decimal = Decimal('10'),
        slash_penalty: Decimal = Decimal('0.1'),  # 10% slash
        epoch_length: int = 100  # blocks per epoch
    ):
        self.validators: Dict[str, Validator] = {}
        self.min_stake = min_stake
        self.block_reward = block_reward
        self.slash_penalty = slash_penalty
        self.epoch_length = epoch_length

        self.current_epoch = 0
        self.blocks_in_epoch = 0

    def register_validator(
        self,
        address: str,
        stake: Decimal,
        green_certified: bool = False
    ) -> Tuple[bool, str]:
        """
        Register a new validator.

        Args:
            address: Validator address
            stake: Initial stake amount
            green_certified: Has renewable energy certification

        Returns:
            (success, message)
        """
        if stake < self.min_stake:
            return False, f"Minimum stake is {self.min_stake} SPK"

        if address in self.validators:
            return False, "Validator already registered"

        validator = Validator(
            address=address,
            stake=stake,
            green_certified=green_certified
        )

        self.validators[address] = validator
        return True, f"Validator {address[:12]}... registered with {stake} SPK"

    def add_stake(self, address: str, amount: Decimal) -> Tuple[bool, str]:
        """Add stake to existing validator."""
        if address not in self.validators:
            return False, "Validator not found"

        self.validators[address].stake += amount
        return True, f"Added {amount} SPK to stake (total: {self.validators[address].stake})"

    def remove_stake(self, address: str, amount: Decimal) -> Tuple[bool, str]:
        """Remove stake (with 7-day unbonding period in production)."""
        if address not in self.validators:
            return False, "Validator not found"

        validator = self.validators[address]

        if validator.stake - amount < self.min_stake:
            return False, f"Cannot reduce stake below minimum ({self.min_stake})"

        validator.stake -= amount
        return True, f"Removed {amount} SPK from stake"

    def select_validator(self, block_height: int, prev_block_hash: str) -> Optional[str]:
        """
        Select next block validator using weighted random selection.

        Weighting:
        - Base weight = stake amount
        - 2x multiplier for green-certified (Rule F)
        - Reputation multiplier (0.5x to 1.0x based on reputation)
        - Deterministic based on previous block hash (for consensus)

        Args:
            block_height: Current block height
            prev_block_hash: Previous block hash (for determinism)

        Returns:
            Validator address or None
        """
        # Get eligible validators
        eligible = [v for v in self.validators.values() if v.can_validate()]

        if not eligible:
            return None

        # Compute weights
        weights = []
        addresses = []

        for v in eligible:
            # Base weight from stake
            weight = float(v.stake)

            # Green certification bonus (Rule F: Environmental Footprint Cap)
            if v.green_certified:
                weight *= 2.0

            # Reputation multiplier (50-100 maps to 0.5x-1.0x)
            reputation_mult = 0.5 + (v.reputation / 200.0)
            weight *= reputation_mult

            weights.append(weight)
            addresses.append(v.address)

        # Deterministic selection based on prev block hash
        # (In production, use VRF for security)
        seed = int(prev_block_hash[:16], 16) + block_height
        random.seed(seed)

        selected = random.choices(addresses, weights=weights, k=1)[0]

        # Update validator stats
        self.validators[selected].blocks_proposed += 1
        self.validators[selected].last_active = time.time()

        return selected

    def validate_block(self, validator_address: str, block_valid: bool) -> Tuple[bool, str]:
        """
        Record block validation result.

        Args:
            validator_address: Validator who proposed block
            block_valid: Whether block was valid

        Returns:
            (success, message)
        """
        if validator_address not in self.validators:
            return False, "Validator not found"

        validator = self.validators[validator_address]

        if block_valid:
            # Reward validator
            validator.blocks_validated += 1

            # Small reputation boost for good behavior
            if validator.reputation < 100:
                validator.reputation = min(100, validator.reputation + 1)

            return True, f"Block validated, reward: {self.block_reward} SPK"

        else:
            # Slash validator for invalid block
            slash_amount = validator.stake * self.slash_penalty
            validator.stake -= slash_amount

            # Reputation penalty
            validator.reputation = max(0, validator.reputation - 10)

            # Deactivate if stake too low
            if validator.stake < self.min_stake:
                validator.is_active = False

            return False, f"Invalid block! Slashed {slash_amount} SPK, reputation: {validator.reputation}"

    def process_epoch_end(self) -> Dict[str, Decimal]:
        """
        Process end of epoch - distribute rewards.

        Returns:
            Dict of {address: reward_amount}
        """
        self.current_epoch += 1
        self.blocks_in_epoch = 0

        # Distribute rewards to active validators
        rewards = {}

        total_stake = sum(
            v.stake for v in self.validators.values()
            if v.is_active
        )

        if total_stake == 0:
            return {}

        # Proportional rewards based on stake
        epoch_reward_pool = self.block_reward * Decimal(self.epoch_length)

        for address, validator in self.validators.items():
            if validator.is_active:
                stake_ratio = validator.stake / total_stake
                reward = epoch_reward_pool * stake_ratio
                rewards[address] = reward

        return rewards

    def get_validator_info(self, address: str) -> Optional[dict]:
        """Get validator information."""
        if address not in self.validators:
            return None

        v = self.validators[address]
        return {
            'address': v.address,
            'stake': str(v.stake),
            'is_active': v.is_active,
            'reputation': v.reputation,
            'blocks_proposed': v.blocks_proposed,
            'blocks_validated': v.blocks_validated,
            'green_certified': v.green_certified,
            'join_time': v.join_time
        }

    def get_all_validators(self) -> List[dict]:
        """Get all validators."""
        return [
            self.get_validator_info(addr)
            for addr in self.validators.keys()
        ]

    def get_consensus_stats(self) -> dict:
        """Get consensus statistics."""
        active_validators = [v for v in self.validators.values() if v.is_active]
        green_validators = [v for v in active_validators if v.green_certified]

        total_stake = sum(v.stake for v in active_validators)
        green_stake = sum(v.stake for v in green_validators)

        return {
            'total_validators': len(self.validators),
            'active_validators': len(active_validators),
            'green_certified_validators': len(green_validators),
            'total_stake': str(total_stake),
            'green_stake': str(green_stake),
            'green_stake_percentage': float(green_stake / total_stake * 100) if total_stake > 0 else 0,
            'current_epoch': self.current_epoch,
            'min_stake': str(self.min_stake),
            'block_reward': str(self.block_reward)
        }


# ============================================================================
# SLASHING CONDITIONS
# ============================================================================

class SlashingRule:
    """
    Defines slashing conditions for PoS.

    Validators are slashed for:
    - Double signing (proposing two blocks at same height)
    - Invalid blocks
    - Prolonged inactivity
    - Voting on incorrect chain
    """

    @staticmethod
    def check_double_sign(
        validator_signatures: Dict[int, List[Tuple[str, str]]]  # height -> [(validator, block_hash)]
    ) -> List[Tuple[str, str]]:
        """
        Detect double-signing violations.

        Returns:
            List of (validator_address, evidence)
        """
        violations = []

        for height, signatures in validator_signatures.items():
            # Group by validator
            by_validator = {}
            for validator, block_hash in signatures:
                if validator not in by_validator:
                    by_validator[validator] = []
                by_validator[validator].append(block_hash)

            # Check for multiple signatures at same height
            for validator, block_hashes in by_validator.items():
                if len(set(block_hashes)) > 1:
                    evidence = f"Double sign at height {height}: {block_hashes}"
                    violations.append((validator, evidence))

        return violations

    @staticmethod
    def check_inactivity(
        validator: Validator,
        current_time: float,
        max_inactivity_seconds: float = 86400 * 7  # 7 days
    ) -> bool:
        """Check if validator has been inactive too long."""
        return (current_time - validator.last_active) > max_inactivity_seconds


if __name__ == "__main__":
    print("=" * 70)
    print("SOLARPUNKCOIN - Proof-of-Stake Consensus Test")
    print("=" * 70)

    # Create PoS engine
    pos = ProofOfStake()

    # Register validators
    print("\n📝 Registering validators...")
    validators = [
        ("SPK1a2b3c4d5e6f", Decimal('500'), True),   # Green certified
        ("SPK2b3c4d5e6f7g", Decimal('300'), False),
        ("SPK3c4d5e6f7g8h", Decimal('1000'), True),  # Green certified, large stake
        ("SPK4d5e6f7g8h9i", Decimal('150'), False),
    ]

    for addr, stake, green in validators:
        success, msg = pos.register_validator(addr, stake, green)
        print(f"  {'✓' if success else '✗'} {msg}")

    # Get stats
    print("\n📊 Consensus statistics:")
    stats = pos.get_consensus_stats()
    for key, value in stats.items():
        print(f"  {key}: {value}")

    # Select validator for next block
    print("\n🎲 Selecting validators for next 5 blocks...")
    for height in range(1, 6):
        prev_hash = f"{height:064x}"  # Dummy hash
        selected = pos.select_validator(height, prev_hash)
        validator_info = pos.get_validator_info(selected)
        green_badge = "🌱" if validator_info['green_certified'] else "⚡"
        print(f"  Block {height}: {selected[:16]}... {green_badge} (stake: {validator_info['stake']})")

    print("\n" + "=" * 70)
    print("Proof-of-Stake consensus operational!")
    print("Green validators have 2x selection weight (Rule F)")
    print("=" * 70)
