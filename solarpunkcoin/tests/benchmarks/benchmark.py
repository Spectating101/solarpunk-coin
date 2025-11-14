#!/usr/bin/env python3
"""
SolarPunkCoin - Performance Benchmarks
=======================================

Benchmark the performance of various blockchain operations.

Run with: python benchmark.py
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

import time
from decimal import Decimal
from typing import List, Tuple
import statistics

from core.blockchain import Blockchain, Block, BlockHeader, Transaction, TransactionOutput, Wallet
from consensus.pos import ProofOfStake
from oracle.energy_oracle import EnergyOracle, EnergyProof, GridOperator, EnergySource
from node.spk_node import SPKNode


class Benchmark:
    """Performance benchmark suite."""

    def __init__(self):
        self.results = {}

    def run_all(self):
        """Run all benchmarks."""
        print("=" * 80)
        print("SolarPunkCoin Performance Benchmarks")
        print("=" * 80)
        print()

        benchmarks = [
            ("Transaction Creation", self.bench_transaction_creation),
            ("Block Creation", self.bench_block_creation),
            ("Block Validation", self.bench_block_validation),
            ("UTXO Lookup", self.bench_utxo_lookup),
            ("Validator Selection", self.bench_validator_selection),
            ("Energy Proof Validation", self.bench_energy_proof_validation),
            ("Peg Stability Check", self.bench_peg_stability),
            ("Full Node Operation", self.bench_full_node),
        ]

        for name, bench_func in benchmarks:
            print(f"\n📊 {name}")
            print("-" * 80)
            result = bench_func()
            self.results[name] = result
            print(f"Result: {result}")

        print("\n" + "=" * 80)
        print("Summary")
        print("=" * 80)
        for name, result in self.results.items():
            print(f"{name:.<50} {result}")

        print("\n" + "=" * 80)

    def bench_transaction_creation(self) -> str:
        """Benchmark transaction creation speed."""
        wallet = Wallet()
        utxos = [("tx1", 0, Decimal('1000'))]

        iterations = 1000
        start = time.time()

        for i in range(iterations):
            tx = wallet.create_transaction(
                recipient=f"SPKrecipient{i}",
                amount=Decimal('10'),
                utxos=utxos,
                fee=Decimal('0.001')
            )

        elapsed = time.time() - start
        tps = iterations / elapsed

        return f"{tps:.2f} tx/sec ({elapsed:.3f}s for {iterations} txs)"

    def bench_block_creation(self) -> str:
        """Benchmark block creation speed."""
        blockchain = Blockchain()

        iterations = 100
        start = time.time()

        for i in range(iterations):
            prev_block = blockchain.get_latest_block()

            header = BlockHeader(
                version=1,
                prev_block_hash=prev_block.block_hash,
                merkle_root="",
                timestamp=time.time(),
                difficulty=1,
                nonce=0,
                validator="SPKval",
                peg_price="0.10",
                total_supply="1000000"
            )

            txs = [
                Transaction(
                    inputs=[],
                    outputs=[TransactionOutput(f"SPKaddr{j}", Decimal('10'))],
                    timestamp=time.time(),
                    tx_type='mint'
                )
                for j in range(10)
            ]

            block = Block(header=header, transactions=txs, height=prev_block.height + 1)
            block.header.merkle_root = block.compute_merkle_root()
            block.block_hash = block.header.compute_hash()

            blockchain.add_block(block)

        elapsed = time.time() - start
        bps = iterations / elapsed

        return f"{bps:.2f} blocks/sec ({elapsed:.3f}s for {iterations} blocks)"

    def bench_block_validation(self) -> str:
        """Benchmark block validation speed."""
        blockchain = Blockchain()

        # Create test blocks
        blocks = []
        for i in range(100):
            prev_block = blockchain.get_latest_block()

            header = BlockHeader(
                version=1,
                prev_block_hash=prev_block.block_hash,
                merkle_root="",
                timestamp=time.time(),
                difficulty=1,
                nonce=0,
                validator="SPKval",
                peg_price="0.10",
                total_supply=str(blockchain.total_supply)
            )

            block = Block(header=header, transactions=[], height=prev_block.height + 1)
            block.header.merkle_root = block.compute_merkle_root()
            block.block_hash = block.header.compute_hash()

            blocks.append(block)
            blockchain.add_block(block)

        # Benchmark validation
        start = time.time()

        for block in blocks:
            # Validate block structure
            is_valid = (
                block.block_hash is not None and
                block.header.merkle_root is not None
            )

        elapsed = time.time() - start
        validations_per_sec = len(blocks) / elapsed

        return f"{validations_per_sec:.2f} validations/sec ({elapsed:.3f}s for {len(blocks)} blocks)"

    def bench_utxo_lookup(self) -> str:
        """Benchmark UTXO lookup speed."""
        blockchain = Blockchain()

        # Create UTXOs
        for i in range(1000):
            tx = Transaction(
                inputs=[],
                outputs=[TransactionOutput(f"SPKaddr{i}", Decimal('10'))],
                timestamp=time.time(),
                tx_type='mint'
            )

            prev_block = blockchain.get_latest_block()
            header = BlockHeader(
                version=1,
                prev_block_hash=prev_block.block_hash,
                merkle_root="",
                timestamp=time.time(),
                difficulty=1,
                nonce=0,
                validator="SPKval",
                peg_price="0.10",
                total_supply=str(blockchain.total_supply)
            )

            block = Block(header=header, transactions=[tx], height=prev_block.height + 1)
            block.header.merkle_root = block.compute_merkle_root()
            block.block_hash = block.header.compute_hash()

            blockchain.add_block(block)

        # Benchmark lookups
        iterations = 10000
        start = time.time()

        for i in range(iterations):
            address = f"SPKaddr{i % 1000}"
            balance = blockchain.get_balance(address)

        elapsed = time.time() - start
        lookups_per_sec = iterations / elapsed

        return f"{lookups_per_sec:.2f} lookups/sec ({elapsed:.3f}s for {iterations} lookups)"

    def bench_validator_selection(self) -> str:
        """Benchmark validator selection speed."""
        pos = ProofOfStake()

        # Register validators
        for i in range(100):
            pos.register_validator(
                address=f"SPKval{i}",
                stake=Decimal(str(1000 + i * 100)),
                green_certified=(i % 2 == 0)
            )

        iterations = 1000
        start = time.time()

        for i in range(iterations):
            selected = pos.select_validator(i, f"hash_{i}")

        elapsed = time.time() - start
        selections_per_sec = iterations / elapsed

        return f"{selections_per_sec:.2f} selections/sec ({elapsed:.3f}s for {iterations} selections)"

    def bench_energy_proof_validation(self) -> str:
        """Benchmark energy proof validation speed."""
        oracle = EnergyOracle()
        oracle.register_grid_operator(GridOperator.TAIPOWER, "cert123")
        oracle.register_trusted_meter("METER_001")

        iterations = 1000
        start = time.time()

        for i in range(iterations):
            proof = EnergyProof(
                proof_id=f"proof_{i}",
                timestamp=time.time(),
                grid_operator=GridOperator.TAIPOWER,
                location="Test Location",
                source_type=EnergySource.SOLAR,
                surplus_kwh=Decimal('1000'),
                wholesale_price=Decimal('0.08'),
                grid_load=Decimal('0.70'),
                renewable_penetration=Decimal('0.35'),
                meter_signature="sig123",
                meter_id="METER_001",
                operator_cert_hash="cert123"
            )

            is_valid, error = oracle.validate_energy_proof(proof)

        elapsed = time.time() - start
        validations_per_sec = iterations / elapsed

        return f"{validations_per_sec:.2f} validations/sec ({elapsed:.3f}s for {iterations} proofs)"

    def bench_peg_stability(self) -> str:
        """Benchmark peg stability checks."""
        node = SPKNode("bench_node", False)

        iterations = 1000
        start = time.time()

        for i in range(iterations):
            needs_action, action, amount = node.check_peg_stability(
                spk_market_price=Decimal('0.105'),
                wholesale_price=Decimal('0.08')
            )

        elapsed = time.time() - start
        checks_per_sec = iterations / elapsed

        return f"{checks_per_sec:.2f} checks/sec ({elapsed:.3f}s for {iterations} checks)"

    def bench_full_node(self) -> str:
        """Benchmark full node operations."""
        node = SPKNode("bench_node", True, Decimal('1000'))

        # Simulate node operations
        start = time.time()

        # Process energy proofs
        for i in range(10):
            proof = EnergyProof(
                proof_id=f"bench_proof_{i}",
                timestamp=time.time(),
                grid_operator=GridOperator.TAIPOWER,
                location="Test",
                source_type=EnergySource.SOLAR,
                surplus_kwh=Decimal('1000'),
                wholesale_price=Decimal('0.08'),
                grid_load=Decimal('0.70'),
                renewable_penetration=Decimal('0.35'),
                meter_signature="sig",
                meter_id="METER_YZU_SOLAR_001",
                operator_cert_hash="taipower_cert_hash_67890"
            )

            node.process_energy_proof(proof, node.wallet.address)

        # Create blocks
        for i in range(5):
            block = node.create_block()
            if block:
                node.add_block(block)

        elapsed = time.time() - start

        return f"{elapsed:.3f}s for 10 energy proofs + 5 blocks"


def main():
    """Run benchmarks."""
    bench = Benchmark()
    bench.run_all()


if __name__ == "__main__":
    main()
