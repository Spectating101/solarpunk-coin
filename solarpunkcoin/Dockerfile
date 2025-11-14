# SolarPunkCoin - Production Dockerfile
# ======================================

FROM python:3.9-slim

LABEL maintainer="solarpunkcoin@example.com"
LABEL description="SolarPunkCoin - Renewable Energy-Backed Cryptocurrency Node"
LABEL version="1.0.0"

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create data directory for blockchain storage
RUN mkdir -p /data/blockchain

# Expose ports
EXPOSE 8333  # P2P network
EXPOSE 8545  # RPC API
EXPOSE 8501  # Streamlit dashboard

# Environment variables
ENV SPK_DATA_DIR=/data/blockchain
ENV SPK_NETWORK=mainnet
ENV PYTHONUNBUFFERED=1

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:8545/health', timeout=5)" || exit 1

# Default command (can be overridden)
CMD ["python", "node/spk_node.py", "--node-id", "docker-node", "--port", "8333"]
