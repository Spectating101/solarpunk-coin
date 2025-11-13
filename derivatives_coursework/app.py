"""
Cryptocurrency Energy Derivatives - Interactive Web Application
================================================================

Professional-grade interactive dashboard with real-time data and visualizations.

Run with: streamlit run app.py
"""

import streamlit as st
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import traceback

# Import our modules
from pricer import AmericanOptionPricer
from live_data import LiveDataFetcher
from visualizations import ProfessionalVisualizer

# Page configuration
st.set_page_config(
    page_title="Crypto Energy Derivatives Pricer",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
    <style>
    .main-header {
        font-size: 2.5rem;
        font-weight: bold;
        color: #1f77b4;
        text-align: center;
        margin-bottom: 1rem;
    }
    .sub-header {
        font-size: 1.2rem;
        color: #666;
        text-align: center;
        margin-bottom: 2rem;
    }
    .metric-box {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 0.5rem;
        margin: 0.5rem 0;
    }
    .stAlert {
        margin-top: 1rem;
    }
    </style>
""", unsafe_allow_html=True)


@st.cache_data(ttl=300)  # Cache for 5 minutes
def fetch_live_data():
    """Fetch live Bitcoin data with caching."""
    fetcher = LiveDataFetcher()
    return fetcher.get_live_pricing_parameters(historical_days=365)


def main():
    # Header
    st.markdown('<div class="main-header">⚡ Cryptocurrency Energy Derivatives Pricer</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Real-Time American Option Pricing with Interactive Analysis</div>', unsafe_allow_html=True)

    # Sidebar - Controls
    st.sidebar.header("📊 Pricing Parameters")

    # Fetch live data
    with st.spinner("Fetching live Bitcoin data..."):
        try:
            live_params = fetch_live_data()
            data_loaded = True
        except Exception as e:
            st.sidebar.error(f"Could not fetch live data: {e}")
            live_params = {
                'S0': 1.0, 'K': 1.0, 'sigma': 0.45, 'r': 0.05, 'T': 1.0,
                'btc_price': 50000, 'source': 'Fallback',
                'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            data_loaded = False

    # Show live data status
    if data_loaded:
        st.sidebar.success(f"✓ Live data loaded")
        st.sidebar.caption(f"Source: {live_params['source']}")
        st.sidebar.caption(f"Updated: {live_params['timestamp']}")
    else:
        st.sidebar.warning("Using fallback data")

    st.sidebar.markdown("---")

    # Interactive controls
    st.sidebar.subheader("Adjust Parameters")

    spot_multiplier = st.sidebar.slider(
        "Spot Price Multiplier",
        min_value=0.5, max_value=1.5, value=1.0, step=0.05,
        help="Adjust current energy price (1.0 = base from live data)"
    )

    strike_multiplier = st.sidebar.slider(
        "Strike Price Multiplier",
        min_value=0.5, max_value=1.5, value=1.0, step=0.05,
        help="Adjust option strike price (1.0 = ATM)"
    )

    time_to_maturity = st.sidebar.slider(
        "Time to Maturity (years)",
        min_value=0.1, max_value=3.0, value=1.0, step=0.1,
        help="Time until option expiration"
    )

    volatility = st.sidebar.slider(
        "Volatility (σ)",
        min_value=0.1, max_value=1.0, value=float(live_params['sigma']), step=0.05,
        format="%.0f%%",
        help="Annualized volatility of energy price"
    )

    risk_free_rate = st.sidebar.slider(
        "Risk-Free Rate",
        min_value=0.0, max_value=0.15, value=0.05, step=0.01,
        format="%.0f%%",
        help="Annualized risk-free interest rate"
    )

    st.sidebar.markdown("---")

    num_steps = st.sidebar.select_slider(
        "Binomial Tree Steps",
        options=[50, 100, 200, 500],
        value=100,
        help="More steps = higher accuracy but slower"
    )

    # Calculate adjusted parameters
    S0 = live_params['S0'] * spot_multiplier
    K = live_params['S0'] * strike_multiplier
    T = time_to_maturity
    sigma = volatility
    r = risk_free_rate

    # Main content area
    col1, col2, col3 = st.columns(3)

    with col1:
        st.metric(
            "Bitcoin Price",
            f"${live_params.get('btc_price', 0):,.0f}",
            help="Current Bitcoin market price"
        )

    with col2:
        st.metric(
            "Energy Unit Price (S₀)",
            f"${S0:.4f}",
            help="Current energy price (underlying asset)"
        )

    with col3:
        moneyness = S0 / K
        if moneyness > 1.05:
            status = "Deep ITM 🟢"
        elif moneyness > 1.0:
            status = "In-the-Money 🟢"
        elif moneyness > 0.95:
            status = "At-the-Money 🟡"
        else:
            status = "Out-of-Money 🔴"

        st.metric(
            "Moneyness (S/K)",
            f"{moneyness:.2%}",
            delta=status,
            help="Option moneyness status"
        )

    st.markdown("---")

    # Price the option
    with st.spinner("Pricing American option..."):
        try:
            pricer = AmericanOptionPricer(
                S0=S0, K=K, T=T, r=r, sigma=sigma, N=num_steps
            )

            option_value = pricer.price()
            greeks = pricer.compute_greeks()
            boundary = pricer.compute_exercise_boundary()

            pricing_success = True
        except Exception as e:
            st.error(f"Pricing failed: {e}")
            st.code(traceback.format_exc())
            pricing_success = False

    if pricing_success:
        # Results section
        st.header("💰 Option Pricing Results")

        col1, col2, col3, col4 = st.columns(4)

        with col1:
            st.metric(
                "American Call Value",
                f"${option_value:.4f}",
                help="Fair value of American call option"
            )

        with col2:
            intrinsic = max(S0 - K, 0)
            st.metric(
                "Intrinsic Value",
                f"${intrinsic:.4f}",
                help="Value if exercised immediately"
            )

        with col3:
            time_value = option_value - intrinsic
            st.metric(
                "Time Value",
                f"${time_value:.4f}",
                help="Premium for holding vs exercising"
            )

        with col4:
            # Compute European for comparison
            from scipy.stats import norm
            d1 = (np.log(S0/K) + (r + 0.5*sigma**2)*T) / (sigma*np.sqrt(T))
            d2 = d1 - sigma*np.sqrt(T)
            european = S0 * norm.cdf(d1) - K * np.exp(-r*T) * norm.cdf(d2)
            early_premium = option_value - european
            st.metric(
                "Early Exercise Premium",
                f"${early_premium:.4f}",
                help="American vs European value difference"
            )

        st.markdown("---")

        # Greeks section
        st.header("📈 The Greeks - Risk Sensitivities")

        col1, col2, col3, col4, col5 = st.columns(5)

        with col1:
            st.metric(
                "Delta (Δ)",
                f"{greeks['delta']:.4f}",
                help="Price sensitivity to spot (∂V/∂S)"
            )

        with col2:
            st.metric(
                "Gamma (Γ)",
                f"{greeks['gamma']:.4f}",
                help="Delta sensitivity to spot (∂²V/∂S²)"
            )

        with col3:
            st.metric(
                "Vega (ν)",
                f"{greeks['vega']:.4f}",
                help="Price sensitivity to volatility (∂V/∂σ)"
            )

        with col4:
            st.metric(
                "Theta (Θ)",
                f"{greeks['theta']:.4f}",
                help="Time decay per year (∂V/∂T)"
            )

        with col5:
            st.metric(
                "Rho (ρ)",
                f"{greeks['rho']:.4f}",
                help="Price sensitivity to rates (∂V/∂r)"
            )

        st.markdown("---")

        # Visualizations section
        st.header("📊 Professional Visualizations")

        viz = ProfessionalVisualizer()

        # Tab layout for different visualizations
        tab1, tab2, tab3 = st.tabs(["📈 Comprehensive Analysis", "🗻 3D Surface", "🔥 Greeks Heatmaps"])

        with tab1:
            st.subheader("Comprehensive 9-Panel Analysis")
            with st.spinner("Generating comprehensive analysis (may take 20-30 seconds)..."):
                try:
                    fig = viz.plot_comprehensive_analysis(pricer, greeks, boundary)
                    st.pyplot(fig)
                    plt.close()
                except Exception as e:
                    st.error(f"Visualization failed: {e}")

        with tab2:
            st.subheader("3D Option Value Surface")
            st.caption("Option value across spot price and volatility dimensions")
            with st.spinner("Generating 3D surface (may take 30-40 seconds)..."):
                try:
                    fig = viz.plot_option_value_surface(
                        pricer_class=AmericanOptionPricer,
                        S0=S0, K=K, T=T, r=r,
                        sigma_range=(0.2, 0.8),
                        S_range=(S0*0.5, S0*1.5)
                    )
                    st.pyplot(fig)
                    plt.close()
                except Exception as e:
                    st.error(f"3D surface failed: {e}")

        with tab3:
            st.subheader("Greeks Sensitivity Heatmaps")
            st.caption("How all Greeks vary across spot price and volatility ranges")
            with st.spinner("Generating heatmaps (may take 40-50 seconds)..."):
                try:
                    fig = viz.plot_greeks_heatmap(
                        pricer_class=AmericanOptionPricer,
                        S0=S0, K=K, T=T, r=r,
                        base_sigma=sigma
                    )
                    st.pyplot(fig)
                    plt.close()
                except Exception as e:
                    st.error(f"Heatmaps failed: {e}")

        st.markdown("---")

        # Delta hedging section
        st.header("🛡️ Delta Hedging Strategy")

        num_options = st.number_input(
            "Number of Options in Portfolio",
            min_value=100, max_value=100000, value=1000, step=100
        )

        delta = greeks['delta']
        gamma = greeks['gamma']

        total_delta = num_options * delta
        hedge_units = -total_delta

        col1, col2 = st.columns(2)

        with col1:
            st.subheader("Position")
            st.write(f"**Long {num_options:,} call options**")
            st.write(f"Option Value: ${option_value:.4f} each")
            st.write(f"Total Investment: ${num_options * option_value:,.2f}")
            st.write("")
            st.write(f"Portfolio Delta: {total_delta:,.2f}")
            st.write(f"Portfolio Gamma: {num_options * gamma:,.2f}")

        with col2:
            st.subheader("Delta Hedge")
            st.write(f"**{'SHORT' if hedge_units < 0 else 'LONG'} {abs(hedge_units):,.2f} units**")
            st.write(f"Hedge Value: ${abs(hedge_units) * S0:,.2f}")
            st.write("")
            st.success("✓ Portfolio is delta-neutral")
            st.caption("Net Delta ≈ 0.00")

        # P&L simulation
        st.subheader("P&L for Small Spot Moves")

        moves = [-0.10, -0.05, 0.0, 0.05, 0.10]
        pnl_data = []

        for dS in moves:
            dV_option = num_options * (delta * dS + 0.5 * gamma * dS**2)
            dV_hedge = hedge_units * dS
            dV_total = dV_option + dV_hedge
            pnl_data.append({
                "Spot Move": f"{dS:+.2f}",
                "Option P&L": f"${dV_option:+,.2f}",
                "Hedge P&L": f"${dV_hedge:+,.2f}",
                "Net P&L": f"${dV_total:+,.2f}"
            })

        st.table(pnl_data)

        st.markdown("---")

        # Exercise boundary analysis
        st.header("🎯 Early Exercise Analysis")

        valid_boundary = boundary[~np.isnan(boundary)]

        col1, col2 = st.columns(2)

        with col1:
            st.subheader("Exercise Boundary")
            if len(valid_boundary) > 0:
                st.write(f"Critical Price (T=0): **${valid_boundary[0]:.4f}**")
                st.write(f"Critical Price (T={T}): **${valid_boundary[-1]:.4f}**")
                st.write(f"Current Spot: **${S0:.4f}**")
                st.write("")
                if S0 > valid_boundary[0]:
                    st.success("🟢 Spot ABOVE boundary: Consider early exercise")
                else:
                    st.info("🟡 Spot BELOW boundary: Hold option")

        with col2:
            st.subheader("Value Decomposition")
            st.write(f"American Call: **${option_value:.4f}**")
            st.write(f"European Call: **${european:.4f}**")
            st.write(f"Early Premium: **${early_premium:.4f}**")
            st.write("")
            if early_premium > 0.001:
                st.success(f"✓ Early exercise has value ({early_premium/european:.1%})")
            else:
                st.info("✓ American ≈ European for these parameters")

    # Footer
    st.markdown("---")
    st.caption("Built with Streamlit | American Option Pricing via Binomial Trees | Real-time Bitcoin Data from CoinGecko")
    st.caption(f"Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")


if __name__ == "__main__":
    main()
