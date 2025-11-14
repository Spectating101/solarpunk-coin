"""
SolarPunkCoin - Block Explorer
===============================

Web-based blockchain explorer.

Run with: python block_explorer.py
Access at: http://localhost:8080
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask, render_template_string, request
from decimal import Decimal
import time

from node.spk_node import SPKNode


app = Flask(__name__)

# Initialize node
node = SPKNode(
    node_id="explorer_node",
    is_validator=False
)


# =============================================================================
# TEMPLATES
# =============================================================================

BASE_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }} - SolarPunkCoin Explorer</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .header {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }

        h1 {
            color: #2d3748;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
        }

        .logo {
            font-size: 2rem;
            margin-right: 15px;
        }

        .subtitle {
            color: #718096;
            font-size: 0.9rem;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .stat-label {
            color: #718096;
            font-size: 0.85rem;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .stat-value {
            color: #2d3748;
            font-size: 1.8rem;
            font-weight: bold;
        }

        .stat-unit {
            color: #a0aec0;
            font-size: 1rem;
            margin-left: 5px;
        }

        .card {
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            padding: 30px;
            margin-bottom: 30px;
        }

        .card-title {
            color: #2d3748;
            font-size: 1.5rem;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #e2e8f0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th {
            background: #f7fafc;
            padding: 12px;
            text-align: left;
            color: #4a5568;
            font-weight: 600;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        td {
            padding: 15px 12px;
            border-bottom: 1px solid #e2e8f0;
            color: #2d3748;
        }

        tr:hover {
            background: #f7fafc;
        }

        .hash {
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            color: #667eea;
        }

        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
        }

        .badge-mint { background: #c6f6d5; color: #22543d; }
        .badge-regular { background: #bee3f8; color: #2c5282; }
        .badge-stake { background: #fef5e7; color: #744210; }
        .badge-green { background: #c6f6d5; color: #22543d; }

        .search-box {
            width: 100%;
            padding: 15px 20px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            font-size: 1rem;
            margin-bottom: 30px;
        }

        .search-box:focus {
            outline: none;
            border-color: #667eea;
        }

        .nav {
            background: white;
            padding: 15px 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            display: flex;
            gap: 20px;
        }

        .nav a {
            color: #4a5568;
            text-decoration: none;
            font-weight: 500;
            padding: 8px 16px;
            border-radius: 6px;
            transition: all 0.2s;
        }

        .nav a:hover {
            background: #f7fafc;
            color: #667eea;
        }

        .nav a.active {
            background: #667eea;
            color: white;
        }

        .timestamp {
            color: #718096;
            font-size: 0.9rem;
        }

        .green-icon {
            color: #48bb78;
        }

        .footer {
            text-align: center;
            color: white;
            margin-top: 50px;
            padding: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><span class="logo">🌱</span>SolarPunkCoin Explorer</h1>
            <p class="subtitle">Renewable Energy-Backed Cryptocurrency</p>
        </div>

        <div class="nav">
            <a href="/" class="{{ 'active' if page == 'home' else '' }}">Home</a>
            <a href="/blocks" class="{{ 'active' if page == 'blocks' else '' }}">Blocks</a>
            <a href="/validators" class="{{ 'active' if page == 'validators' else '' }}">Validators</a>
            <a href="/oracle" class="{{ 'active' if page == 'oracle' else '' }}">Energy Oracle</a>
        </div>

        {% block content %}{% endblock %}

        <div class="footer">
            <p>SolarPunkCoin Explorer | Built with ❤️ for a sustainable future</p>
            <p style="font-size: 0.8rem; opacity: 0.8; margin-top: 10px;">
                🌱 Green Energy | 💚 Decentralized | ⚡ Efficient | 🔐 Secure
            </p>
        </div>
    </div>
</body>
</html>
"""


