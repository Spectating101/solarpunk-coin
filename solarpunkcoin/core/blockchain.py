"""
SolarPunkCoin - Core Blockchain Data Structures
================================================

Implements the fundamental blockchain primitives for SPK:
- Transactions
- Blocks
- Blockchain
- UTXOs

All following the SPK whitepaper specifications.
"""

import hashlib
import json
import time
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass, field, asdict
from decimal import Decimal
import ecdsa
from ecdsa import SigningKey, VerifyingKey, SECP256k1


# ============================================================================
# TRANSACTION STRUCTURES
# ============================================================================

@dataclass
class TransactionInput:
    """Reference to a previous transaction output (UTXO)."""
    tx_id: str  # Transaction hash
    output_index: int  # Which output in that transaction
    signature: str = ""  # Signature proving ownership
    public_key: str = ""  # Public key of spender

    def to_dict(self) -> dict:
        return asdict(self)

    def signable_data(self) -> str:
        """Data that gets signed (excludes signature itself)."""
        return f"{self.tx_id}{self.output_index}{self.public_key}"


@dataclass
class TransactionOutput:
    """Output that can be spent (UTXO)."""
    address: str  # Recipient address
    amount: Decimal  # Amount in SPK

    def to_dict(self) -> dict:
        return {
            'address': self.address,
            'amount': str(self.amount)  # Serialize Decimal as string
        }


@dataclass
class Transaction:
    """
    SPK Transaction.

    Types:
    - 'regular': Normal transfer
    - 'mint': Energy-backed minting (oracle-verified)
    - 'burn': Peg stability burn
    - 'redeem': Redeem SPK for energy credits
    - 'stake': Stake for validator
    - 'unstake': Withdraw stake
    """

    inputs: List[TransactionInput]
    outputs: List[TransactionOutput]
    timestamp: float
    tx_type: str = 'regular'  # regular, mint, burn, redeem, stake, unstake
    metadata: Dict = field(default_factory=dict)  # Extra data (e.g., energy proof)

    # Computed fields
    tx_id: str = ""
    fee: Decimal = Decimal('0')

    def __post_init__(self):
        """Compute transaction ID if not set."""
        if not self.tx_id:
            self.tx_id = self.compute_hash()

    def compute_hash(self) -> str:
        """Compute transaction ID (hash of contents)."""
        tx_dict = {
            'inputs': [inp.to_dict() for inp in self.inputs],
            'outputs': [out.to_dict() for out in self.outputs],
            'timestamp': self.timestamp,
            'tx_type': self.tx_type,
            'metadata': self.metadata
        }
        tx_string = json.dumps(tx_dict, sort_keys=True)
        return hashlib.sha256(tx_string.encode()).hexdigest()

    def to_dict(self) -> dict:
        return {
            'tx_id': self.tx_id,
            'inputs': [inp.to_dict() for inp in self.inputs],
            'outputs': [out.to_dict() for out in self.outputs],
            'timestamp': self.timestamp,
            'tx_type': self.tx_type,
            'metadata': self.metadata,
            'fee': str(self.fee)
        }

    def get_input_sum(self) -> Decimal:
        """Total input amount (requires UTXO lookup in real implementation)."""
        # In practice, look up each input's amount from UTXO set
        return sum((Decimal(self.metadata.get(f'input_{i}_amount', '0'))
                   for i in range(len(self.inputs))), Decimal('0'))

    def get_output_sum(self) -> Decimal:
        """Total output amount."""
        return sum(out.amount for out in self.outputs)

    def validate_basic(self) -> Tuple[bool, str]:
        """
        Basic validation (structure, not signatures/UTXOs).

        Returns (valid, error_message)
        """
        # Check outputs are positive
        for out in self.outputs:
            if out.amount <= 0:
                return False, f"Invalid output amount: {out.amount}"

        # Type-specific checks
        if self.tx_type == 'mint':
            # Mint must have energy proof
            if 'energy_kwh' not in self.metadata:
                return False, "Mint transaction missing energy proof"
            if 'oracle_signature' not in self.metadata:
                return False, "Mint transaction missing oracle signature"

        elif self.tx_type == 'regular':
            # Regular tx must have inputs
            if not self.inputs:
                return False, "Regular transaction has no inputs"

        return True, ""


# ============================================================================
# BLOCK STRUCTURES
# ============================================================================

@dataclass
class BlockHeader:
    """Block header containing metadata."""
    version: int
    prev_block_hash: str
    merkle_root: str
    timestamp: float
    difficulty: int  # For PoS: target block time
    nonce: int
    validator: str  # PoS validator address
    validator_signature: str = ""

    # SPK-specific fields
    energy_oracle_root: str = ""  # Merkle root of energy proofs
    peg_price: str = ""  # Target peg price at this block
    total_supply: str = "0"  # Total SPK in circulation

    def to_dict(self) -> dict:
        return asdict(self)

    def compute_hash(self) -> str:
        """Compute block hash."""
        # Exclude signature from hash
        header_dict = self.to_dict()
        header_dict.pop('validator_signature', None)
        header_string = json.dumps(header_dict, sort_keys=True)
        return hashlib.sha256(header_string.encode()).hexdigest()


