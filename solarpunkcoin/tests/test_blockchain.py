"""
Comprehensive Test Suite - Blockchain Core
==========================================

Tests for:
- Blockchain data structures
- Transaction creation and validation
- UTXO management
- Block validation
- Merkle tree computation
- Wallet operations
"""

import pytest
from decimal import Decimal
import time

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.blockchain import (
    Blockchain, Block, BlockHeader, Transaction,
    TransactionInput, TransactionOutput, Wallet
)


class TestWallet:
    """Test wallet operations."""

    def test_wallet_creation(self):
        """Test wallet creation generates valid keys."""
        wallet = Wallet()
        assert wallet.address.startswith("SPK")
        assert len(wallet.address) > 10
        assert wallet.private_key is not None

    def test_wallet_signing(self):
        """Test wallet can sign and verify messages."""
        wallet = Wallet()
        message = "test message"
        signature = wallet.sign(message)

        assert signature is not None
        assert len(signature) > 0
        assert wallet.verify(message, signature, wallet.public_key)

    def test_wallet_deterministic(self):
        """Test same private key generates same address."""
        wallet1 = Wallet()
        wallet2 = Wallet(wallet1.private_key)

        assert wallet1.address == wallet2.address
        assert wallet1.public_key == wallet2.public_key


class TestTransaction:
    """Test transaction operations."""

    def test_transaction_creation(self):
        """Test basic transaction creation."""
        tx_input = TransactionInput(
            tx_id="prev_tx_123",
            output_index=0,
            signature="sig123"
        )

        tx_output = TransactionOutput(
            address="SPKrecipient123",
            amount=Decimal('100')
        )

        tx = Transaction(
            inputs=[tx_input],
            outputs=[tx_output],
            timestamp=time.time()
        )

        assert tx.tx_id is not None
        assert len(tx.inputs) == 1
        assert len(tx.outputs) == 1
        assert tx.tx_type == 'regular'

    def test_transaction_types(self):
        """Test different transaction types."""
        for tx_type in ['regular', 'mint', 'burn', 'redeem', 'stake']:
            tx = Transaction(
                inputs=[],
                outputs=[TransactionOutput("SPKaddr", Decimal('10'))],
                timestamp=time.time(),
                tx_type=tx_type
            )
            assert tx.tx_type == tx_type

    def test_mint_transaction(self):
        """Test mint transactions have no inputs."""
        tx = Transaction(
            inputs=[],
            outputs=[TransactionOutput("SPKminter", Decimal('1000'))],
            timestamp=time.time(),
            tx_type='mint',
            metadata={'proof_id': 'proof_123'}
        )

        assert len(tx.inputs) == 0
        assert tx.tx_type == 'mint'
        assert 'proof_id' in tx.metadata

    def test_transaction_metadata(self):
        """Test transaction metadata storage."""
        metadata = {
            'proof_id': 'proof_001',
            'energy_kwh': '1500',
            'oracle_signature': 'sig_xyz'
        }

        tx = Transaction(
            inputs=[],
            outputs=[TransactionOutput("SPKaddr", Decimal('100'))],
            timestamp=time.time(),
            metadata=metadata
        )

        assert tx.metadata == metadata
        assert tx.metadata['proof_id'] == 'proof_001'