HOME_TEMPLATE = """
{% extends "base.html" %}
{% block content %}
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-label">Block Height</div>
            <div class="stat-value">{{ stats.blockchain.height }}</div>
        </div>

        <div class="stat-card">
            <div class="stat-label">Total Supply</div>
            <div class="stat-value">{{ stats.blockchain.total_supply }}<span class="stat-unit">SPK</span></div>
        </div>

        <div class="stat-card">
            <div class="stat-label">Energy Reserve</div>
            <div class="stat-value">{{ stats.blockchain.energy_reserve_kwh }}<span class="stat-unit">kWh</span></div>
        </div>

        <div class="stat-card">
            <div class="stat-label">Validators</div>
            <div class="stat-value">{{ stats.consensus.total_validators }}</div>
        </div>
    </div>

    <div class="card">
        <h2 class="card-title">Recent Blocks</h2>
        <table>
            <thead>
                <tr>
                    <th>Height</th>
                    <th>Hash</th>
                    <th>Transactions</th>
                    <th>Validator</th>
                    <th>Time</th>
                </tr>
            </thead>
            <tbody>
                {% for block in recent_blocks %}
                <tr>
                    <td><strong>{{ block.height }}</strong></td>
                    <td class="hash">{{ block.block_hash[:20] }}...</td>
                    <td>{{ block.tx_count }}</td>
                    <td class="hash">{{ block.validator[:16] }}...</td>
                    <td class="timestamp">{{ block.time }}</td>
                </tr>
                {% endfor %}
            </tbody>
        </table>
    </div>
{% endblock %}
"""


BLOCKS_TEMPLATE = """
{% extends "base.html" %}
{% block content %}
    <div class="card">
        <h2 class="card-title">All Blocks</h2>
        <table>
            <thead>
                <tr>
                    <th>Height</th>
                    <th>Block Hash</th>
                    <th>Prev Hash</th>
                    <th>Txs</th>
                    <th>Validator</th>
                    <th>Timestamp</th>
                </tr>
            </thead>
            <tbody>
                {% for block in blocks %}
                <tr>
                    <td><strong>{{ block.height }}</strong></td>
                    <td class="hash">{{ block.block_hash[:24] }}...</td>
                    <td class="hash">{{ block.prev_hash[:24] }}...</td>
                    <td>{{ block.tx_count }}</td>
                    <td class="hash">{{ block.validator[:16] }}...</td>
                    <td class="timestamp">{{ block.time }}</td>
                </tr>
                {% endfor %}
            </tbody>
        </table>
    </div>
{% endblock %}
"""


VALIDATORS_TEMPLATE = """
{% extends "base.html" %}
{% block content %}
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-label">Total Validators</div>
            <div class="stat-value">{{ consensus_stats.total_validators }}</div>
        </div>

        <div class="stat-card">
            <div class="stat-label">Active Validators</div>
            <div class="stat-value">{{ consensus_stats.active_validators }}</div>
        </div>

        <div class="stat-card">
            <div class="stat-label">Total Staked</div>
            <div class="stat-value">{{ consensus_stats.total_staked }}<span class="stat-unit">SPK</span></div>
        </div>

        <div class="stat-card">
            <div class="stat-label">Green Stake %</div>
            <div class="stat-value">{{ "%.1f"|format(consensus_stats.green_stake_percentage) }}<span class="stat-unit">%</span></div>
        </div>
    </div>

    <div class="card">
        <h2 class="card-title">Validator List</h2>
        <table>
            <thead>
                <tr>
                    <th>Address</th>
                    <th>Stake</th>
                    <th>Green</th>
                    <th>Reputation</th>
                    <th>Status</th>
                    <th>Blocks Proposed</th>
                </tr>
            </thead>
            <tbody>
                {% for val in validators %}
                <tr>
                    <td class="hash">{{ val.address[:20] }}...</td>
                    <td><strong>{{ val.stake }} SPK</strong></td>
                    <td>
                        {% if val.green_certified %}
                            <span class="badge badge-green">🌱 Green</span>
                        {% else %}
                            <span style="color: #a0aec0;">⚡ Regular</span>
                        {% endif %}
                    </td>
                    <td>{{ val.reputation }}/100</td>
                    <td>
                        {% if val.is_active %}
                            <span style="color: #48bb78;">● Active</span>
                        {% else %}
                            <span style="color: #cbd5e0;">○ Inactive</span>
                        {% endif %}
                    </td>
                    <td>{{ val.blocks_proposed }}</td>
                </tr>
                {% endfor %}
            </tbody>
        </table>
    </div>
{% endblock %}
"""


