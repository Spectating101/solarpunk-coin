"""
Cryptocurrency Energy Derivatives - Enhanced Web Application
=============================================================

Professional-grade interactive dashboard with:
- Real-time data integration
- Advanced visualizations
- Monte Carlo simulation
- Implied volatility calculator
- Scenario comparison
- PDF/CSV export

Run with: streamlit run app_enhanced.py
"""

import streamlit as st
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import traceback
import json
import io
from scipy.optimize import brentq
from scipy.stats import norm

# Import our modules
from pricer import AmericanOptionPricer
from live_data import LiveDataFetcher
from visualizations import ProfessionalVisualizer

# Page configuration
st.set_page_config(
    page_title="Crypto Energy Derivatives Pricer - Enhanced",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
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
    .download-section {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 0.5rem;
        margin: 1rem 0;
    }
    </style>
""", unsafe_allow_html=True)


# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

@st.cache_data(ttl=300)
def fetch_live_data():
    """Fetch live Bitcoin data with caching."""
    fetcher = LiveDataFetcher()
    return fetcher.get_live_pricing_parameters(historical_days=365)


def monte_carlo_simulation(S0, K, T, r, sigma, N_sims=10000, N_steps=252):
    """
    Monte Carlo simulation for option pricing.

    Simulates paths and computes option payoff distribution.
    """
    dt = T / N_steps
    paths = np.zeros((N_sims, N_steps + 1))
    paths[:, 0] = S0

    for t in range(1, N_steps + 1):
        Z = np.random.standard_normal(N_sims)
        paths[:, t] = paths[:, t-1] * np.exp((r - 0.5 * sigma**2) * dt + sigma * np.sqrt(dt) * Z)

    payoffs = np.maximum(paths[:, -1] - K, 0)
    option_value = np.exp(-r * T) * np.mean(payoffs)
    std_error = np.exp(-r * T) * np.std(payoffs) / np.sqrt(N_sims)

    return {
        'value': option_value,
        'std_error': std_error,
        'paths': paths,
        'payoffs': payoffs,
        'confidence_95': (option_value - 1.96 * std_error, option_value + 1.96 * std_error)
    }


def implied_volatility_solver(option_price, S0, K, T, r, option_type='call'):
    """
    Solve for implied volatility using Black-Scholes.
    """
    def bs_price(sigma):
        if T <= 0 or sigma <= 0:
            return 1e10
        d1 = (np.log(S0/K) + (r + 0.5*sigma**2)*T) / (sigma*np.sqrt(T))
        d2 = d1 - sigma*np.sqrt(T)
        if option_type == 'call':
            return S0 * norm.cdf(d1) - K * np.exp(-r*T) * norm.cdf(d2)
        else:
            return K * np.exp(-r*T) * norm.cdf(-d2) - S0 * norm.cdf(-d1)

    def objective(sigma):
        return bs_price(sigma) - option_price

    try:
        iv = brentq(objective, 0.01, 5.0)
        return iv
    except:
        return None


def create_results_dataframe(params, option_value, greeks, mc_result=None):
    """Create comprehensive results DataFrame for export."""
    data = {
        'Parameter': [
            'Spot Price (S₀)', 'Strike Price (K)', 'Time to Maturity (T)',
            'Volatility (σ)', 'Risk-Free Rate (r)',
            '', 'American Option Value', 'Intrinsic Value', 'Time Value',
            '', 'Delta', 'Gamma', 'Vega', 'Theta', 'Rho'
        ],
        'Value': [
            f"${params['S0']:.4f}", f"${params['K']:.4f}", f"{params['T']:.2f} years",
            f"{params['sigma']:.1%}", f"{params['r']:.1%}",
            '', f"${option_value:.4f}",
            f"${max(params['S0'] - params['K'], 0):.4f}",
            f"${option_value - max(params['S0'] - params['K'], 0):.4f}",
            '', f"{greeks['delta']:.4f}", f"{greeks['gamma']:.4f}",
            f"{greeks['vega']:.4f}", f"{greeks['theta']:.4f}", f"{greeks['rho']:.4f}"
        ]
    }

    if mc_result:
        data['Parameter'].extend(['', 'Monte Carlo Value', 'MC Std Error', 'MC 95% CI Lower', 'MC 95% CI Upper'])
        data['Value'].extend([
            '', f"${mc_result['value']:.4f}", f"${mc_result['std_error']:.4f}",
            f"${mc_result['confidence_95'][0]:.4f}", f"${mc_result['confidence_95'][1]:.4f}"
        ])

    return pd.DataFrame(data)


def save_params_preset(name, params):
    """Save parameter preset to session state."""
    if 'presets' not in st.session_state:
        st.session_state.presets = {}
    st.session_state.presets[name] = params.copy()


def load_params_preset(name):
    """Load parameter preset from session state."""
    if 'presets' in st.session_state and name in st.session_state.presets:
        return st.session_state.presets[name].copy()
    return None


# ============================================================================
# MAIN APPLICATION
# ============================================================================

def main():
    # Header
    st.markdown('<div class="main-header">⚡ Crypto Energy Derivatives Pricer - Enhanced Edition</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Advanced Options Analytics with Monte Carlo, Implied Vol, and Export Features</div>', unsafe_allow_html=True)

    # Create main tabs
    main_tab1, main_tab2, main_tab3, main_tab4 = st.tabs([
        "📊 Main Dashboard",
        "🎲 Monte Carlo Simulation",
        "🔍 Implied Volatility",
        "⚖️ Scenario Comparison"
    ])

    # ========================================================================
    # SIDEBAR - Controls
    # ========================================================================

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

    if data_loaded:
        st.sidebar.success(f"✓ Live data loaded")
        st.sidebar.caption(f"Source: {live_params['source']}")
        st.sidebar.caption(f"Updated: {live_params['timestamp']}")
    else:
        st.sidebar.warning("Using fallback data")

    st.sidebar.markdown("---")

    # Preset management
    st.sidebar.subheader("💾 Parameter Presets")

    preset_options = ["Live Data (Current)"]
    if 'presets' in st.session_state:
        preset_options.extend(list(st.session_state.presets.keys()))

    selected_preset = st.sidebar.selectbox("Load Preset", preset_options)

    col_save, col_load = st.sidebar.columns(2)
    with col_save:
        if st.button("💾 Save"):
            preset_name = st.text_input("Preset name:", key="preset_name_input")
            if preset_name:
                save_params_preset(preset_name, {
                    'spot_mult': st.session_state.get('spot_mult', 1.0),
                    'strike_mult': st.session_state.get('strike_mult', 1.0),
                    'T': st.session_state.get('T', 1.0),
                    'sigma': st.session_state.get('sigma', 0.45),
                    'r': st.session_state.get('r', 0.05)
                })
                st.success(f"Saved '{preset_name}'!")

    st.sidebar.markdown("---")

    # Load preset if selected
    if selected_preset != "Live Data (Current)" and selected_preset in st.session_state.get('presets', {}):
        loaded = load_params_preset(selected_preset)
        if loaded:
            spot_mult_default = loaded.get('spot_mult', 1.0)
            strike_mult_default = loaded.get('strike_mult', 1.0)
            T_default = loaded.get('T', 1.0)
            sigma_default = loaded.get('sigma', 0.45)
            r_default = loaded.get('r', 0.05)
    else:
        spot_mult_default = 1.0
        strike_mult_default = 1.0
        T_default = 1.0
        sigma_default = float(live_params['sigma'])
        r_default = 0.05

    # Interactive controls
    st.sidebar.subheader("Adjust Parameters")

    spot_multiplier = st.sidebar.slider(
        "Spot Price Multiplier",
        min_value=0.5, max_value=1.5, value=spot_mult_default, step=0.05,
        key='spot_mult',
        help="Adjust current energy price"
    )

    strike_multiplier = st.sidebar.slider(
        "Strike Price Multiplier",
        min_value=0.5, max_value=1.5, value=strike_mult_default, step=0.05,
        key='strike_mult',
        help="Adjust option strike price"
    )

    time_to_maturity = st.sidebar.slider(
        "Time to Maturity (years)",
        min_value=0.1, max_value=3.0, value=T_default, step=0.1,
        key='T',
        help="Time until option expiration"
    )

    volatility = st.sidebar.slider(
        "Volatility (σ)",
        min_value=0.1, max_value=1.0, value=sigma_default, step=0.05,
        key='sigma',
        format="%.0f%%",
        help="Annualized volatility"
    )

    risk_free_rate = st.sidebar.slider(
        "Risk-Free Rate",
        min_value=0.0, max_value=0.15, value=r_default, step=0.01,
        key='r',
        format="%.0f%%",
        help="Annualized risk-free rate"
    )

    st.sidebar.markdown("---")

    num_steps = st.sidebar.select_slider(
        "Binomial Tree Steps",
        options=[50, 100, 200, 500],
        value=100,
        help="More steps = higher accuracy"
    )

    # Calculate parameters
    S0 = live_params['S0'] * spot_multiplier
    K = live_params['S0'] * strike_multiplier
    T = time_to_maturity
    sigma = volatility
    r = risk_free_rate

    params = {'S0': S0, 'K': K, 'T': T, 'sigma': sigma, 'r': r}

    # Price the option
    with st.spinner("Pricing American option..."):
        try:
            pricer = AmericanOptionPricer(S0=S0, K=K, T=T, r=r, sigma=sigma, N=num_steps)
            option_value = pricer.price()
            greeks = pricer.compute_greeks()
            boundary = pricer.compute_exercise_boundary()
            pricing_success = True
        except Exception as e:
            st.error(f"Pricing failed: {e}")
            pricing_success = False

    # ========================================================================
    # TAB 1: MAIN DASHBOARD
    # ========================================================================

    with main_tab1:
        if not pricing_success:
            st.error("Cannot display results - pricing failed")
            return

        # Top metrics
        col1, col2, col3 = st.columns(3)

        with col1:
            st.metric("Bitcoin Price", f"${live_params.get('btc_price', 0):,.0f}")

        with col2:
            st.metric("Energy Unit Price (S₀)", f"${S0:.4f}")

        with col3:
            moneyness = S0 / K
            if moneyness > 1.05:
                status = "Deep ITM 🟢"
            elif moneyness > 1.0:
                status = "ITM 🟢"
            elif moneyness > 0.95:
                status = "ATM 🟡"
            else:
                status = "OTM 🔴"
            st.metric("Moneyness (S/K)", f"{moneyness:.2%}", delta=status)

        st.markdown("---")

        # Results
        st.header("💰 Option Pricing Results")

        col1, col2, col3, col4 = st.columns(4)

        with col1:
            st.metric("American Call Value", f"${option_value:.4f}")

        with col2:
            intrinsic = max(S0 - K, 0)
            st.metric("Intrinsic Value", f"${intrinsic:.4f}")

        with col3:
            time_value = option_value - intrinsic
            st.metric("Time Value", f"${time_value:.4f}")

        with col4:
            # European value
            d1 = (np.log(S0/K) + (r + 0.5*sigma**2)*T) / (sigma*np.sqrt(T))
            d2 = d1 - sigma*np.sqrt(T)
            european = S0 * norm.cdf(d1) - K * np.exp(-r*T) * norm.cdf(d2)
            early_premium = option_value - european
            st.metric("Early Exercise Premium", f"${early_premium:.4f}")

        st.markdown("---")

        # Greeks
        st.header("📈 The Greeks")

        col1, col2, col3, col4, col5 = st.columns(5)

        with col1:
            st.metric("Delta (Δ)", f"{greeks['delta']:.4f}")
        with col2:
            st.metric("Gamma (Γ)", f"{greeks['gamma']:.4f}")
        with col3:
            st.metric("Vega (ν)", f"{greeks['vega']:.4f}")
        with col4:
            st.metric("Theta (Θ)", f"{greeks['theta']:.4f}")
        with col5:
            st.metric("Rho (ρ)", f"{greeks['rho']:.4f}")

        st.markdown("---")

        # Visualizations
        st.header("📊 Visualizations")

        viz_tab1, viz_tab2, viz_tab3 = st.tabs([
            "📈 Comprehensive Analysis",
            "🗻 3D Surface",
            "🔥 Greeks Heatmaps"
        ])

        viz = ProfessionalVisualizer()

        with viz_tab1:
            with st.spinner("Generating comprehensive analysis..."):
                try:
                    fig = viz.plot_comprehensive_analysis(pricer, greeks, boundary)
                    st.pyplot(fig)
                    plt.close()
                except Exception as e:
                    st.error(f"Visualization failed: {e}")

        with viz_tab2:
            with st.spinner("Generating 3D surface..."):
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

        with viz_tab3:
            with st.spinner("Generating heatmaps..."):
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

        # Export section
        st.header("💾 Export Results")

        col1, col2 = st.columns(2)

        with col1:
            # CSV export
            results_df = create_results_dataframe(params, option_value, greeks)
            csv = results_df.to_csv(index=False)
            st.download_button(
                label="📥 Download Results (CSV)",
                data=csv,
                file_name=f"option_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
                mime="text/csv"
            )

        with col2:
            # JSON export
            export_data = {
                'timestamp': datetime.now().isoformat(),
                'parameters': params,
                'option_value': float(option_value),
                'greeks': {k: float(v) for k, v in greeks.items()},
                'moneyness': float(moneyness),
                'intrinsic_value': float(intrinsic),
                'time_value': float(time_value)
            }
            json_str = json.dumps(export_data, indent=2)
            st.download_button(
                label="📥 Download Results (JSON)",
                data=json_str,
                file_name=f"option_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
                mime="application/json"
            )

    # ========================================================================
    # TAB 2: MONTE CARLO SIMULATION
    # ========================================================================

    with main_tab2:
        st.header("🎲 Monte Carlo Simulation")
        st.write("Simulate thousands of price paths and compute option payoff distribution")

        col1, col2 = st.columns(2)

        with col1:
            n_sims = st.number_input("Number of Simulations", min_value=1000, max_value=100000, value=10000, step=1000)

        with col2:
            n_steps = st.number_input("Time Steps", min_value=50, max_value=1000, value=252, step=50)

        if st.button("🚀 Run Monte Carlo Simulation"):
            with st.spinner(f"Running {n_sims:,} simulations..."):
                mc_result = monte_carlo_simulation(S0, K, T, r, sigma, n_sims, n_steps)

            # Results
            col1, col2, col3 = st.columns(3)

            with col1:
                st.metric("MC Option Value", f"${mc_result['value']:.4f}")

            with col2:
                st.metric("Standard Error", f"${mc_result['std_error']:.4f}")

            with col3:
                diff = mc_result['value'] - option_value
                st.metric("vs Binomial", f"${diff:+.4f}", delta=f"{diff/option_value:+.1%}")

            st.success(f"95% Confidence Interval: [${mc_result['confidence_95'][0]:.4f}, ${mc_result['confidence_95'][1]:.4f}]")

            # Visualizations
            col1, col2 = st.columns(2)

            with col1:
                st.subheader("Sample Price Paths")
                fig, ax = plt.subplots(figsize=(10, 6))
                sample_paths = mc_result['paths'][:100]  # Show 100 paths
                times = np.linspace(0, T, n_steps + 1)
                for path in sample_paths:
                    ax.plot(times, path, alpha=0.3, linewidth=0.5)
                ax.axhline(K, color='r', linestyle='--', label='Strike', linewidth=2)
                ax.set_xlabel('Time (years)')
                ax.set_ylabel('Spot Price')
                ax.set_title('Sample Simulated Price Paths')
                ax.legend()
                ax.grid(True, alpha=0.3)
                st.pyplot(fig)
                plt.close()

            with col2:
                st.subheader("Payoff Distribution")
                fig, ax = plt.subplots(figsize=(10, 6))
                ax.hist(mc_result['payoffs'], bins=50, edgecolor='black', alpha=0.7)
                ax.axvline(mc_result['value'] * np.exp(r*T), color='r', linestyle='--',
                          label=f"Mean: ${mc_result['value']:.4f}", linewidth=2)
                ax.set_xlabel('Option Payoff at Maturity')
                ax.set_ylabel('Frequency')
                ax.set_title('Distribution of Option Payoffs')
                ax.legend()
                ax.grid(True, alpha=0.3)
                st.pyplot(fig)
                plt.close()

            # Export MC results
            st.subheader("Export Simulation Data")
            mc_df = pd.DataFrame({
                'Simulation': range(1, n_sims + 1),
                'Final_Price': mc_result['paths'][:, -1],
                'Payoff': mc_result['payoffs']
            })
            csv_mc = mc_df.to_csv(index=False)
            st.download_button(
                label="📥 Download Simulation Data (CSV)",
                data=csv_mc,
                file_name=f"monte_carlo_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
                mime="text/csv"
            )

    # ========================================================================
    # TAB 3: IMPLIED VOLATILITY
    # ========================================================================

    with main_tab3:
        st.header("🔍 Implied Volatility Calculator")
        st.write("Reverse-engineer volatility from observed option prices")

        col1, col2, col3 = st.columns(3)

        with col1:
            observed_price = st.number_input(
                "Observed Option Price",
                min_value=0.0001,
                max_value=float(S0),
                value=float(option_value),
                step=0.0001,
                format="%.4f"
            )

        with col2:
            iv_S0 = st.number_input("Spot Price", value=float(S0), format="%.4f")

        with col3:
            iv_K = st.number_input("Strike Price", value=float(K), format="%.4f")

        col4, col5, col6 = st.columns(3)

        with col4:
            iv_T = st.number_input("Time to Maturity", value=float(T), format="%.2f")

        with col5:
            iv_r = st.number_input("Risk-Free Rate", value=float(r), format="%.4f")

        with col6:
            option_type = st.selectbox("Option Type", ["call", "put"])

        if st.button("🔍 Calculate Implied Volatility"):
            with st.spinner("Solving for implied volatility..."):
                iv = implied_volatility_solver(observed_price, iv_S0, iv_K, iv_T, iv_r, option_type)

            if iv:
                st.success(f"✓ Implied Volatility: **{iv:.2%}** ({iv:.4f})")

                col1, col2 = st.columns(2)

                with col1:
                    st.metric("Implied Vol", f"{iv:.2%}")

                with col2:
                    diff = iv - sigma
                    st.metric("vs Current Vol", f"{diff:+.2%}", delta=f"{diff/sigma:+.1%}")

                # Volatility smile visualization
                st.subheader("Volatility Surface (Demo)")
                strikes = np.linspace(iv_K * 0.7, iv_K * 1.3, 20)
                ivs = []
                for strike in strikes:
                    # For demo: create artificial smile
                    moneyness_effect = 0.05 * ((strike - iv_K) / iv_K) ** 2
                    demo_iv = iv + moneyness_effect
                    ivs.append(demo_iv)

                fig, ax = plt.subplots(figsize=(10, 6))
                ax.plot(strikes, ivs, 'b-', linewidth=2)
                ax.axvline(iv_K, color='r', linestyle='--', label='Current Strike', linewidth=2)
                ax.axhline(iv, color='g', linestyle='--', label='Implied Vol', linewidth=2)
                ax.set_xlabel('Strike Price')
                ax.set_ylabel('Implied Volatility')
                ax.set_title('Volatility Smile (Demo)')
                ax.legend()
                ax.grid(True, alpha=0.3)
                st.pyplot(fig)
                plt.close()
            else:
                st.error("Could not solve for implied volatility. Check inputs.")

    # ========================================================================
    # TAB 4: SCENARIO COMPARISON
    # ========================================================================

    with main_tab4:
        st.header("⚖️ Scenario Comparison")
        st.write("Compare multiple scenarios side-by-side")

        # Define scenarios
        col1, col2, col3 = st.columns(3)

        with col1:
            st.subheader("Scenario 1: Base Case")
            s1_spot = st.number_input("S1 Spot Mult", value=1.0, step=0.05, key='s1_spot')
            s1_vol = st.number_input("S1 Volatility", value=float(sigma), step=0.05, key='s1_vol')
            s1_T = st.number_input("S1 Maturity", value=float(T), step=0.1, key='s1_T')

        with col2:
            st.subheader("Scenario 2: Stressed")
            s2_spot = st.number_input("S2 Spot Mult", value=0.8, step=0.05, key='s2_spot')
            s2_vol = st.number_input("S2 Volatility", value=float(sigma) * 1.5, step=0.05, key='s2_vol')
            s2_T = st.number_input("S2 Maturity", value=float(T), step=0.1, key='s2_T')

        with col3:
            st.subheader("Scenario 3: Bullish")
            s3_spot = st.number_input("S3 Spot Mult", value=1.2, step=0.05, key='s3_spot')
            s3_vol = st.number_input("S3 Volatility", value=float(sigma) * 0.8, step=0.05, key='s3_vol')
            s3_T = st.number_input("S3 Maturity", value=float(T), step=0.1, key='s3_T')

        if st.button("🔄 Run Scenario Comparison"):
            scenarios = [
                ("Base Case", s1_spot, s1_vol, s1_T),
                ("Stressed", s2_spot, s2_vol, s2_T),
                ("Bullish", s3_spot, s3_vol, s3_T)
            ]

            results = []

            with st.spinner("Running scenarios..."):
                for name, spot_m, vol, maturity in scenarios:
                    S_scenario = live_params['S0'] * spot_m
                    pricer_scenario = AmericanOptionPricer(
                        S0=S_scenario, K=K, T=maturity, r=r, sigma=vol, N=50
                    )
                    value = pricer_scenario.price()
                    greeks_s = pricer_scenario.compute_greeks()

                    results.append({
                        'Scenario': name,
                        'Spot': S_scenario,
                        'Volatility': vol,
                        'Maturity': maturity,
                        'Option Value': value,
                        'Delta': greeks_s['delta'],
                        'Gamma': greeks_s['gamma'],
                        'Vega': greeks_s['vega']
                    })

            # Display comparison table
            comparison_df = pd.DataFrame(results)
            st.dataframe(comparison_df.style.format({
                'Spot': '${:.4f}',
                'Volatility': '{:.2%}',
                'Maturity': '{:.2f}',
                'Option Value': '${:.4f}',
                'Delta': '{:.4f}',
                'Gamma': '{:.4f}',
                'Vega': '{:.4f}'
            }))

            # Comparison charts
            col1, col2 = st.columns(2)

            with col1:
                fig, ax = plt.subplots(figsize=(8, 6))
                scenarios_names = [r['Scenario'] for r in results]
                values = [r['Option Value'] for r in results]
                ax.bar(scenarios_names, values, color=['blue', 'red', 'green'], alpha=0.7)
                ax.set_ylabel('Option Value')
                ax.set_title('Option Value Across Scenarios')
                ax.grid(True, alpha=0.3)
                st.pyplot(fig)
                plt.close()

            with col2:
                fig, ax = plt.subplots(figsize=(8, 6))
                deltas = [r['Delta'] for r in results]
                ax.bar(scenarios_names, deltas, color=['blue', 'red', 'green'], alpha=0.7)
                ax.set_ylabel('Delta')
                ax.set_title('Delta Across Scenarios')
                ax.grid(True, alpha=0.3)
                st.pyplot(fig)
                plt.close()

            # Export comparison
            csv_comp = comparison_df.to_csv(index=False)
            st.download_button(
                label="📥 Download Comparison (CSV)",
                data=csv_comp,
                file_name=f"scenario_comparison_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
                mime="text/csv"
            )

    # Footer
    st.markdown("---")
    st.caption("Enhanced Edition | Monte Carlo | Implied Vol | Scenario Analysis | Export Tools")
    st.caption(f"Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")


if __name__ == "__main__":
    main()
