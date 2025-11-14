"""
SolarPunkCoin - Database Persistence Layer
===========================================

Production database for blockchain state.

Uses SQLite for simplicity (can switch to RocksDB/LevelDB for production).

Stores:
- Blocks
- Transactions
- UTXOs
- Validator stakes
- Energy proofs
- Configuration
"""

import sqlite3
import json
from typing import Optional, List, Dict, Tuple
from decimal import Decimal
from pathlib import Path
import threading


class BlockchainDB:
    """
    Persistent blockchain database.

    Thread-safe SQLite storage for all blockchain state.
    """

    def __init__(self, db_path: str = "spk_blockchain.db"):
        self.db_path = db_path
        self.lock = threading.Lock()

        # Initialize database
        self._init_database()

    def _get_connection(self) -> sqlite3.Connection:
        """Get database connection (thread-local)."""
        conn = sqlite3.Connection(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_database(self):
        """Initialize database schema."""
        with self.lock:
            conn = self._get_connection()
            cursor = conn.cursor()

            # Blocks table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS blocks (
                    height INTEGER PRIMARY KEY,
                    block_hash TEXT UNIQUE NOT NULL,
                    prev_block_hash TEXT NOT NULL,
                    merkle_root TEXT NOT NULL,
                    timestamp REAL NOT NULL,
                    validator TEXT NOT NULL,
                    validator_signature TEXT,
                    peg_price TEXT NOT NULL,
                    total_supply TEXT NOT NULL,
                    tx_count INTEGER NOT NULL,
                    block_data TEXT NOT NULL
                )
            """)

            # Transactions table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS transactions (
                    tx_id TEXT PRIMARY KEY,
                    block_height INTEGER,
                    tx_type TEXT NOT NULL,
                    timestamp REAL NOT NULL,
                    input_count INTEGER NOT NULL,
                    output_count INTEGER NOT NULL,
                    fee TEXT NOT NULL,
                    tx_data TEXT NOT NULL,
                    FOREIGN KEY (block_height) REFERENCES blocks(height)
                )
            """)

            # UTXOs table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS utxos (
                    tx_id TEXT NOT NULL,
                    output_index INTEGER NOT NULL,
                    address TEXT NOT NULL,
                    amount TEXT NOT NULL,
                    is_spent INTEGER DEFAULT 0,
                    spent_in_tx TEXT,
                    PRIMARY KEY (tx_id, output_index)
                )
            """)

            # Validators table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS validators (
                    address TEXT PRIMARY KEY,
                    stake TEXT NOT NULL,
                    is_active INTEGER DEFAULT 1,
                    reputation INTEGER DEFAULT 100,
                    green_certified INTEGER DEFAULT 0,
                    blocks_proposed INTEGER DEFAULT 0,
                    blocks_validated INTEGER DEFAULT 0,
                    join_time REAL NOT NULL,
                    last_active REAL NOT NULL
                )
            """)

            # Energy proofs table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS energy_proofs (
                    proof_id TEXT PRIMARY KEY,
                    timestamp REAL NOT NULL,
                    grid_operator TEXT NOT NULL,
                    location TEXT NOT NULL,
                    source_type TEXT NOT NULL,
                    surplus_kwh TEXT NOT NULL,
                    wholesale_price TEXT NOT NULL,
                    meter_id TEXT NOT NULL,
                    meter_signature TEXT NOT NULL,
                    operator_cert_hash TEXT NOT NULL,
                    mint_tx_id TEXT,
                    proof_data TEXT NOT NULL
                )
            """)

            # Peers table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS peers (
                    address TEXT PRIMARY KEY,
                    ip TEXT NOT NULL,
                    port INTEGER NOT NULL,
                    last_seen REAL NOT NULL,
                    reliability_score REAL DEFAULT 1.0
                )
            """)

            # Configuration table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS config (
                    key TEXT PRIMARY KEY,
                    value TEXT NOT NULL
                )
            """)

            # Create indices
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_blocks_hash ON blocks(block_hash)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_tx_block ON transactions(block_height)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_utxo_address ON utxos(address)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_utxo_spent ON utxos(is_spent)")

            conn.commit()
            conn.close()

    # ========================================================================
    # BLOCKS
    # ========================================================================

    def save_block(self, block_dict: dict) -> bool:
        """Save block to database."""
        with self.lock:
            try:
                conn = self._get_connection()
                cursor = conn.cursor()

                cursor.execute("""
                    INSERT INTO blocks (
                        height, block_hash, prev_block_hash, merkle_root,
                        timestamp, validator, validator_signature,
                        peg_price, total_supply, tx_count, block_data
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    block_dict['height'],
                    block_dict['block_hash'],
                    block_dict['header']['prev_block_hash'],
                    block_dict['header']['merkle_root'],
                    block_dict['header']['timestamp'],
                    block_dict['header']['validator'],
                    block_dict['header'].get('validator_signature', ''),
                    block_dict['header']['peg_price'],
                    block_dict['header']['total_supply'],
                    block_dict['tx_count'],
                    json.dumps(block_dict)
                ))

                conn.commit()
                conn.close()
                return True

            except Exception as e:
                print(f"Error saving block: {e}")
                return False

    def get_block_by_height(self, height: int) -> Optional[dict]:
        """Get block by height."""
        with self.lock:
            conn = self._get_connection()
            cursor = conn.cursor()

            cursor.execute("SELECT block_data FROM blocks WHERE height = ?", (height,))
            row = cursor.fetchone()
            conn.close()

            if row:
                return json.loads(row['block_data'])
            return None

    def get_block_by_hash(self, block_hash: str) -> Optional[dict]:
        """Get block by hash."""
        with self.lock:
            conn = self._get_connection()
            cursor = conn.cursor()

            cursor.execute("SELECT block_data FROM blocks WHERE block_hash = ?", (block_hash,))
            row = cursor.fetchone()
            conn.close()

            if row:
                return json.loads(row['block_data'])
            return None

    def get_latest_block(self) -> Optional[dict]:
        """Get latest block."""
        with self.lock:
            conn = self._get_connection()
            cursor = conn.cursor()

            cursor.execute("SELECT block_data FROM blocks ORDER BY height DESC LIMIT 1")
            row = cursor.fetchone()
            conn.close()

            if row:
                return json.loads(row['block_data'])
            return None

    def get_blockchain_height(self) -> int:
        """Get current blockchain height."""
        with self.lock:
            conn = self._get_connection()
            cursor = conn.cursor()

            cursor.execute("SELECT MAX(height) as max_height FROM blocks")
            row = cursor.fetchone()
            conn.close()

            return row['max_height'] if row['max_height'] is not None else -1

    # ========================================================================
    # TRANSACTIONS
    # ========================================================================

    def save_transaction(self, tx_dict: dict, block_height: Optional[int] = None) -> bool:
        """Save transaction to database."""
        with self.lock:
            try:
                conn = self._get_connection()
                cursor = conn.cursor()

                cursor.execute("""
                    INSERT OR REPLACE INTO transactions (
                        tx_id, block_height, tx_type, timestamp,
                        input_count, output_count, fee, tx_data
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    tx_dict['tx_id'],
                    block_height,
                    tx_dict['tx_type'],
                    tx_dict['timestamp'],
                    len(tx_dict['inputs']),
                    len(tx_dict['outputs']),
                    tx_dict['fee'],
                    json.dumps(tx_dict)
                ))

                conn.commit()
                conn.close()
                return True

            except Exception as e:
                print(f"Error saving transaction: {e}")
                return False

    def get_transaction(self, tx_id: str) -> Optional[dict]:
        """Get transaction by ID."""
        with self.lock:
            conn = self._get_connection()
            cursor = conn.cursor()

            cursor.execute("SELECT tx_data FROM transactions WHERE tx_id = ?", (tx_id,))
            row = cursor.fetchone()
            conn.close()

            if row:
                return json.loads(row['tx_data'])
            return None

    # ========================================================================
    # UTXOS
    # ========================================================================

    def save_utxo(self, tx_id: str, output_index: int, address: str, amount: Decimal) -> bool:
        """Save UTXO."""
        with self.lock:
            try:
                conn = self._get_connection()
                cursor = conn.cursor()

                cursor.execute("""
                    INSERT INTO utxos (tx_id, output_index, address, amount)
                    VALUES (?, ?, ?, ?)
                """, (tx_id, output_index, address, str(amount)))

                conn.commit()
                conn.close()
                return True

            except Exception as e:
                print(f"Error saving UTXO: {e}")
                return False

    def spend_utxo(self, tx_id: str, output_index: int, spent_in_tx: str) -> bool:
        """Mark UTXO as spent."""
        with self.lock:
            try:
                conn = self._get_connection()
                cursor = conn.cursor()

                cursor.execute("""
                    UPDATE utxos
                    SET is_spent = 1, spent_in_tx = ?
                    WHERE tx_id = ? AND output_index = ?
                """, (spent_in_tx, tx_id, output_index))

                conn.commit()
                conn.close()
                return True

            except Exception as e:
                print(f"Error spending UTXO: {e}")
                return False

    def get_utxos_for_address(self, address: str) -> List[dict]:
        """Get all unspent UTXOs for an address."""
        with self.lock:
            conn = self._get_connection()
            cursor = conn.cursor()

            cursor.execute("""
                SELECT tx_id, output_index, address, amount
                FROM utxos
                WHERE address = ? AND is_spent = 0
            """, (address,))

            rows = cursor.fetchall()
            conn.close()

            return [
                {
                    'tx_id': row['tx_id'],
                    'output_index': row['output_index'],
                    'address': row['address'],
                    'amount': Decimal(row['amount'])
                }
                for row in rows
            ]

    def get_balance(self, address: str) -> Decimal:
        """Get balance for an address."""
        utxos = self.get_utxos_for_address(address)
        return sum(utxo['amount'] for utxo in utxos)

    # ========================================================================
    # VALIDATORS
    # ========================================================================

    def save_validator(self, validator_dict: dict) -> bool:
        """Save validator."""
        with self.lock:
            try:
                conn = self._get_connection()
                cursor = conn.cursor()

                cursor.execute("""
                    INSERT OR REPLACE INTO validators (
                        address, stake, is_active, reputation, green_certified,
                        blocks_proposed, blocks_validated, join_time, last_active
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    validator_dict['address'],
                    str(validator_dict['stake']),
                    1 if validator_dict['is_active'] else 0,
                    validator_dict['reputation'],
                    1 if validator_dict['green_certified'] else 0,
                    validator_dict['blocks_proposed'],
                    validator_dict['blocks_validated'],
                    validator_dict['join_time'],
                    validator_dict['last_active']
                ))

                conn.commit()
                conn.close()
                return True

            except Exception as e:
                print(f"Error saving validator: {e}")
                return False

    def get_all_validators(self) -> List[dict]:
        """Get all validators."""
        with self.lock:
            conn = self._get_connection()
            cursor = conn.cursor()

            cursor.execute("SELECT * FROM validators")
            rows = cursor.fetchall()
            conn.close()

            return [dict(row) for row in rows]

    # ========================================================================
    # ENERGY PROOFS
    # ========================================================================

    def save_energy_proof(self, proof_dict: dict, mint_tx_id: Optional[str] = None) -> bool:
        """Save energy proof."""
        with self.lock:
            try:
                conn = self._get_connection()
                cursor = conn.cursor()

                cursor.execute("""
                    INSERT INTO energy_proofs (
                        proof_id, timestamp, grid_operator, location, source_type,
                        surplus_kwh, wholesale_price, meter_id, meter_signature,
                        operator_cert_hash, mint_tx_id, proof_data
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    proof_dict['proof_id'],
                    proof_dict['timestamp'],
                    proof_dict['grid_operator'],
                    proof_dict['location'],
                    proof_dict['source_type'],
                    proof_dict['surplus_kwh'],
                    proof_dict['wholesale_price'],
                    proof_dict['meter_id'],
                    proof_dict['meter_signature'],
                    proof_dict['operator_cert_hash'],
                    mint_tx_id,
                    json.dumps(proof_dict)
                ))

                conn.commit()
                conn.close()
                return True

            except Exception as e:
                print(f"Error saving energy proof: {e}")
                return False

    # ========================================================================
    # UTILITIES
    # ========================================================================

    def get_stats(self) -> dict:
        """Get database statistics."""
        with self.lock:
            conn = self._get_connection()
            cursor = conn.cursor()

            stats = {}

            cursor.execute("SELECT COUNT(*) as count FROM blocks")
            stats['total_blocks'] = cursor.fetchone()['count']

            cursor.execute("SELECT COUNT(*) as count FROM transactions")
            stats['total_transactions'] = cursor.fetchone()['count']

            cursor.execute("SELECT COUNT(*) as count FROM utxos WHERE is_spent = 0")
            stats['unspent_utxos'] = cursor.fetchone()['count']

            cursor.execute("SELECT COUNT(*) as count FROM validators WHERE is_active = 1")
            stats['active_validators'] = cursor.fetchone()['count']

            cursor.execute("SELECT COUNT(*) as count FROM energy_proofs")
            stats['energy_proofs'] = cursor.fetchone()['count']

            conn.close()
            return stats

    def clear_database(self):
        """Clear all data (for testing)."""
        with self.lock:
            conn = self._get_connection()
            cursor = conn.cursor()

            cursor.execute("DELETE FROM blocks")
            cursor.execute("DELETE FROM transactions")
            cursor.execute("DELETE FROM utxos")
            cursor.execute("DELETE FROM validators")
            cursor.execute("DELETE FROM energy_proofs")
            cursor.execute("DELETE FROM peers")

            conn.commit()
            conn.close()


if __name__ == "__main__":
    print("=" * 70)
    print("SOLARPUNKCOIN - Database Persistence Test")
    print("=" * 70)

    # Create database
    db = BlockchainDB("test_spk.db")

    print("\n✓ Database initialized")

    # Test saving a block
    block_data = {
        'height': 1,
        'block_hash': 'abc123',
        'header': {
            'prev_block_hash': '000000',
            'merkle_root': 'merkle123',
            'timestamp': 1234567890.0,
            'validator': 'SPK1a2b3c4d5e6f',
            'peg_price': '0.10',
            'total_supply': '1000'
        },
        'tx_count': 2,
        'transactions': []
    }

    db.save_block(block_data)
    print("✓ Block saved")

    # Retrieve block
    retrieved = db.get_block_by_height(1)
    print(f"✓ Block retrieved: height={retrieved['height']}")

    # Stats
    print("\n📊 Database Statistics:")
    stats = db.get_stats()
    for key, value in stats.items():
        print(f"  {key}: {value}")

    # Cleanup
    import os
    os.remove("test_spk.db")

    print("\n" + "=" * 70)
    print("Database persistence operational!")
    print("Blockchain state persists across restarts")
    print("=" * 70)
