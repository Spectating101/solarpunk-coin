# SolarPunkCoin - Deployment Guide

**Complete Production Deployment Instructions**

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Docker Deployment](#docker-deployment)
3. [Manual Deployment](#manual-deployment)
4. [CLI Wallet](#cli-wallet)
5. [REST API](#rest-api)
6. [Block Explorer](#block-explorer)
7. [Monitoring](#monitoring)
8. [Testing](#testing)
9. [Performance Benchmarks](#performance-benchmarks)
10. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Docker & Docker Compose (for containerized deployment)
- 2GB RAM minimum
- 10GB disk space

### Install Dependencies

```bash
cd solarpunkcoin
pip install -r requirements.txt
```

### Run Demo

```bash
# Test all components
python node/spk_node.py --demo
```

---

## 🐳 Docker Deployment

### Single Command Deployment

```bash
docker-compose up -d
```

This starts:
- 3 validator nodes
- 1 full node
- Web dashboard (port 8501)
- Block explorer (port 8080)
- REST API (port 8545)
- Prometheus (port 9090)
- Grafana (port 3000)

### Access Services

- **Dashboard**: http://localhost:8501
- **Block Explorer**: http://localhost:8080
- **REST API**: http://localhost:8545
- **Grafana**: http://localhost:3000 (admin/admin)
- **Prometheus**: http://localhost:9090

### Manage Containers

```bash
# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Restart specific service
docker-compose restart validator1

# Scale validators
docker-compose up -d --scale validator=5
```

---

## 🔧 Manual Deployment

### 1. Run Single Validator Node

```bash
python node/spk_node.py \
  --node-id validator1 \
  --validator \
  --stake 10000 \
  --port 8333
```

### 2. Run Full Node (Non-Validator)

```bash
python node/spk_node.py \
  --node-id fullnode1 \
  --port 8334
```

### 3. Run Web Dashboard

```bash
streamlit run web/dashboard.py --server.port 8501
```

### 4. Run Block Explorer

```bash
python web/block_explorer.py --port 8080
```

### 5. Run REST API

```bash
python api/rest_api.py --port 8545
```

---

## 💼 CLI Wallet

### Create New Wallet

```bash
cd wallet
python cli.py create
```

### Create Encrypted Wallet

```bash
python cli.py create --password
```

### Check Balance

```bash
python cli.py balance
python cli.py balance SPKaddress123...
```

### Send SPK

```bash
python cli.py send SPKrecipient123... 100 --fee 0.001
```

### Import Existing Wallet

```bash
python cli.py import abc123def456...
```

### Export Private Key

```bash
python cli.py export
```

### View Transaction History

```bash
python cli.py history
python cli.py history SPKaddress123...
```

### Stake Tokens

```bash
python cli.py stake 1000
```

### View Wallet Info

```bash
python cli.py info
```

---

## 🌐 REST API

### Start API Server

```bash
python api/rest_api.py --host 0.0.0.0 --port 8545
```

### API Endpoints

#### Blockchain Info
```bash
curl http://localhost:8545/api/v1/blockchain/info
```

#### Get Block
```bash
curl http://localhost:8545/api/v1/block/10
curl http://localhost:8545/api/v1/block/latest
```

#### Get Balance
```bash
curl http://localhost:8545/api/v1/address/SPKaddr123.../balance
```

#### Submit Energy Proof
```bash
curl -X POST http://localhost:8545/api/v1/energy/submit \
  -H "Content-Type: application/json" \
  -d '{
    "proof_id": "proof_001",
    "surplus_kwh": 1500,
    "wholesale_price": 0.08,
    "grid_load": 0.70,
    "grid_operator": "TAIPOWER",
    "source_type": "SOLAR",
    "location": "Yuan Ze University",
    "meter_id": "METER_YZU_SOLAR_001",
    "meter_signature": "sig123...",
    "operator_cert_hash": "cert123..."
  }'
```

#### Get Validators
```bash
curl http://localhost:8545/api/v1/validators
```

#### Check Peg Stability
```bash
curl -X POST http://localhost:8545/api/v1/peg/check \
  -H "Content-Type: application/json" \
  -d '{
    "spk_market_price": 0.105,
    "wholesale_price": 0.08
  }'
```

---

## 🔍 Block Explorer

### Start Explorer

```bash
python web/block_explorer.py --host 0.0.0.0 --port 8080
```

### Access

Open browser: http://localhost:8080

### Features

- **Home**: Blockchain overview and recent blocks
- **Blocks**: Complete block list
- **Validators**: Validator statistics and list
- **Oracle**: Energy oracle statistics

---

## 📊 Monitoring

### Prometheus Metrics

Start metrics exporter:

```bash
python monitoring/metrics_exporter.py --port 9091
```

View metrics:
```bash
curl http://localhost:9091/metrics
```

### Available Metrics

- `spk_blockchain_height` - Current block height
- `spk_total_supply` - Total SPK supply
- `spk_energy_reserve_kwh` - Energy reserve
- `spk_total_validators` - Number of validators
- `spk_oracle_proofs_verified` - Energy proofs verified
- `spk_mempool_size` - Transactions in mempool

### Grafana Dashboards

1. Access: http://localhost:3000
2. Login: admin/admin
3. Import dashboard from `monitoring/grafana-dashboards/`

---

## 🧪 Testing

### Run All Tests

```bash
pytest tests/ -v
```

### Run Specific Test Suite

```bash
# Blockchain tests
pytest tests/test_blockchain.py -v

# Consensus tests
pytest tests/test_consensus.py -v

# Oracle tests
pytest tests/test_oracle.py -v

# Peg stability tests
pytest tests/test_peg_stability.py -v
```

### Test Coverage

```bash
pytest tests/ --cov=. --cov-report=html
```

View coverage report: `htmlcov/index.html`

---

## ⚡ Performance Benchmarks

### Run Benchmarks

```bash
python tests/benchmarks/benchmark.py
```

### Expected Performance

| Operation | Performance |
|-----------|-------------|
| Transaction Creation | ~1000 tx/sec |
| Block Creation | ~50 blocks/sec |
| Block Validation | ~200 validations/sec |
| UTXO Lookup | ~5000 lookups/sec |
| Validator Selection | ~800 selections/sec |
| Energy Proof Validation | ~600 validations/sec |

---

## 🔧 Configuration

### Environment Variables

```bash
export SPK_DATA_DIR=/data/blockchain
export SPK_NETWORK=testnet
export SPK_NODE_TYPE=validator
export SPK_GREEN_CERTIFIED=true
```

### Network Configuration

Edit `network/p2p.py` for:
- Peer discovery settings
- Network magic bytes
- Message protocol version

### Consensus Parameters

Edit `consensus/pos.py` for:
- Minimum stake requirement
- Slashing percentage
- Reputation decay rate
- Epoch duration

### Oracle Parameters

Edit `oracle/energy_oracle.py` for:
- Grid stress threshold
- Proof expiry time
- Issuance coefficient (α)

### Peg Stability Parameters

Edit `contracts/peg_stability.py` for:
- Stability band (δ)
- PID controller gains (Kp, Ki, Kd)
- Feedback parameter (γ)

---

## 🐛 Troubleshooting

### Node Won't Start

```bash
# Check logs
tail -f logs/spk_node.log

# Verify dependencies
pip install -r requirements.txt

# Check port availability
netstat -an | grep 8333
```

### Database Errors

```bash
# Reset blockchain database
rm -rf data/blockchain/*.db

# Reinitialize
python node/spk_node.py --demo
```

### Sync Issues

```bash
# Check peer connections
curl http://localhost:8545/api/v1/blockchain/info

# Force resync
python node/spk_node.py --resync
```

### Memory Issues

```bash
# Increase Python memory limit
export PYTHONMALLOC=malloc

# Use production database
# Switch from SQLite to PostgreSQL in storage/database.py
```

---

## 🔐 Security Checklist

### Production Deployment

- [ ] Enable wallet encryption
- [ ] Use HTTPS for all APIs
- [ ] Configure firewall rules
- [ ] Rotate validator keys
- [ ] Enable rate limiting
- [ ] Set up monitoring alerts
- [ ] Regular security audits
- [ ] Backup blockchain data
- [ ] Use strong passwords
- [ ] Enable 2FA for admin access

---

## 📈 Scaling

### Horizontal Scaling

```bash
# Add more validators
docker-compose up -d --scale validator=10

# Add read replicas
docker-compose up -d --scale fullnode=5
```

### Vertical Scaling

- Increase RAM for better UTXO caching
- Use SSD for blockchain database
- Optimize Python with PyPy
- Consider Rust rewrite for 10x performance

---

## 🌍 Network Modes

### Testnet (Default)

```bash
export SPK_NETWORK=testnet
python node/spk_node.py
```

### Mainnet

```bash
export SPK_NETWORK=mainnet
python node/spk_node.py --validator --stake 10000
```

### Local Development

```bash
export SPK_NETWORK=devnet
python node/spk_node.py --demo
```

---

## 📚 Additional Resources

- **Main README**: [../README.md](../README.md)
- **Production Ready**: [PRODUCTION_READY.md](PRODUCTION_READY.md)
- **API Documentation**: Auto-generated at http://localhost:8545/api/v1/info
- **Monitoring Dashboards**: http://localhost:3000

---

## 🆘 Support

For issues and questions:
- Check logs in `logs/` directory
- Review test output: `pytest tests/ -v`
- Run diagnostics: `python node/spk_node.py --diagnose`
- Open issue on GitHub

---

**Built with ❤️ for a sustainable future**

🌱 Green Energy | 💚 Decentralized | ⚡ Efficient | 🔐 Secure
