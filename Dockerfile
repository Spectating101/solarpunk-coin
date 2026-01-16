# Production-Grade Oracle Service Container
# SolarPunk Pillar 3 Pricing Engine

FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY energy_derivatives/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir fastapi uvicorn pydantic

# Copy application code
COPY scripts/pillar3_engine.py ./pillar3_engine.py
COPY energy_derivatives/ ./energy_derivatives/
COPY empirical/ ./empirical/

# Create oracle service wrapper
COPY oracle_service.py ./oracle_service.py

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health')"

# Expose API port
EXPOSE 8000

# Run FastAPI server
CMD ["uvicorn", "oracle_service:app", "--host", "0.0.0.0", "--port", "8000"]