ORACLE_TEMPLATE = """
{% extends "base.html" %}
{% block content %}
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-label">Proofs Verified</div>
            <div class="stat-value">{{ oracle_stats.total_proofs_verified }}</div>
        </div>

        <div class="stat-card">
            <div class="stat-label">Energy Processed</div>
            <div class="stat-value">{{ oracle_stats.total_energy_kwh }}<span class="stat-unit">kWh</span></div>
        </div>

        <div class="stat-card">
            <div class="stat-label">SPK Minted</div>
            <div class="stat-value">{{ oracle_stats.total_spk_minted }}<span class="stat-unit">SPK</span></div>
        </div>

        <div class="stat-card">
            <div class="stat-label">Trusted Meters</div>
            <div class="stat-value">{{ oracle_stats.trusted_meters }}</div>
        </div>
    </div>

    <div class="card">
        <h2 class="card-title">Energy Oracle Information</h2>
        <table>
            <thead>
                <tr>
                    <th>Metric</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Total Proofs Verified</strong></td>
                    <td>{{ oracle_stats.total_proofs_verified }}</td>
                </tr>
                <tr>
                    <td><strong>Total Energy Processed</strong></td>
                    <td>{{ oracle_stats.total_energy_kwh }} kWh</td>
                </tr>
                <tr>
                    <td><strong>Total SPK Minted</strong></td>
                    <td>{{ oracle_stats.total_spk_minted }} SPK</td>
                </tr>
                <tr>
                    <td><strong>Trusted Meters</strong></td>
                    <td>{{ oracle_stats.trusted_meters }}</td>
                </tr>
                <tr>
                    <td><strong>Trusted Grid Operators</strong></td>
                    <td>{{ oracle_stats.trusted_operators }}</td>
                </tr>
            </tbody>
        </table>
    </div>
{% endblock %}
"""


# =============================================================================
# ROUTES
# =============================================================================

@app.route('/')
def home():
    """Home page with overview."""
    stats = node.get_full_stats()

    # Get recent blocks
    recent_blocks = []
    for i in range(min(10, len(node.blockchain.chain))):
        block = node.blockchain.chain[-(i+1)]
        recent_blocks.append({
            'height': block.height,
            'block_hash': block.block_hash,
            'tx_count': len(block.transactions),
            'validator': block.header.validator,
            'time': time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(block.header.timestamp))
        })

    template = BASE_TEMPLATE.replace('{% block content %}{% endblock %}', HOME_TEMPLATE)

    return render_template_string(
        template,
        title="Home",
        page="home",
        stats=stats,
        recent_blocks=recent_blocks
    )


@app.route('/blocks')
def blocks():
    """All blocks page."""
    all_blocks = []
    for block in reversed(node.blockchain.chain):
        all_blocks.append({
            'height': block.height,
            'block_hash': block.block_hash,
            'prev_hash': block.header.prev_block_hash,
            'tx_count': len(block.transactions),
            'validator': block.header.validator,
            'time': time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(block.header.timestamp))
        })

    template = BASE_TEMPLATE.replace('{% block content %}{% endblock %}', BLOCKS_TEMPLATE)

    return render_template_string(
        template,
        title="Blocks",
        page="blocks",
        blocks=all_blocks
    )


@app.route('/validators')
def validators():
    """Validators page."""
    validators_list = node.pos.get_all_validators()
    consensus_stats = node.pos.get_consensus_stats()

    template = BASE_TEMPLATE.replace('{% block content %}{% endblock %}', VALIDATORS_TEMPLATE)

    return render_template_string(
        template,
        title="Validators",
        page="validators",
        validators=validators_list,
        consensus_stats=consensus_stats
    )


@app.route('/oracle')
def oracle():
    """Energy oracle page."""
    oracle_stats = node.oracle.get_oracle_stats()

    template = BASE_TEMPLATE.replace('{% block content %}{% endblock %}', ORACLE_TEMPLATE)

    return render_template_string(
        template,
        title="Energy Oracle",
        page="oracle",
        oracle_stats=oracle_stats
    )


# =============================================================================
# MAIN
# =============================================================================

if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description="SolarPunkCoin Block Explorer")
    parser.add_argument('--host', default='0.0.0.0', help='Host to bind to')
    parser.add_argument('--port', type=int, default=8080, help='Port to bind to')
    parser.add_argument('--debug', action='store_true', help='Enable debug mode')

    args = parser.parse_args()

    print(f"=" * 70)
    print(f"SolarPunkCoin Block Explorer")
    print(f"=" * 70)
    print(f"Host: {args.host}")
    print(f"Port: {args.port}")
    print(f"=" * 70)
    print(f"\nAccess the explorer at: http://{args.host}:{args.port}")
    print(f"=" * 70)

    app.run(host=args.host, port=args.port, debug=args.debug)
