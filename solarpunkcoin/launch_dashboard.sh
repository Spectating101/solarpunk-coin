#!/bin/bash
# Quick launcher for SolarPunkCoin Dashboard

echo "🌱 Launching SolarPunkCoin Dashboard..."
echo ""
echo "This will open the web interface in your browser."
echo "Press Ctrl+C to stop."
echo ""

cd "$(dirname "$0")"

# Check if streamlit is installed
if ! command -v streamlit &> /dev/null; then
    echo "⚠️  Streamlit not found. Installing dependencies..."
    pip install -r requirements.txt
fi

# Launch dashboard
streamlit run web/dashboard.py
