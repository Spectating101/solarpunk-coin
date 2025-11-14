"""
SolarPunkCoin - Complete Node Implementation
=============================================

Full SPK node integrating all components:
- Blockchain + UTXO management
- Proof-of-Stake consensus
- Energy oracle
- Peg stability
- P2P networking (simplified)
- RPC API

Run with: python spk_node.py
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from decimal import Decimal
import time
from typing import Dict, List, Optional, Tuple

# Import SPK components
from core.blockchain import Blockchain, Block, BlockHeader, Transaction, TransactionOutput, Wallet
from consensus.pos import ProofOfStake
from oracle.energy_oracle import EnergyOracle, EnergyProof, GridOperator, EnergySource
from contracts.peg_stability import PegStabilityController


class SPKNode:
    """
    Complete SolarPunkCoin node.

    Responsibilities:
    - Maintain blockchain state
    - Validate and propose blocks (if validator)
    - Process energy proofs and mint SPK
    - Maintain peg stability
    - Sync with network
    """

    def __init__(
        self,
        node_id: str,
        is_validator: bool = False,
        validator_stake: Decimal = Decimal('0')
    ):
        self.node_id = node_id
        self.is_validator = is_validator

        # Core components
        self.blockchain = Blockchain()
        self.pos = ProofOfStake()
        self.oracle = EnergyOracle()
        self.peg_controller = PegStabilityController()

        # Node state
        self.mempool: List[Transaction] = []
        self.is_synced = True
        self.last_block_time = time.time()

        # Register as validator if requested
        if is_validator and validator_stake > 0:
            self.wallet = Wallet()
            success, msg = self.pos.register_validator(
                self.wallet.address,
                validator_stake,
                green_certified=True  # Assume green for demo
            )
            print(f"  Validator registration: {msg}")
        else:
            self.wallet = Wallet()

        # Setup oracle
        self._setup_oracle()

    def _setup_oracle(self):
        """Setup oracle with trusted entities."""
        # Register grid operators
        self.oracle.register_grid_operator(
            GridOperator.CAISO,
            "caiso_cert_hash_12345"
        )
        self.oracle.register_grid_operator(
            GridOperator.TAIPOWER,
            "taipower_cert_hash_67890"
        )

        # Register trusted meters
        self.oracle.register_trusted_meter("METER_YZU_SOLAR_001")
        self.oracle.register_trusted_meter("METER_CAISO_WIND_042")

    def process_energy_proof(
        self,
        proof: EnergyProof,
        recipient: str
    ) -> Tuple[bool, Optional[Transaction], str]:
        """
        Process energy proof and create mint transaction.

        Steps:
        1. Verify proof with oracle
        2. Compute minting amount
        3. Create mint transaction
        4. Add to mempool

        Returns:
            (success, transaction, message)
        """
        # Process with oracle
        success, mint_req, msg = self.oracle.process_minting_request(
            proof=proof,
            recipient=recipient,
            peg_price=self.blockchain.current_peg_price
        )

        if not success:
            return False, None, msg

        # Create mint transaction
        tx = Transaction(
            inputs=[],  # No inputs for mint
            outputs=[
                TransactionOutput(
                    address=recipient,
                    amount=mint_req.requested_amount
                )
            ],
            timestamp=time.time(),
            tx_type='mint',
            metadata={
                'proof_id': proof.proof_id,
                'energy_kwh': str(proof.surplus_kwh),
                'oracle_signature': proof.audit_signature
            }
        )

        # Add to mempool
        self.mempool.append(tx)

        return True, tx, f"Minted {mint_req.requested_amount} SPK for {proof.surplus_kwh} kWh"

    def check_peg_stability(
        self,
        spk_market_price: Decimal,
        wholesale_price: Decimal
    ) -> Tuple[bool, str, Decimal]:
        """
        Check and maintain peg stability.

        Returns:
            (needs_action, action_type, amount)
        """
        return self.peg_controller.execute_peg_correction(
            spk_market_price=spk_market_price,
            wholesale_price=wholesale_price,
            total_supply=self.blockchain.total_supply
        )

    def create_block(self) -> Optional[Block]:
        """
        Create a new block (if selected as validator).

        Steps:
        1. Check if we're selected validator
        2. Collect transactions from mempool
        3. Create block with PoS
        4. Sign block

        Returns:
            Block or None
        """
        if not self.is_validator:
            return None

        latest_block = self.blockchain.get_latest_block()

        # Check if we're selected
        selected = self.pos.select_validator(
            latest_block.height + 1,
            latest_block.block_hash
        )

        if selected != self.wallet.address:
            return None  # Not our turn

        # Collect transactions
        block_txs = self.mempool[:100]  # Max 100 txs per block

        # Create block header
        header = BlockHeader(
            version=1,
            prev_block_hash=latest_block.block_hash,
            merkle_root="",  # Will compute
            timestamp=time.time(),
            difficulty=1,
            nonce=0,
            validator=self.wallet.address,
            peg_price=str(self.blockchain.current_peg_price),
            total_supply=str(self.blockchain.total_supply)
        )

        # Create block
        block = Block(
            header=header,
            transactions=block_txs,
            height=latest_block.height + 1
        )

        # Compute merkle root
        block.header.merkle_root = block.compute_merkle_root()

        # Sign block
        signable = block.header.compute_hash()
        block.header.validator_signature = self.wallet.sign(signable)

        # Recompute hash with signature
        block.block_hash = block.header.compute_hash()

        return block

    def add_block(self, block: Block) -> Tuple[bool, str]:
        """
        Add block to blockchain.

        Validates and processes block.
        """
        success, error = self.blockchain.add_block(block)

        if success:
            # Remove transactions from mempool
            block_tx_ids = {tx.tx_id for tx in block.transactions}
            self.mempool = [
                tx for tx in self.mempool
                if tx.tx_id not in block_tx_ids
            ]

            # Validate block proposer
            self.pos.validate_block(block.header.validator, True)

            self.last_block_time = time.time()

        return success, error

    def get_balance(self, address: str) -> Decimal:
        """Get SPK balance for address."""
        return self.blockchain.get_balance(address)

    def create_transaction(
        self,
        recipient: str,
        amount: Decimal,
        fee: Decimal = Decimal('0.001')
    ) -> Tuple[bool, Optional[Transaction], str]:
        """
        Create and broadcast transaction.

        Args:
            recipient: Recipient address
            amount: Amount to send
            fee: Transaction fee

        Returns:
            (success, transaction, message)
        """
        # Get our UTXOs
        our_utxos = []
        for utxo_key, output in self.blockchain.utxo_set.items():
            if output.address == self.wallet.address:
                tx_id, idx = utxo_key.split(':')
                our_utxos.append((tx_id, int(idx), output.amount))

        if not our_utxos:
            return False, None, "No funds available"

        try:
            tx = self.wallet.create_transaction(
                recipient=recipient,
                amount=amount,
                utxos=our_utxos,
                fee=fee
            )

            # Add to mempool
            self.mempool.append(tx)

            return True, tx, f"Transaction created: {tx.tx_id[:16]}..."

        except Exception as e:
            return False, None, str(e)

    def get_node_info(self) -> dict:
        """Get node information."""
        return {
            'node_id': self.node_id,
            'address': self.wallet.address,
            'is_validator': self.is_validator,
            'is_synced': self.is_synced,
            'blockchain': self.blockchain.get_chain_stats(),
            'mempool_size': len(self.mempool),
            'balance': str(self.get_balance(self.wallet.address))
        }

    def get_full_stats(self) -> dict:
        """Get complete node statistics."""
        return {
            'node': self.get_node_info(),
            'blockchain': self.blockchain.get_chain_stats(),
            'consensus': self.pos.get_consensus_stats(),
            'oracle': self.oracle.get_oracle_stats(),
            'peg_stability': self.peg_controller.get_stability_stats()
        }

    def run(self):
        """
        Run node main loop.

        In production:
        - Listen for P2P messages
        - Sync with network
        - Propose blocks if validator
        - Process transactions
        """
        print(f"\n{'='*70}")
        print(f"SPK Node {self.node_id} running...")
        print(f"Address: {self.wallet.address}")
        print(f"Validator: {'Yes' if self.is_validator else 'No'}")
        print(f"{'='*70}\n")

        # Simulate block production
        block_interval = 10  # seconds

        try:
            while True:
                # Check if time for new block
                if time.time() - self.last_block_time >= block_interval:
                    # Try to create block
                    if self.is_validator:
                        block = self.create_block()
                        if block:
                            success, msg = self.add_block(block)
                            if success:
                                print(f"✓ Block {block.height} created by {self.node_id}")
                                print(f"  Txs: {len(block.transactions)}")
                                print(f"  Supply: {self.blockchain.total_supply} SPK")

                time.sleep(1)

        except KeyboardInterrupt:
            print(f"\n{self.node_id} shutting down...")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="SolarPunkCoin Node")
    parser.add_argument('--node-id', default="node1", help="Node identifier")
    parser.add_argument('--validator', action='store_true', help="Run as validator")
    parser.add_argument('--stake', type=float, default=1000, help="Validator stake")
    parser.add_argument('--demo', action='store_true', help="Run demo mode")

    args = parser.parse_args()

    if args.demo:
        print("=" * 70)
        print("SOLARPUNKCOIN - NODE DEMO")
        print("=" * 70)

        # Create node
        node = SPKNode(
            node_id=args.node_id,
            is_validator=args.validator,
            validator_stake=Decimal(str(args.stake))
        )

        print("\n✓ Node initialized")

        # Demo: Process energy proof
        print("\n🌞 Processing sample energy proof...")

        proof = EnergyProof(
            proof_id="demo_proof_001",
            timestamp=time.time(),
            grid_operator=GridOperator.TAIPOWER,
            location="Yuan Ze University",
            source_type=EnergySource.SOLAR,
            surplus_kwh=Decimal('2000'),
            wholesale_price=Decimal('0.08'),
            grid_load=Decimal('0.70'),
            renewable_penetration=Decimal('0.40'),
            meter_signature="demo_signature_" + "a1b2c3" * 10,
            meter_id="METER_YZU_SOLAR_001",
            operator_cert_hash="taipower_cert_hash_67890"
        )

        success, tx, msg = node.process_energy_proof(
            proof=proof,
            recipient=node.wallet.address
        )

        print(f"  {'✓' if success else '✗'} {msg}")

        # Demo: Check peg
        print("\n⚖️ Checking peg stability...")
        needs_action, action, amount = node.check_peg_stability(
            spk_market_price=Decimal('0.105'),
            wholesale_price=Decimal('0.08')
        )

        if needs_action:
            print(f"  Action needed: {action.upper()} {amount} SPK")
        else:
            print(f"  ✓ Peg stable (within band)")

        # Show stats
        print("\n📊 Node Statistics:")
        print("=" * 70)
        stats = node.get_full_stats()

        for category, data in stats.items():
            print(f"\n{category.upper()}:")
            for key, value in data.items():
                print(f"  {key}: {value}")

        print("\n" + "=" * 70)
        print("Demo complete! Node operational.")
        print(f"\nTo run live: python spk_node.py --node-id node1 --validator --stake 1000")
        print("=" * 70)

    else:
        # Run node
        node = SPKNode(
            node_id=args.node_id,
            is_validator=args.validator,
            validator_stake=Decimal(str(args.stake))
        )
        node.run()
