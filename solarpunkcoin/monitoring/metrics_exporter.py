"""
SolarPunkCoin - Metrics Exporter
=================================

Prometheus metrics exporter for blockchain monitoring.

Run with: python metrics_exporter.py

Exposes metrics at: http://localhost:9091/metrics
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask, Response
from decimal import Decimal
import time

from node.spk_node import SPKNode


app = Flask(__name__)

# Initialize node
node = SPKNode(
    node_id="metrics_node",
    is_validator=False
)


def generate_metrics() -> str:
    """Generate Prometheus metrics."""
    stats = node.get_full_stats()

    metrics = []

    # Blockchain metrics
    metrics.append("# HELP spk_blockchain_height Current blockchain height")
    metrics.append("# TYPE spk_blockchain_height gauge")
    metrics.append(f"spk_blockchain_height {stats['blockchain']['height']}")

    metrics.append("# HELP spk_total_supply Total SPK token supply")
    metrics.append("# TYPE spk_total_supply gauge")
    metrics.append(f"spk_total_supply {stats['blockchain']['total_supply']}")

    metrics.append("# HELP spk_energy_reserve_kwh Energy reserve in kWh")
    metrics.append("# TYPE spk_energy_reserve_kwh gauge")
    metrics.append(f"spk_energy_reserve_kwh {stats['blockchain']['energy_reserve_kwh']}")

    metrics.append("# HELP spk_current_peg_price Current peg price in USD/kWh")
    metrics.append("# TYPE spk_current_peg_price gauge")
    metrics.append(f"spk_current_peg_price {stats['blockchain']['current_peg_price']}")

    metrics.append("# HELP spk_utxo_count Number of UTXOs")
    metrics.append("# TYPE spk_utxo_count gauge")
    metrics.append(f"spk_utxo_count {stats['blockchain']['utxo_count']}")

    # Consensus metrics
    metrics.append("# HELP spk_total_validators Total number of validators")
    metrics.append("# TYPE spk_total_validators gauge")
    metrics.append(f"spk_total_validators {stats['consensus']['total_validators']}")

    metrics.append("# HELP spk_active_validators Number of active validators")
    metrics.append("# TYPE spk_active_validators gauge")
    metrics.append(f"spk_active_validators {stats['consensus']['active_validators']}")

    metrics.append("# HELP spk_total_staked Total staked SPK")
    metrics.append("# TYPE spk_total_staked gauge")
    metrics.append(f"spk_total_staked {stats['consensus']['total_staked']}")

    metrics.append("# HELP spk_green_stake_percentage Percentage of stake from green validators")
    metrics.append("# TYPE spk_green_stake_percentage gauge")
    metrics.append(f"spk_green_stake_percentage {stats['consensus']['green_stake_percentage']}")

    # Oracle metrics
    metrics.append("# HELP spk_oracle_proofs_verified Total energy proofs verified")
    metrics.append("# TYPE spk_oracle_proofs_verified counter")
    metrics.append(f"spk_oracle_proofs_verified {stats['oracle']['total_proofs_verified']}")

    metrics.append("# HELP spk_oracle_energy_kwh Total energy processed in kWh")
    metrics.append("# TYPE spk_oracle_energy_kwh counter")
    metrics.append(f"spk_oracle_energy_kwh {stats['oracle']['total_energy_kwh']}")

    metrics.append("# HELP spk_oracle_spk_minted Total SPK minted from energy")
    metrics.append("# TYPE spk_oracle_spk_minted counter")
    metrics.append(f"spk_oracle_spk_minted {stats['oracle']['total_spk_minted']}")

    metrics.append("# HELP spk_oracle_trusted_meters Number of trusted meters")
    metrics.append("# TYPE spk_oracle_trusted_meters gauge")
    metrics.append(f"spk_oracle_trusted_meters {stats['oracle']['trusted_meters']}")

    # Peg stability metrics
    metrics.append("# HELP spk_peg_total_corrections Total peg corrections")
    metrics.append("# TYPE spk_peg_total_corrections counter")
    metrics.append(f"spk_peg_total_corrections {stats['peg_stability']['total_corrections']}")

    metrics.append("# HELP spk_peg_total_minted Total SPK minted for peg stability")
    metrics.append("# TYPE spk_peg_total_minted counter")
    metrics.append(f"spk_peg_total_minted {stats['peg_stability']['total_minted']}")

    metrics.append("# HELP spk_peg_total_burned Total SPK burned for peg stability")
    metrics.append("# TYPE spk_peg_total_burned counter")
    metrics.append(f"spk_peg_total_burned {stats['peg_stability']['total_burned']}")

    # Node metrics
    metrics.append("# HELP spk_mempool_size Number of transactions in mempool")
    metrics.append("# TYPE spk_mempool_size gauge")
    metrics.append(f"spk_mempool_size {len(node.mempool)}")

    metrics.append("# HELP spk_node_is_validator Whether this node is a validator (1=yes, 0=no)")
    metrics.append("# TYPE spk_node_is_validator gauge")
    metrics.append(f"spk_node_is_validator {1 if node.is_validator else 0}")

    metrics.append("# HELP spk_node_is_synced Whether node is synced (1=yes, 0=no)")
    metrics.append("# TYPE spk_node_is_synced gauge")
    metrics.append(f"spk_node_is_synced {1 if node.is_synced else 0}")

    # Timestamp
    metrics.append("# HELP spk_metrics_timestamp_seconds Unix timestamp of last metric collection")
    metrics.append("# TYPE spk_metrics_timestamp_seconds gauge")
    metrics.append(f"spk_metrics_timestamp_seconds {int(time.time())}")

    return "\n".join(metrics) + "\n"


@app.route('/metrics')
def metrics():
    """Prometheus metrics endpoint."""
    return Response(generate_metrics(), mimetype='text/plain')


@app.route('/health')
def health():
    """Health check endpoint."""
    return {'status': 'healthy', 'timestamp': time.time()}


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description="SolarPunkCoin Metrics Exporter")
    parser.add_argument('--host', default='0.0.0.0', help='Host to bind to')
    parser.add_argument('--port', type=int, default=9091, help='Port to bind to')

    args = parser.parse_args()

    print(f"=" * 70)
    print(f"SolarPunkCoin Metrics Exporter")
    print(f"=" * 70)
    print(f"Host: {args.host}")
    print(f"Port: {args.port}")
    print(f"=" * 70)
    print(f"\nMetrics endpoint: http://{args.host}:{args.port}/metrics")
    print(f"=" * 70)

    app.run(host=args.host, port=args.port)
