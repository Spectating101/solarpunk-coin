# SolarPunk Energy Derivatives API
# Deployable on Railway, Render, Fly.io, or any Docker host

FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY energy_derivatives/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir fastapi uvicorn[standard] pydantic

# Copy application code
COPY energy_derivatives/ ./energy_derivatives/

# Set Python path so imports work
ENV PYTHONPATH=/app/energy_derivatives
ENV PORT=8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

EXPOSE 8000

CMD uvicorn energy_derivatives.api.main:app --host 0.0.0.0 --port ${PORT}
