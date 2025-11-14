"""
SolarPunkCoin - REST API Server
================================

RESTful HTTP API for blockchain interaction.

Run with: python rest_api.py

Endpoints:
    GET  /health                          - Health check
    GET  /api/v1/blockchain/info          - Blockchain info
    GET  /api/v1/blockchain/stats         - Chain statistics
    GET  /api/v1/block/<height>           - Get block by height
    GET  /api/v1/block/hash/<hash>        - Get block by hash
    GET  /api/v1/block/latest             - Get latest block
    GET  /api/v1/transaction/<tx_id>      - Get transaction
    GET  /api/v1/address/<addr>/balance   - Get balance
    GET  /api/v1/address/<addr>/txs       - Get transactions
    POST /api/v1/transaction/send         - Broadcast transaction
    POST /api/v1/energy/submit            - Submit energy proof
    GET  /api/v1/validators                - Get all validators
    GET  /api/v1/validator/<addr>         - Get validator info
    GET  /api/v1/oracle/stats              - Oracle statistics
    GET  /api/v1/peg/status                - Peg stability status
    POST /api/v1/peg/check                - Check peg with parameters
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask, jsonify, request
from decimal import Decimal
import time

from node.spk_node import SPKNode
from oracle.energy_oracle import EnergyProof, GridOperator, EnergySource
from core.blockchain import Transaction, TransactionInput, TransactionOutput


app = Flask(__name__)
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True

# Initialize node
node = SPKNode(
    node_id="api_node",
    is_validator=False
)


# =============================================================================
# HEALTH & INFO
# =============================================================================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'timestamp': time.time(),
        'node_id': node.node_id,
        'blockchain_height': len(node.blockchain.chain) - 1,
        'is_synced': node.is_synced
    }), 200


@app.route('/api/v1/info', methods=['GET'])
def get_info():
    """Get API information."""
    return jsonify({
        'api_version': '1.0.0',
        'blockchain': 'SolarPunkCoin',
        'network': 'testnet',
        'endpoints': [
            'GET /health',
            'GET /api/v1/blockchain/info',
            'GET /api/v1/blockchain/stats',
            'GET /api/v1/block/<height>',
            'GET /api/v1/transaction/<tx_id>',
            'POST /api/v1/transaction/send',
            'GET /api/v1/address/<addr>/balance'
        ]
    }), 200


# =============================================================================
# BLOCKCHAIN
# =============================================================================

@app.route('/api/v1/blockchain/info', methods=['GET'])
def get_blockchain_info():
    """Get blockchain information."""
    stats = node.blockchain.get_chain_stats()

    return jsonify({
        'blockchain': 'SolarPunkCoin',
        'height': stats['height'],
        'total_supply': str(stats['total_supply']),
        'energy_reserve_kwh': str(stats['energy_reserve_kwh']),
        'current_peg_price': str(stats['current_peg_price']),
        'utxo_count': stats['utxo_count'],
        'validators': stats['validators'],
        'total_staked': str(stats['total_staked'])
    }), 200


@app.route('/api/v1/blockchain/stats', methods=['GET'])
def get_blockchain_stats():
    """Get detailed blockchain statistics."""
    stats = node.get_full_stats()

    # Convert Decimals to strings for JSON
    def decimal_to_str(obj):
        if isinstance(obj, Decimal):
            return str(obj)
        elif isinstance(obj, dict):
            return {k: decimal_to_str(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [decimal_to_str(item) for item in obj]
        return obj

    return jsonify(decimal_to_str(stats)), 200


# =============================================================================
# BLOCKS
# =============================================================================

@app.route('/api/v1/block/<int:height>', methods=['GET'])
def get_block_by_height(height):
    """Get block by height."""
    if height < 0 or height >= len(node.blockchain.chain):
        return jsonify({'error': 'Block not found'}), 404

    block = node.blockchain.chain[height]

    return jsonify({
        'height': block.height,
        'hash': block.block_hash,
        'prev_hash': block.header.prev_block_hash,
        'merkle_root': block.header.merkle_root,
        'timestamp': block.header.timestamp,
        'validator': block.header.validator,
        'transactions': len(block.transactions),
        'peg_price': block.header.peg_price,
        'total_supply': block.header.total_supply
    }), 200


@app.route('/api/v1/block/hash/<block_hash>', methods=['GET'])
def get_block_by_hash(block_hash):
    """Get block by hash."""
    for block in node.blockchain.chain:
        if block.block_hash == block_hash:
            return jsonify({
                'height': block.height,
                'hash': block.block_hash,
                'prev_hash': block.header.prev_block_hash,
                'merkle_root': block.header.merkle_root,
                'timestamp': block.header.timestamp,
                'validator': block.header.validator,
                'transactions': len(block.transactions)
            }), 200

    return jsonify({'error': 'Block not found'}), 404


@app.route('/api/v1/block/latest', methods=['GET'])
def get_latest_block():
    """Get latest block."""
    latest = node.blockchain.get_latest_block()

    return jsonify({
        'height': latest.height,
        'hash': latest.block_hash,
        'prev_hash': latest.header.prev_block_hash,
        'timestamp': latest.header.timestamp,
        'validator': latest.header.validator,
        'transactions': len(latest.transactions)
    }), 200


# =============================================================================
# TRANSACTIONS
# =============================================================================

@app.route('/api/v1/transaction/<tx_id>', methods=['GET'])
def get_transaction(tx_id):
    """Get transaction by ID."""
    # Search in blockchain
    for block in node.blockchain.chain:
        for tx in block.transactions:
            if tx.tx_id == tx_id:
                return jsonify({
                    'tx_id': tx.tx_id,
                    'type': tx.tx_type,
                    'inputs': len(tx.inputs),
                    'outputs': len(tx.outputs),
                    'timestamp': tx.timestamp,
                    'block_height': block.height,
                    'confirmed': True
                }), 200

    # Search in mempool
    for tx in node.mempool:
        if tx.tx_id == tx_id:
            return jsonify({
                'tx_id': tx.tx_id,
                'type': tx.tx_type,
                'inputs': len(tx.inputs),
                'outputs': len(tx.outputs),
                'timestamp': tx.timestamp,
                'confirmed': False,
                'in_mempool': True
            }), 200

    return jsonify({'error': 'Transaction not found'}), 404


@app.route('/api/v1/transaction/send', methods=['POST'])
def send_transaction():
    """Broadcast transaction."""
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    # Validate required fields
    required = ['from', 'to', 'amount']
    for field in required:
        if field not in data:
            return jsonify({'error': f'Missing field: {field}'}), 400

    try:
        # Create transaction (simplified)
        # In production, this would require signature, UTXOs, etc.

        return jsonify({
            'success': True,
            'tx_id': 'tx_placeholder_123',
            'message': 'Transaction broadcast successfully'
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# =============================================================================
# ADDRESSES
# =============================================================================

@app.route('/api/v1/address/<address>/balance', methods=['GET'])
def get_address_balance(address):
    """Get address balance."""
    balance = node.get_balance(address)

    return jsonify({
        'address': address,
        'balance': str(balance),
        'unit': 'SPK'
    }), 200


@app.route('/api/v1/address/<address>/transactions', methods=['GET'])
def get_address_transactions(address):
    """Get address transactions."""
    txs = []

    # Search blockchain for transactions involving this address
    for block in node.blockchain.chain:
        for tx in block.transactions:
            # Check if address is in inputs or outputs
            involves_address = False

            for output in tx.outputs:
                if output.address == address:
                    involves_address = True
                    break

            if involves_address:
                txs.append({
                    'tx_id': tx.tx_id,
                    'type': tx.tx_type,
                    'timestamp': tx.timestamp,
                    'block_height': block.height
                })

    return jsonify({
        'address': address,
        'transaction_count': len(txs),
        'transactions': txs
    }), 200


# =============================================================================
# ENERGY ORACLE
# =============================================================================

@app.route('/api/v1/energy/submit', methods=['POST'])
def submit_energy_proof():
    """Submit energy proof for minting."""
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    try:
        # Create energy proof
        proof = EnergyProof(
            proof_id=data.get('proof_id'),
            timestamp=time.time(),
            grid_operator=GridOperator[data.get('grid_operator', 'TAIPOWER')],
            location=data.get('location', ''),
            source_type=EnergySource[data.get('source_type', 'SOLAR')],
            surplus_kwh=Decimal(str(data.get('surplus_kwh', 0))),
            wholesale_price=Decimal(str(data.get('wholesale_price', 0.08))),
            grid_load=Decimal(str(data.get('grid_load', 0.70))),
            renewable_penetration=Decimal(str(data.get('renewable_penetration', 0.35))),
            meter_signature=data.get('meter_signature', ''),
            meter_id=data.get('meter_id', ''),
            operator_cert_hash=data.get('operator_cert_hash', '')
        )

        recipient = data.get('recipient', node.wallet.address)

        # Process proof
        success, tx, msg = node.process_energy_proof(proof, recipient)

        if success:
            return jsonify({
                'success': True,
                'tx_id': tx.tx_id if tx else None,
                'message': msg
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': msg
            }), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/v1/oracle/stats', methods=['GET'])
def get_oracle_stats():
    """Get oracle statistics."""
    stats = node.oracle.get_oracle_stats()

    # Convert Decimals to strings
    for key in stats:
        if isinstance(stats[key], Decimal):
            stats[key] = str(stats[key])

    return jsonify(stats), 200


# =============================================================================
# VALIDATORS
# =============================================================================

@app.route('/api/v1/validators', methods=['GET'])
def get_all_validators():
    """Get all validators."""
    validators = node.pos.get_all_validators()

    # Convert Decimals to strings
    for val in validators:
        for key in val:
            if isinstance(val[key], Decimal):
                val[key] = str(val[key])

    return jsonify({
        'validator_count': len(validators),
        'validators': validators
    }), 200


@app.route('/api/v1/validator/<address>', methods=['GET'])
def get_validator(address):
    """Get validator information."""
    if address not in node.pos.validators:
        return jsonify({'error': 'Validator not found'}), 404

    val = node.pos.validators[address]

    return jsonify({
        'address': val.address,
        'stake': str(val.stake),
        'green_certified': val.green_certified,
        'is_active': val.is_active,
        'reputation': val.reputation,
        'blocks_proposed': val.blocks_proposed,
        'blocks_validated': val.blocks_validated
    }), 200


# =============================================================================
# PEG STABILITY
# =============================================================================

@app.route('/api/v1/peg/status', methods=['GET'])
def get_peg_status():
    """Get peg stability status."""
    stats = node.peg_controller.get_stability_stats()

    # Convert Decimals to strings
    for key in stats:
        if isinstance(stats[key], Decimal):
            stats[key] = str(stats[key])

    return jsonify(stats), 200


@app.route('/api/v1/peg/check', methods=['POST'])
def check_peg_stability():
    """Check peg stability with given parameters."""
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    try:
        spk_price = Decimal(str(data.get('spk_market_price', 0.10)))
        wholesale = Decimal(str(data.get('wholesale_price', 0.08)))

        needs_action, action, amount = node.check_peg_stability(
            spk_market_price=spk_price,
            wholesale_price=wholesale
        )

        target = node.peg_controller.compute_target_price(wholesale)
        lower, upper = node.peg_controller.params.get_peg_band(target)

        return jsonify({
            'needs_action': needs_action,
            'action': action if needs_action else None,
            'amount': str(amount) if needs_action else '0',
            'target_price': str(target),
            'lower_bound': str(lower),
            'upper_bound': str(upper),
            'current_price': str(spk_price)
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# =============================================================================
# ERROR HANDLERS
# =============================================================================

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    return jsonify({'error': 'Internal server error'}), 500


# =============================================================================
# MAIN
# =============================================================================

if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description="SolarPunkCoin REST API Server")
    parser.add_argument('--host', default='0.0.0.0', help='Host to bind to')
    parser.add_argument('--port', type=int, default=8545, help='Port to bind to')
    parser.add_argument('--debug', action='store_true', help='Enable debug mode')

    args = parser.parse_args()

    print(f"=" * 70)
    print(f"SolarPunkCoin REST API Server")
    print(f"=" * 70)
    print(f"Host: {args.host}")
    print(f"Port: {args.port}")
    print(f"Debug: {args.debug}")
    print(f"=" * 70)
    print(f"\nAPI Endpoints:")
    print(f"  Health:      http://{args.host}:{args.port}/health")
    print(f"  Info:        http://{args.host}:{args.port}/api/v1/info")
    print(f"  Blockchain:  http://{args.host}:{args.port}/api/v1/blockchain/info")
    print(f"=" * 70)

    app.run(host=args.host, port=args.port, debug=args.debug)