@dataclass
class Block:
    """
    SPK Block.

    Contains transactions and energy-backing proofs.
    """
    header: BlockHeader
    transactions: List[Transaction]

    # Computed
    block_hash: str = ""
    height: int = 0

    def __post_init__(self):
        if not self.block_hash:
            self.block_hash = self.header.compute_hash()

    def compute_merkle_root(self) -> str:
        """Compute Merkle root of transactions."""
        if not self.transactions:
            return hashlib.sha256(b'').hexdigest()

        tx_hashes = [tx.tx_id for tx in self.transactions]

        while len(tx_hashes) > 1:
            if len(tx_hashes) % 2 != 0:
                tx_hashes.append(tx_hashes[-1])  # Duplicate last if odd

            tx_hashes = [
                hashlib.sha256((tx_hashes[i] + tx_hashes[i+1]).encode()).hexdigest()
                for i in range(0, len(tx_hashes), 2)
            ]

        return tx_hashes[0]

    def to_dict(self) -> dict:
        return {
            'block_hash': self.block_hash,
            'height': self.height,
            'header': self.header.to_dict(),
            'transactions': [tx.to_dict() for tx in self.transactions],
            'tx_count': len(self.transactions)
        }

    def validate_structure(self) -> Tuple[bool, str]:
        """Validate block structure (not consensus rules)."""
        # Check merkle root
        computed_merkle = self.compute_merkle_root()
        if computed_merkle != self.header.merkle_root:
            return False, f"Merkle root mismatch: {computed_merkle} vs {self.header.merkle_root}"

        # Validate each transaction
        for tx in self.transactions:
            valid, error = tx.validate_basic()
            if not valid:
                return False, f"Invalid transaction {tx.tx_id}: {error}"

        return True, ""


# ============================================================================
# BLOCKCHAIN STATE
# ============================================================================

class Blockchain:
    """
    SPK Blockchain - maintains chain state.

    Key features:
    - UTXO model for transactions
    - Energy-backed minting
    - Peg stability tracking
    - Validator stakes (PoS)
    """

    def __init__(self):
        self.chain: List[Block] = []
        self.utxo_set: Dict[str, TransactionOutput] = {}  # {tx_id:index -> output}
        self.pending_transactions: List[Transaction] = []

        # SPK-specific state
        self.total_supply: Decimal = Decimal('0')
        self.current_peg_price: Decimal = Decimal('0.10')  # $/kWh target
        self.energy_reserve: Decimal = Decimal('0')  # kWh backing
        self.validator_stakes: Dict[str, Decimal] = {}  # {address -> stake}

        # Create genesis block
        self._create_genesis_block()

    def _create_genesis_block(self):
        """Create the first block."""
        genesis_header = BlockHeader(
            version=1,
            prev_block_hash="0" * 64,
            merkle_root="0" * 64,
            timestamp=time.time(),
            difficulty=1,
            nonce=0,
            validator="genesis",
            peg_price=str(self.current_peg_price),
            total_supply="0"
        )

        genesis_block = Block(
            header=genesis_header,
            transactions=[],
            height=0
        )

        self.chain.append(genesis_block)

    def get_latest_block(self) -> Block:
        """Get the most recent block."""
        return self.chain[-1]

    def get_block_by_height(self, height: int) -> Optional[Block]:
        """Get block at specific height."""
        if 0 <= height < len(self.chain):
            return self.chain[height]
        return None

    def get_block_by_hash(self, block_hash: str) -> Optional[Block]:
        """Find block by hash."""
        for block in self.chain:
            if block.block_hash == block_hash:
                return block
        return None

    def add_block(self, block: Block) -> Tuple[bool, str]:
        """
        Add a new block to the chain.

        Validates:
        - Structure
        - Links to previous block
        - Transactions are valid
        - Energy backing (for mints)
        - Peg stability rules
        """
        # Validate structure
        valid, error = block.validate_structure()
        if not valid:
            return False, error

        # Check previous block link
        latest = self.get_latest_block()
        if block.header.prev_block_hash != latest.block_hash:
            return False, "Previous block hash mismatch"

        # Set height
        block.height = latest.height + 1

        # Process transactions (update UTXO set, supply, etc.)
        success, error = self._process_transactions(block.transactions)
        if not success:
            return False, error

        # Add to chain
        self.chain.append(block)

        return True, ""

    def _process_transactions(self, transactions: List[Transaction]) -> Tuple[bool, str]:
        """
        Process block transactions:
        - Update UTXO set
        - Handle mints/burns
        - Update supply
        """
        for tx in transactions:
            if tx.tx_type == 'mint':
                # Energy-backed minting
                energy_kwh = Decimal(tx.metadata.get('energy_kwh', '0'))
                mint_amount = energy_kwh * self.current_peg_price

                # Add to supply
                self.total_supply += mint_amount
                self.energy_reserve += energy_kwh

                # Create UTXO for minted coins
                for i, output in enumerate(tx.outputs):
                    utxo_key = f"{tx.tx_id}:{i}"
                    self.utxo_set[utxo_key] = output

            elif tx.tx_type == 'burn':
                # Burn for peg stability
                burn_amount = tx.get_output_sum()  # Amount being burned
                self.total_supply -= burn_amount

            elif tx.tx_type == 'regular':
                # Regular transfer: consume inputs, create outputs

                # Remove spent UTXOs
                for inp in tx.inputs:
                    utxo_key = f"{inp.tx_id}:{inp.output_index}"
                    if utxo_key in self.utxo_set:
                        del self.utxo_set[utxo_key]

                # Add new UTXOs
                for i, output in enumerate(tx.outputs):
                    utxo_key = f"{tx.tx_id}:{i}"
                    self.utxo_set[utxo_key] = output

        return True, ""

    def get_balance(self, address: str) -> Decimal:
        """Get SPK balance for an address."""
        balance = Decimal('0')
        for utxo in self.utxo_set.values():
            if utxo.address == address:
                balance += utxo.amount
        return balance

    def get_chain_stats(self) -> dict:
        """Get blockchain statistics."""
        return {
            'height': len(self.chain) - 1,
            'total_supply': str(self.total_supply),
            'energy_reserve_kwh': str(self.energy_reserve),
            'current_peg_price': str(self.current_peg_price),
            'utxo_count': len(self.utxo_set),
            'validators': len(self.validator_stakes),
            'total_staked': str(sum(self.validator_stakes.values()))
        }