class TestBlock:
    """Test block operations."""

    def test_block_creation(self):
        """Test block creation."""
        header = BlockHeader(
            version=1,
            prev_block_hash="prev_hash_123",
            merkle_root="merkle_root_456",
            timestamp=time.time(),
            difficulty=1,
            nonce=0,
            validator="SPKvalidator123",
            peg_price="0.10",
            total_supply="1000000"
        )

        tx = Transaction(
            inputs=[],
            outputs=[TransactionOutput("SPKaddr", Decimal('100'))],
            timestamp=time.time()
        )

        block = Block(
            header=header,
            transactions=[tx],
            height=1
        )

        assert block.height == 1
        assert len(block.transactions) == 1
        assert block.block_hash is not None

    def test_merkle_root_computation(self):
        """Test merkle root computation."""
        header = BlockHeader(
            version=1,
            prev_block_hash="prev",
            merkle_root="",
            timestamp=time.time(),
            difficulty=1,
            nonce=0,
            validator="SPKval",
            peg_price="0.10",
            total_supply="1000"
        )

        txs = [
            Transaction(
                inputs=[],
                outputs=[TransactionOutput(f"SPKaddr{i}", Decimal('10'))],
                timestamp=time.time()
            )
            for i in range(5)
        ]

        block = Block(header=header, transactions=txs, height=1)
        merkle_root = block.compute_merkle_root()

        assert merkle_root is not None
        assert len(merkle_root) > 0

    def test_merkle_root_deterministic(self):
        """Test merkle root is deterministic."""
        header = BlockHeader(
            version=1,
            prev_block_hash="prev",
            merkle_root="",
            timestamp=time.time(),
            difficulty=1,
            nonce=0,
            validator="SPKval",
            peg_price="0.10",
            total_supply="1000"
        )

        txs = [
            Transaction(
                inputs=[],
                outputs=[TransactionOutput("SPKaddr1", Decimal('10'))],
                timestamp=12345.0  # Fixed timestamp
            )
        ]

        block1 = Block(header=header, transactions=txs, height=1)
        block2 = Block(header=header, transactions=txs, height=1)

        root1 = block1.compute_merkle_root()
        root2 = block2.compute_merkle_root()

        assert root1 == root2


class TestBlockchain:
    """Test blockchain operations."""

    def test_blockchain_initialization(self):
        """Test blockchain initializes with genesis block."""
        blockchain = Blockchain()

        assert len(blockchain.chain) == 1
        assert blockchain.chain[0].height == 0
        assert blockchain.total_supply == Decimal('1000000')

    def test_genesis_block(self):
        """Test genesis block properties."""
        blockchain = Blockchain()
        genesis = blockchain.chain[0]

        assert genesis.height == 0
        assert genesis.header.prev_block_hash == "0" * 64
        assert len(genesis.transactions) > 0

    def test_get_balance(self):
        """Test balance retrieval."""
        blockchain = Blockchain()
        genesis_address = blockchain.chain[0].transactions[0].outputs[0].address

        balance = blockchain.get_balance(genesis_address)
        assert balance == Decimal('1000000')

    def test_get_balance_empty_address(self):
        """Test balance of empty address is zero."""
        blockchain = Blockchain()
        balance = blockchain.get_balance("SPKnonexistent")

        assert balance == Decimal('0')

    def test_utxo_set_initialization(self):
        """Test UTXO set populated from genesis."""
        blockchain = Blockchain()

        assert len(blockchain.utxo_set) > 0
        genesis_tx = blockchain.chain[0].transactions[0]
        utxo_key = f"{genesis_tx.tx_id}:0"
        assert utxo_key in blockchain.utxo_set

    def test_add_valid_block(self):
        """Test adding valid block to chain."""
        blockchain = Blockchain()
        initial_height = len(blockchain.chain)

        # Create new block
        prev_block = blockchain.get_latest_block()

        header = BlockHeader(
            version=1,
            prev_block_hash=prev_block.block_hash,
            merkle_root="",
            timestamp=time.time(),
            difficulty=1,
            nonce=0,
            validator="SPKvalidator",
            peg_price="0.10",
            total_supply="1000000"
        )

        tx = Transaction(
            inputs=[],
            outputs=[TransactionOutput("SPKnew", Decimal('100'))],
            timestamp=time.time(),
            tx_type='mint'
        )

        block = Block(
            header=header,
            transactions=[tx],
            height=prev_block.height + 1
        )
        block.header.merkle_root = block.compute_merkle_root()
        block.block_hash = block.header.compute_hash()

        success, error = blockchain.add_block(block)

        assert success
        assert len(blockchain.chain) == initial_height + 1

    def test_reject_invalid_prev_hash(self):
        """Test blockchain rejects block with invalid prev_hash."""
        blockchain = Blockchain()
        prev_block = blockchain.get_latest_block()

        header = BlockHeader(
            version=1,
            prev_block_hash="invalid_hash",  # Wrong!
            merkle_root="",
            timestamp=time.time(),
            difficulty=1,
            nonce=0,
            validator="SPKval",
            peg_price="0.10",
            total_supply="1000000"
        )

        block = Block(
            header=header,
            transactions=[],
            height=prev_block.height + 1
        )
        block.block_hash = block.header.compute_hash()

        success, error = blockchain.add_block(block)

        assert not success
        assert "previous block hash" in error.lower()

    def test_chain_stats(self):
        """Test blockchain statistics."""
        blockchain = Blockchain()
        stats = blockchain.get_chain_stats()

        assert 'height' in stats
        assert 'total_supply' in stats
        assert 'energy_reserve_kwh' in stats
        assert stats['height'] == 0

    def test_get_latest_block(self):
        """Test getting latest block."""
        blockchain = Blockchain()
        latest = blockchain.get_latest_block()

        assert latest.height == len(blockchain.chain) - 1
        assert latest == blockchain.chain[-1]


