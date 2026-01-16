import sys
from pathlib import Path
import streamlit as st
import json
from io import StringIO

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from spk_derivatives.data_loader import load_parameters  # type: ignore  # noqa: E402
from spk_derivatives.binomial import BinomialTree  # type: ignore  # noqa: E402
from spk_derivatives.monte_carlo import MonteCarloSimulator  # type: ignore  # noqa: E402
from spk_derivatives.sensitivities import GreeksCalculator  # type: ignore  # noqa: E402
from spk_derivatives.plots import EnergyDerivativesPlotter  # type: ignore  # noqa: E402

st.set_page_config(page_title="Energy Derivatives Dashboard", layout="wide", page_icon="⚡️")
st.markdown(
    """
    <style>
    .main {background-color: #0f172a;}
    h1, h2, h3, h4, h5, h6, p, li, div {color: #e2e8f0;}
    .stMetric {background: #1e293b; border-radius: 8px; padding: 8px;}
    </style>
    """,
    unsafe_allow_html=True,
)
st.title("⚡️ Energy Derivatives Pricing Dashboard")


@st.cache_data
def _load_params(data_dir: str, use_repo_fallback: bool):
    return load_parameters(data_dir=data_dir, use_repo_fallback=use_repo_fallback)


with st.sidebar:
    st.header("Model Inputs")
    data_dir = st.text_input("Data directory", value="empirical")
    use_repo_fallback = st.checkbox("Use repo fallback", value=True)
    use_live_if_missing = st.checkbox("Use live data if missing", value=False)
    api_key = st.text_input("API key (optional for API calls)", type="password")
    params = _load_params(data_dir, use_repo_fallback)

    S0 = st.number_input("Underlying (S0)", value=float(params["S0"]))
    K = st.number_input("Strike (K)", value=float(params["K"]))
    T = st.number_input("Maturity (T, years)", value=float(params["T"]), min_value=0.01)
    r = st.number_input("Rate (r)", value=float(params["r"]), format="%.4f")
    sigma = st.number_input("Volatility (sigma)", value=float(params["sigma"]), format="%.4f")
    payoff_type = st.selectbox("Payoff", ["call", "redeemable"])
    method = st.selectbox("Pricing Method", ["binomial", "monte_carlo"])
    N = st.slider("Binomial Steps", min_value=10, max_value=500, value=100, step=10)
    num_simulations = st.slider("MC Paths", min_value=1000, max_value=20000, value=5000, step=1000)

col1, col2, col3 = st.columns([1.2, 1, 1])

if st.button("Run Pricing", type="primary"):
    if method == "binomial":
        tree = BinomialTree(S0, K, T, r, sigma, N, payoff_type)
        price = tree.price()
        with col1:
            st.subheader("Binomial Price")
            st.metric("Price", f"${price:,.6f}")
    else:
        sim = MonteCarloSimulator(S0, K, T, r, sigma, num_simulations, payoff_type=payoff_type)
        price, low, high = sim.confidence_interval()
        with col1:
            st.subheader("Monte-Carlo Price")
            st.metric("Price", f"${price:,.6f}", f"95% CI: [{low:,.6f}, {high:,.6f}]")

    calc = GreeksCalculator(S0, K, T, r, sigma, pricing_method=method,
                            N=N, num_simulations=num_simulations, payoff_type=payoff_type)
    greeks = calc.compute_all_greeks()

    with col2:
        st.subheader("Greeks")
        for g in ["Delta", "Gamma", "Vega", "Theta", "Rho"]:
            st.write(f"{g}: {greeks[g]:.6f}")
        # export JSON
        export = {
            "S0": S0,
            "K": K,
            "T": T,
            "r": r,
            "sigma": sigma,
            "greeks": greeks,
        }
        json_buf = StringIO()
        json.dump(export, json_buf, indent=2)
        st.download_button("Download snapshot (JSON)", data=json_buf.getvalue(), file_name="snapshot.json")

    with col3:
        st.subheader("Stress Tests")
        vol_range = [0.1, 0.2, 0.3, 0.5, 0.8]
        rate_range = [-0.01, 0.0, 0.02, 0.05, 0.1]
        sim = MonteCarloSimulator(S0, K, T, r, sigma, num_simulations, payoff_type=payoff_type)
        base = sim.price()
        vol_prices = [(v, MonteCarloSimulator(S0, K, T, r, v, num_simulations, payoff_type=payoff_type).price()) for v in vol_range]
        rate_prices = [(rt, MonteCarloSimulator(S0, K, T, rt, sigma, num_simulations, payoff_type=payoff_type).price()) for rt in rate_range]
        st.write("Volatility scenarios:")
        for v, p in vol_prices:
            st.write(f"σ={v:.0%} → ${p:,.6f}")
        st.write("Rate scenarios:")
        for rt, p in rate_prices:
            st.write(f"r={rt:.2%} → ${p:,.6f}")

    st.subheader("Greeks Curve")
    fig = EnergyDerivativesPlotter.plot_greeks_curves(S0, K, T, r, sigma, payoff_type=payoff_type)
    st.pyplot(fig)