# ============================================================================
# CRYPTOGRAPHIC UTILITIES
# ============================================================================

class Wallet:
    """Simple wallet for SPK."""

    def __init__(self, private_key: Optional[SigningKey] = None):
        if private_key:
            self.private_key = private_key
        else:
            self.private_key = SigningKey.generate(curve=SECP256k1)

        self.public_key = self.private_key.get_verifying_key()
        self.address = self.generate_address()

    def generate_address(self) -> str:
        """Generate SPK address from public key."""
        pub_key_bytes = self.public_key.to_string()
        sha256_hash = hashlib.sha256(pub_key_bytes).digest()
        address = hashlib.new('ripemd160', sha256_hash).hexdigest()
        return f"SPK{address[:40]}"  # SPK prefix + 40 hex chars

    def sign(self, data: str) -> str:
        """Sign data with private key."""
        signature = self.private_key.sign(data.encode())
        return signature.hex()

    def verify_signature(self, data: str, signature: str, public_key_hex: str) -> bool:
        """Verify signature."""
        try:
            public_key = VerifyingKey.from_string(bytes.fromhex(public_key_hex), curve=SECP256k1)
            public_key.verify(bytes.fromhex(signature), data.encode())
            return True
        except:
            return False

    def create_transaction(
        self,
        recipient: str,
        amount: Decimal,
        utxos: List[Tuple[str, int, Decimal]],  # (tx_id, output_index, amount)
        fee: Decimal = Decimal('0.001')
    ) -> Transaction:
        """
        Create and sign a transaction.

        Args:
            recipient: Recipient address
            amount: Amount to send
            utxos: Available UTXOs [(tx_id, index, amount), ...]
            fee: Transaction fee
        """
        # Select UTXOs to cover amount + fee
        total_needed = amount + fee
        selected_utxos = []
        utxo_total = Decimal('0')

        for tx_id, idx, utxo_amount in utxos:
            selected_utxos.append((tx_id, idx, utxo_amount))
            utxo_total += utxo_amount
            if utxo_total >= total_needed:
                break

        if utxo_total < total_needed:
            raise ValueError(f"Insufficient funds: need {total_needed}, have {utxo_total}")

        # Create inputs
        inputs = []
        for tx_id, idx, _ in selected_utxos:
            inp = TransactionInput(
                tx_id=tx_id,
                output_index=idx,
                public_key=self.public_key.to_string().hex()
            )
            # Sign input
            signable = inp.signable_data()
            inp.signature = self.sign(signable)
            inputs.append(inp)

        # Create outputs
        outputs = [
            TransactionOutput(address=recipient, amount=amount)
        ]

        # Change output (if any)
        change = utxo_total - amount - fee
        if change > 0:
            outputs.append(TransactionOutput(address=self.address, amount=change))

        # Create transaction
        tx = Transaction(
            inputs=inputs,
            outputs=outputs,
            timestamp=time.time(),
            tx_type='regular',
            fee=fee
        )

        return tx


if __name__ == "__main__":
    # Quick test
    print("=" * 70)
    print("SOLARPUNKCOIN - Core Blockchain Test")
    print("=" * 70)

    # Create blockchain
    blockchain = Blockchain()
    print(f"\n✓ Genesis block created")
    print(f"  Height: {blockchain.get_latest_block().height}")
    print(f"  Hash: {blockchain.get_latest_block().block_hash[:16]}...")

    # Create wallet
    wallet = Wallet()
    print(f"\n✓ Wallet created")
    print(f"  Address: {wallet.address}")

    # Print stats
    stats = blockchain.get_chain_stats()
    print(f"\n✓ Blockchain stats:")
    for key, value in stats.items():
        print(f"  {key}: {value}")

    print("\n" + "=" * 70)
    print("Core blockchain components operational!")
    print("=" * 70)
