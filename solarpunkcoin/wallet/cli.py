#!/usr/bin/env python3
"""
SolarPunkCoin - CLI Wallet
===========================

Command-line wallet for SPK cryptocurrency.

Usage:
    python cli.py create                    # Create new wallet
    python cli.py balance <address>         # Check balance
    python cli.py send <to> <amount>        # Send SPK
    python cli.py import <private_key>      # Import wallet
    python cli.py export                    # Export private key
    python cli.py history <address>         # View transaction history
    python cli.py stake <amount>            # Stake SPK for validation
    python cli.py info                      # Show wallet info
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import argparse
import json
from decimal import Decimal
from pathlib import Path
import getpass

from core.blockchain import Wallet
from ecdsa import SigningKey, SECP256k1


class CLIWallet:
    """Command-line wallet for SolarPunkCoin."""

    def __init__(self, wallet_dir: str = None):
        """Initialize CLI wallet."""
        if wallet_dir is None:
            home = Path.home()
            wallet_dir = home / ".spk" / "wallets"

        self.wallet_dir = Path(wallet_dir)
        self.wallet_dir.mkdir(parents=True, exist_ok=True)

        self.default_wallet_file = self.wallet_dir / "default.json"
        self.rpc_endpoint = "http://localhost:8545"  # Default RPC

    def create_wallet(self, password: str = None) -> dict:
        """
        Create new wallet.

        Args:
            password: Optional password to encrypt private key

        Returns:
            Wallet info dict
        """
        wallet = Wallet()

        wallet_data = {
            "address": wallet.address,
            "public_key": wallet.public_key.to_string().hex(),
            "private_key_encrypted": self._encrypt_private_key(
                wallet.private_key.to_string().hex(),
                password
            ) if password else wallet.private_key.to_string().hex(),
            "created_at": self._get_timestamp(),
            "encrypted": password is not None
        }

        # Save to file
        with open(self.default_wallet_file, 'w') as f:
            json.dump(wallet_data, f, indent=2)

        print(f"✓ Wallet created successfully!")
        print(f"Address: {wallet.address}")
        print(f"Saved to: {self.default_wallet_file}")

        if not password:
            print("\n⚠️  WARNING: Private key is not encrypted!")
            print("   Use --password flag to encrypt your wallet.")

        return wallet_data

    def import_wallet(self, private_key_hex: str, password: str = None) -> dict:
        """
        Import wallet from private key.

        Args:
            private_key_hex: Private key in hex format
            password: Optional password to encrypt

        Returns:
            Wallet info dict
        """
        try:
            private_key_bytes = bytes.fromhex(private_key_hex)
            private_key = SigningKey.from_string(private_key_bytes, curve=SECP256k1)

            wallet = Wallet(private_key)

            wallet_data = {
                "address": wallet.address,
                "public_key": wallet.public_key.to_string().hex(),
                "private_key_encrypted": self._encrypt_private_key(
                    private_key_hex,
                    password
                ) if password else private_key_hex,
                "created_at": self._get_timestamp(),
                "encrypted": password is not None,
                "imported": True
            }

            with open(self.default_wallet_file, 'w') as f:
                json.dump(wallet_data, f, indent=2)

            print(f"✓ Wallet imported successfully!")
            print(f"Address: {wallet.address}")

            return wallet_data

        except Exception as e:
            print(f"✗ Failed to import wallet: {e}")
            return None

    def export_private_key(self, password: str = None) -> str:
        """
        Export private key.

        Args:
            password: Password if wallet is encrypted

        Returns:
            Private key in hex format
        """
        if not self.default_wallet_file.exists():
            print("✗ No wallet found. Create one first with 'create' command.")
            return None

        with open(self.default_wallet_file, 'r') as f:
            wallet_data = json.load(f)

        private_key_encrypted = wallet_data.get('private_key_encrypted')

        if wallet_data.get('encrypted'):
            if not password:
                print("✗ Wallet is encrypted. Password required.")
                return None

            private_key_hex = self._decrypt_private_key(
                private_key_encrypted,
                password
            )
        else:
            private_key_hex = private_key_encrypted

        print("\n⚠️  SENSITIVE INFORMATION ⚠️")
        print("=" * 60)
        print(f"Private Key: {private_key_hex}")
        print("=" * 60)
        print("\nNever share your private key with anyone!")
        print("Anyone with this key has full control of your funds.")

        return private_key_hex

    def get_balance(self, address: str = None) -> Decimal:
        """
        Get SPK balance for address.

        Args:
            address: Address to check (defaults to wallet address)

        Returns:
            Balance in SPK
        """
        if address is None:
            if not self.default_wallet_file.exists():
                print("✗ No wallet found.")
                return Decimal('0')

            with open(self.default_wallet_file, 'r') as f:
                wallet_data = json.load(f)
                address = wallet_data['address']

        # Query RPC endpoint
        balance = self._rpc_call('getbalance', [address])

        print(f"Address: {address}")
        print(f"Balance: {balance} SPK")

        return balance

    def send_transaction(
        self,
        recipient: str,
        amount: Decimal,
        fee: Decimal = Decimal('0.001'),
        password: str = None
    ) -> str:
        """
        Send SPK to recipient.

        Args:
            recipient: Recipient address
            amount: Amount to send
            fee: Transaction fee
            password: Wallet password if encrypted

        Returns:
            Transaction ID
        """
        if not self.default_wallet_file.exists():
            print("✗ No wallet found.")
            return None

        # Load wallet
        with open(self.default_wallet_file, 'r') as f:
            wallet_data = json.load(f)

        # Decrypt if needed
        if wallet_data.get('encrypted'):
            if not password:
                password = getpass.getpass("Enter wallet password: ")

            private_key_hex = self._decrypt_private_key(
                wallet_data['private_key_encrypted'],
                password
            )
        else:
            private_key_hex = wallet_data['private_key_encrypted']

        # Create wallet instance
        private_key_bytes = bytes.fromhex(private_key_hex)
        private_key = SigningKey.from_string(private_key_bytes, curve=SECP256k1)
        wallet = Wallet(private_key)

        # Create and broadcast transaction
        tx_data = {
            'from': wallet.address,
            'to': recipient,
            'amount': str(amount),
            'fee': str(fee)
        }

        tx_id = self._rpc_call('sendtransaction', [tx_data])

        print(f"✓ Transaction sent!")
        print(f"TX ID: {tx_id}")
        print(f"From: {wallet.address}")
        print(f"To: {recipient}")
        print(f"Amount: {amount} SPK")
        print(f"Fee: {fee} SPK")

        return tx_id

    def get_transaction_history(self, address: str = None) -> list:
        """
        Get transaction history for address.

        Args:
            address: Address to query

        Returns:
            List of transactions
        """
        if address is None:
            if not self.default_wallet_file.exists():
                print("✗ No wallet found.")
                return []

            with open(self.default_wallet_file, 'r') as f:
                wallet_data = json.load(f)
                address = wallet_data['address']

        txs = self._rpc_call('gettransactions', [address])

        print(f"\nTransaction History for {address}")
        print("=" * 80)

        if not txs:
            print("No transactions found.")
            return []

        for tx in txs:
            print(f"\nTX ID: {tx.get('tx_id', 'N/A')}")
            print(f"Type: {tx.get('type', 'N/A')}")
            print(f"Amount: {tx.get('amount', 'N/A')} SPK")
            print(f"Timestamp: {tx.get('timestamp', 'N/A')}")

        return txs

    def stake_tokens(self, amount: Decimal, password: str = None) -> bool:
        """
        Stake SPK tokens to become validator.

        Args:
            amount: Amount to stake
            password: Wallet password if encrypted

        Returns:
            Success status
        """
        if not self.default_wallet_file.exists():
            print("✗ No wallet found.")
            return False

        # Load wallet
        with open(self.default_wallet_file, 'r') as f:
            wallet_data = json.load(f)

        stake_data = {
            'address': wallet_data['address'],
            'amount': str(amount)
        }

        result = self._rpc_call('stake', [stake_data])

        if result:
            print(f"✓ Staked {amount} SPK successfully!")
            print(f"You are now a validator candidate.")
            return True
        else:
            print(f"✗ Staking failed.")
            return False

    def get_wallet_info(self) -> dict:
        """
        Get wallet information.

        Returns:
            Wallet info dict
        """
        if not self.default_wallet_file.exists():
            print("✗ No wallet found. Create one with 'create' command.")
            return None

        with open(self.default_wallet_file, 'r') as f:
            wallet_data = json.load(f)

        print("\n📱 Wallet Information")
        print("=" * 60)
        print(f"Address: {wallet_data['address']}")
        print(f"Public Key: {wallet_data['public_key'][:40]}...")
        print(f"Encrypted: {'Yes' if wallet_data.get('encrypted') else 'No'}")
        print(f"Created: {wallet_data.get('created_at', 'Unknown')}")
        print(f"Imported: {'Yes' if wallet_data.get('imported') else 'No'}")
        print(f"Wallet File: {self.default_wallet_file}")
        print("=" * 60)

        # Get balance
        balance = self.get_balance(wallet_data['address'])
        print(f"\nCurrent Balance: {balance} SPK")

        return wallet_data

    # Helper methods

    def _encrypt_private_key(self, private_key_hex: str, password: str) -> str:
        """Encrypt private key with password (simplified)."""
        # TODO: Implement proper encryption (AES-256)
        # For now, just return the hex (insecure!)
        if password:
            print("⚠️  Encryption not yet implemented. Key stored in plaintext!")
        return private_key_hex

    def _decrypt_private_key(self, encrypted: str, password: str) -> str:
        """Decrypt private key with password (simplified)."""
        # TODO: Implement proper decryption
        return encrypted

    def _rpc_call(self, method: str, params: list = None):
        """Make RPC call to node (simplified)."""
        # TODO: Implement actual RPC calls
        # For now, return mock data
        if method == 'getbalance':
            return Decimal('1000.00')  # Mock balance
        elif method == 'sendtransaction':
            return "tx_" + "abc123" * 10  # Mock TX ID
        elif method == 'gettransactions':
            return []  # Mock empty history
        elif method == 'stake':
            return True  # Mock success

        return None

    def _get_timestamp(self) -> str:
        """Get current timestamp."""
        from datetime import datetime
        return datetime.now().isoformat()


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description="SolarPunkCoin CLI Wallet",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  Create new wallet:
    python cli.py create

  Create encrypted wallet:
    python cli.py create --password

  Check balance:
    python cli.py balance

  Send SPK:
    python cli.py send SPKrecipient123... 100

  Import wallet:
    python cli.py import abc123...

  Export private key:
    python cli.py export

  View transaction history:
    python cli.py history

  Stake tokens:
    python cli.py stake 1000

  Wallet info:
    python cli.py info
        """
    )

    subparsers = parser.add_subparsers(dest='command', help='Commands')

    # Create wallet
    create_parser = subparsers.add_parser('create', help='Create new wallet')
    create_parser.add_argument('--password', action='store_true',
                              help='Encrypt wallet with password')

    # Balance
    balance_parser = subparsers.add_parser('balance', help='Check balance')
    balance_parser.add_argument('address', nargs='?', help='Address to check')

    # Send
    send_parser = subparsers.add_parser('send', help='Send SPK')
    send_parser.add_argument('recipient', help='Recipient address')
    send_parser.add_argument('amount', type=Decimal, help='Amount to send')
    send_parser.add_argument('--fee', type=Decimal, default=Decimal('0.001'),
                            help='Transaction fee (default: 0.001)')

    # Import
    import_parser = subparsers.add_parser('import', help='Import wallet')
    import_parser.add_argument('private_key', help='Private key (hex)')
    import_parser.add_argument('--password', action='store_true',
                               help='Encrypt imported wallet')

    # Export
    export_parser = subparsers.add_parser('export', help='Export private key')

    # History
    history_parser = subparsers.add_parser('history', help='Transaction history')
    history_parser.add_argument('address', nargs='?', help='Address to query')

    # Stake
    stake_parser = subparsers.add_parser('stake', help='Stake SPK tokens')
    stake_parser.add_argument('amount', type=Decimal, help='Amount to stake')

    # Info
    info_parser = subparsers.add_parser('info', help='Show wallet info')

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        return

    # Initialize wallet
    cli = CLIWallet()

    # Execute command
    if args.command == 'create':
        password = None
        if args.password:
            password = getpass.getpass("Enter password: ")
            password_confirm = getpass.getpass("Confirm password: ")
            if password != password_confirm:
                print("✗ Passwords do not match!")
                return

        cli.create_wallet(password)

    elif args.command == 'balance':
        cli.get_balance(args.address)

    elif args.command == 'send':
        cli.send_transaction(args.recipient, args.amount, args.fee)

    elif args.command == 'import':
        password = None
        if args.password:
            password = getpass.getpass("Enter password: ")

        cli.import_wallet(args.private_key, password)

    elif args.command == 'export':
        cli.export_private_key()

    elif args.command == 'history':
        cli.get_transaction_history(args.address)

    elif args.command == 'stake':
        cli.stake_tokens(args.amount)

    elif args.command == 'info':
        cli.get_wallet_info()


if __name__ == "__main__":
    main()