class TestUTXOManagement:
    """Test UTXO set management."""

    def test_utxo_creation(self):
        """Test UTXO created when transaction added."""
        blockchain = Blockchain()
        initial_utxos = len(blockchain.utxo_set)

        # Create mint transaction
        tx = Transaction(
            inputs=[],
            outputs=[
                TransactionOutput("SPKaddr1", Decimal('50')),
                TransactionOutput("SPKaddr2", Decimal('50'))
            ],
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

        block = Block(header=header, transactions=[tx], height=1)
        block.header.merkle_root = block.compute_merkle_root()
        block.block_hash = block.header.compute_hash()

        blockchain.add_block(block)

        # Should have 2 new UTXOs
        assert len(blockchain.utxo_set) == initial_utxos + 2

    def test_utxo_spending(self):
        """Test UTXO removal when spent."""
        blockchain = Blockchain()
        wallet = Wallet()

        # First mint some coins to wallet
        mint_tx = Transaction(
            inputs=[],
            outputs=[TransactionOutput(wallet.address, Decimal('1000'))],
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

        block = Block(header=header, transactions=[mint_tx], height=1)
        block.header.merkle_root = block.compute_merkle_root()
        block.block_hash = block.header.compute_hash()

        blockchain.add_block(block)

        # Verify UTXO created
        utxo_key = f"{mint_tx.tx_id}:0"
        assert utxo_key in blockchain.utxo_set

        balance_before = blockchain.get_balance(wallet.address)
        assert balance_before == Decimal('1000')


class TestWalletTransactions:
    """Test wallet transaction creation."""

    def test_create_simple_transaction(self):
        """Test wallet creates valid transaction."""
        wallet = Wallet()
        recipient = "SPKrecipient123"

        utxos = [
            ("prev_tx", 0, Decimal('1000'))
        ]

        tx = wallet.create_transaction(
            recipient=recipient,
            amount=Decimal('500'),
            utxos=utxos,
            fee=Decimal('1')
        )

        assert len(tx.inputs) == 1
        assert len(tx.outputs) == 2  # recipient + change

        # Check outputs
        total_out = sum(out.amount for out in tx.outputs)
        assert total_out == Decimal('999')  # 1000 - 1 fee

    def test_transaction_change_output(self):
        """Test change output created correctly."""
        wallet = Wallet()
        recipient = "SPKrecipient"

        utxos = [("tx1", 0, Decimal('1000'))]

        tx = wallet.create_transaction(
            recipient=recipient,
            amount=Decimal('300'),
            utxos=utxos,
            fee=Decimal('1')
        )

        # Find change output (sent back to wallet)
        change_output = [out for out in tx.outputs if out.address == wallet.address]
        assert len(change_output) == 1
        assert change_output[0].amount == Decimal('699')  # 1000 - 300 - 1

    def test_insufficient_funds(self):
        """Test wallet raises error on insufficient funds."""
        wallet = Wallet()
        utxos = [("tx1", 0, Decimal('100'))]

        with pytest.raises(ValueError, match="Insufficient funds"):
            wallet.create_transaction(
                recipient="SPKrecipient",
                amount=Decimal('500'),
                utxos=utxos,
                fee=Decimal('1')
            )

    def test_multiple_utxo_inputs(self):
        """Test transaction using multiple UTXOs."""
        wallet = Wallet()

        utxos = [
            ("tx1", 0, Decimal('100')),
            ("tx2", 0, Decimal('200')),
            ("tx3", 0, Decimal('300'))
        ]

        tx = wallet.create_transaction(
            recipient="SPKrecipient",
            amount=Decimal('500'),
            utxos=utxos,
            fee=Decimal('1')
        )

        assert len(tx.inputs) == 3
        total_out = sum(out.amount for out in tx.outputs)
        assert total_out == Decimal('599')  # 600 - 1 fee


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
