"""
SolarPunkCoin - Web Dashboard
==============================

Real-time blockchain monitoring and control interface.

Run with: streamlit run dashboard.py
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import streamlit as st
import pandas as pd
import time
from decimal import Decimal

from node.spk_node import SPKNode
from oracle.energy_oracle import EnergyProof, GridOperator, EnergySource

# Page config
st.set_page_config(
    page_title="SolarPunkCoin Dashboard",
    page_icon="🌱",
    layout="wide"
)

# Custom CSS
st.markdown("""
<style>
.big-metric {
    font-size: 2rem;
    font-weight: bold;
    color: #1f77b4;
}
.green-text {
    color: #2ca02c;
}
.red-text {
    color: #d62728;
}
</style>
""", unsafe_allow_html=True)

# Initialize node in session state
if 'node' not in st.session_state:
    st.session_state.node = SPKNode(
        node_id="dashboard_node",
        is_validator=True,
        validator_stake=Decimal('1000')
    )

node = st.session_state.node

# Header
st.markdown("<h1 style='text-align: center; color: #2ca02c;'>🌱 SolarPunkCoin Dashboard</h1>", unsafe_allow_html=True)
st.markdown("<p style='text-align: center;'>Renewable Energy-Backed Cryptocurrency • Real-Time Monitoring</p>", unsafe_allow_html=True)
st.markdown("---")

# Create tabs
tab1, tab2, tab3, tab4, tab5 = st.tabs([
    "📊 Overview",
    "⛓️ Blockchain",
    "⚡ Energy Oracle",
    "⚖️ Peg Stability",
    "🏆 Validators"
])

# ============================================================================
# TAB 1: OVERVIEW
# ============================================================================

with tab1:
    stats = node.get_full_stats()

    # Top metrics
    col1, col2, col3, col4 = st.columns(4)

    with col1:
        st.metric(
            "Total Supply",
            f"{stats['blockchain']['total_supply']} SPK",
            help="Total SPK tokens in circulation"
        )

    with col2:
        st.metric(
            "Energy Reserve",
            f"{stats['blockchain']['energy_reserve_kwh']} kWh",
            help="Total renewable energy backing"
        )

    with col3:
        st.metric(
            "Block Height",
            stats['blockchain']['height'],
            help="Current blockchain height"
        )

    with col4:
        peg = stats['blockchain']['current_peg_price']
        st.metric(
            "Peg Price",
            f"${peg}/kWh",
            help="Target SPK peg price"
        )

    st.markdown("---")

    # Blockchain info
    col1, col2 = st.columns(2)

    with col1:
        st.subheader("📊 Blockchain Statistics")

        blockchain_df = pd.DataFrame([
            {"Metric": "Total Supply", "Value": f"{stats['blockchain']['total_supply']} SPK"},
            {"Metric": "Energy Reserve", "Value": f"{stats['blockchain']['energy_reserve_kwh']} kWh"},
            {"Metric": "UTXOs", "Value": stats['blockchain']['utxo_count']},
            {"Metric": "Validators", "Value": stats['blockchain']['validators']},
            {"Metric": "Total Staked", "Value": f"{stats['blockchain']['total_staked']} SPK"}
        ])

        st.dataframe(blockchain_df, hide_index=True, use_container_width=True)

    with col2:
        st.subheader("🔋 Energy Oracle")

        oracle_df = pd.DataFrame([
            {"Metric": "Proofs Verified", "Value": stats['oracle']['total_proofs_verified']},
            {"Metric": "Energy Processed", "Value": f"{stats['oracle']['total_energy_kwh']} kWh"},
            {"Metric": "SPK Minted", "Value": f"{stats['oracle']['total_spk_minted']} SPK"},
            {"Metric": "Trusted Meters", "Value": stats['oracle']['trusted_meters']},
            {"Metric": "Grid Operators", "Value": stats['oracle']['trusted_operators']}
        ])

        st.dataframe(oracle_df, hide_index=True, use_container_width=True)

    # Node info
    st.markdown("---")
    st.subheader("🖥️ Node Information")

    node_info = stats['node']
    col1, col2, col3 = st.columns(3)

    with col1:
        st.info(f"**Node ID:** {node_info['node_id']}")
    with col2:
        st.info(f"**Address:** {node_info['address'][:20]}...")
    with col3:
        status = "🟢 Validator" if node_info['is_validator'] else "⚪ Full Node"
        st.info(f"**Status:** {status}")

# ============================================================================
# TAB 2: BLOCKCHAIN
# ============================================================================

with tab2:
    st.header("⛓️ Blockchain Explorer")

    # Latest blocks
    st.subheader("Recent Blocks")

    blocks = []
    for i in range(min(5, len(node.blockchain.chain))):
        block = node.blockchain.chain[-(i+1)]
        blocks.append({
            "Height": block.height,
            "Hash": block.block_hash[:16] + "...",
            "Transactions": len(block.transactions),
            "Validator": block.header.validator[:16] + "...",
            "Timestamp": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(block.header.timestamp))
        })

    if blocks:
        blocks_df = pd.DataFrame(blocks)
        st.dataframe(blocks_df, hide_index=True, use_container_width=True)
    else:
        st.info("No blocks yet")

    st.markdown("---")

    # Mempool
    st.subheader("📝 Mempool")
    st.write(f"**Pending Transactions:** {len(node.mempool)}")

    if node.mempool:
        mempool_txs = []
        for tx in node.mempool[:10]:
            mempool_txs.append({
                "TX ID": tx.tx_id[:16] + "...",
                "Type": tx.tx_type,
                "Outputs": len(tx.outputs),
                "Time": time.strftime("%H:%M:%S", time.localtime(tx.timestamp))
            })

        mempool_df = pd.DataFrame(mempool_txs)
        st.dataframe(mempool_df, hide_index=True, use_container_width=True)
    else:
        st.info("Mempool empty")

# ============================================================================
# TAB 3: ENERGY ORACLE
# ============================================================================

with tab3:
    st.header("⚡ Energy Oracle - Mint SPK")

    st.write("""
    Submit renewable energy surplus proof to mint new SPK tokens.

    **Requirements:**
    - Verified surplus renewable energy (solar, wind, etc.)
    - Smart meter cryptographic signature
    - Grid operator certification
    - Grid load < 95% (Rule E: Grid-Stress Safeguard)
    """)

    st.markdown("---")

    # Energy proof form
    st.subheader("🌞 Submit Energy Proof")

    with st.form("energy_proof_form"):
        col1, col2 = st.columns(2)

        with col1:
            surplus_kwh = st.number_input(
                "Surplus Energy (kWh)",
                min_value=100.0,
                max_value=100000.0,
                value=1500.0,
                step=100.0,
                help="Curtailed renewable energy"
            )

            wholesale_price = st.number_input(
                "Wholesale Price ($/kWh)",
                min_value=0.01,
                max_value=1.0,
                value=0.08,
                step=0.01,
                format="%.2f"
            )

            grid_load = st.slider(
                "Grid Load (%)",
                min_value=0,
                max_value=100,
                value=70,
                help="Current grid capacity utilization"
            )

        with col2:
            grid_operator = st.selectbox(
                "Grid Operator",
                ["TAIPOWER", "CAISO", "ERCOT", "PJM"]
            )

            energy_source = st.selectbox(
                "Energy Source",
                ["SOLAR", "WIND", "HYDRO", "GEOTHERMAL"]
            )

            location = st.text_input(
                "Location",
                value="Yuan Ze University, Taiwan"
            )

        recipient = st.text_input(
            "Recipient Address",
            value=node.wallet.address,
            help="Address to receive minted SPK"
        )

        submitted = st.form_submit_button("🚀 Submit Proof & Mint SPK")

        if submitted:
            # Create energy proof
            proof = EnergyProof(
                proof_id=f"proof_{int(time.time())}",
                timestamp=time.time(),
                grid_operator=GridOperator[grid_operator],
                location=location,
                source_type=EnergySource[energy_source],
                surplus_kwh=Decimal(str(surplus_kwh)),
                wholesale_price=Decimal(str(wholesale_price)),
                grid_load=Decimal(str(grid_load / 100)),
                renewable_penetration=Decimal('0.35'),
                meter_signature="demo_signature_" + "a1b2c3" * 10,
                meter_id="METER_YZU_SOLAR_001",
                operator_cert_hash="taipower_cert_hash_67890"
            )

            # Process minting
            with st.spinner("Processing energy proof..."):
                success, tx, msg = node.process_energy_proof(proof, recipient)

            if success:
                st.success(f"✅ {msg}")
                st.balloons()

                # Show transaction details
                if tx:
                    st.write("**Transaction Details:**")
                    st.code(f"TX ID: {tx.tx_id}\nType: {tx.tx_type}\nAmount: {tx.outputs[0].amount} SPK")
            else:
                st.error(f"❌ {msg}")

    st.markdown("---")

    # Oracle stats
    st.subheader("📊 Oracle Statistics")
    oracle_stats = node.oracle.get_oracle_stats()

    oracle_metrics = pd.DataFrame([
        {"Metric": k.replace('_', ' ').title(), "Value": v}
        for k, v in oracle_stats.items()
    ])

    st.dataframe(oracle_metrics, hide_index=True, use_container_width=True)

# ============================================================================
# TAB 4: PEG STABILITY
# ============================================================================

with tab4:
    st.header("⚖️ Peg Stability Mechanism")

    st.write("""
    **Rule D: Peg Stability Band**

    SPK maintains price stability within ±5% of target using algorithmic mint/burn operations.

    - **Target:** $0.10/kWh (base) + wholesale price adjustments
    - **Band:** ±5% (upper: $0.105, lower: $0.095)
    - **Action:** Mint if price too high, burn if too low
    """)

    st.markdown("---")

    # Peg check form
    st.subheader("🎯 Check Peg Status")

    with st.form("peg_check_form"):
        col1, col2 = st.columns(2)

        with col1:
            spk_market_price = st.number_input(
                "SPK Market Price ($)",
                min_value=0.01,
                max_value=1.0,
                value=0.105,
                step=0.001,
                format="%.3f",
                help="Current SPK trading price"
            )

        with col2:
            wholesale_price_peg = st.number_input(
                "Wholesale Energy Price ($/kWh)",
                min_value=0.01,
                max_value=1.0,
                value=0.08,
                step=0.01,
                format="%.2f"
            )

        check_peg = st.form_submit_button("⚖️ Check Peg Stability")

        if check_peg:
            with st.spinner("Analyzing peg..."):
                needs_action, action, amount = node.check_peg_stability(
                    spk_market_price=Decimal(str(spk_market_price)),
                    wholesale_price=Decimal(str(wholesale_price_peg))
                )

            target = node.peg_controller.compute_target_price(
                Decimal(str(wholesale_price_peg))
            )
            lower, upper = node.peg_controller.params.get_peg_band(target)

            # Show target band
            st.write(f"**Target Price:** ${target}")
            st.write(f"**Stability Band:** ${lower} - ${upper}")

            if needs_action:
                if action == 'mint':
                    st.warning(f"⚠️ **Price above band!** Need to MINT {amount:.2f} SPK")
                else:
                    st.warning(f"⚠️ **Price below band!** Need to BURN {amount:.2f} SPK")
            else:
                st.success("✅ **Peg stable!** Price within target band")

    st.markdown("---")

    # Peg stability stats
    st.subheader("📊 Stability Statistics")
    peg_stats = node.peg_controller.get_stability_stats()

    peg_metrics = pd.DataFrame([
        {"Metric": k.replace('_', ' ').title(), "Value": v}
        for k, v in peg_stats.items()
    ])

    st.dataframe(peg_metrics, hide_index=True, use_container_width=True)

# ============================================================================
# TAB 5: VALIDATORS
# ============================================================================

with tab5:
    st.header("🏆 Proof-of-Stake Validators")

    st.write("""
    **Rule F: Environmental Footprint Cap**

    SPK uses Proof-of-Stake with green energy certification:
    - 🌱 Green-certified validators get 2x selection weight
    - 💰 Stake-weighted selection
    - ⭐ Reputation system (0-100)
    - ⚠️ Slashing for misbehavior (10% penalty)
    """)

    st.markdown("---")

    # Validator list
    st.subheader("👥 Active Validators")

    validators = node.pos.get_all_validators()

    if validators:
        validators_df = pd.DataFrame(validators)

        # Format for display
        validators_df['address'] = validators_df['address'].str[:16] + "..."
        validators_df['green'] = validators_df['green_certified'].map({True: "🌱", False: "⚡"})
        validators_df['status'] = validators_df['is_active'].map({True: "🟢 Active", False: "🔴 Inactive"})

        display_df = validators_df[[
            'address', 'stake', 'green', 'status', 'reputation',
            'blocks_proposed', 'blocks_validated'
        ]]

        display_df.columns = [
            'Address', 'Stake (SPK)', 'Green', 'Status', 'Reputation',
            'Blocks Proposed', 'Blocks Validated'
        ]

        st.dataframe(display_df, hide_index=True, use_container_width=True)
    else:
        st.info("No validators registered")

    st.markdown("---")

    # Consensus stats
    st.subheader("📊 Consensus Statistics")

    consensus_stats = node.pos.get_consensus_stats()

    col1, col2, col3 = st.columns(3)

    with col1:
        st.metric(
            "Total Validators",
            consensus_stats['total_validators']
        )

    with col2:
        st.metric(
            "Active Validators",
            consensus_stats['active_validators']
        )

    with col3:
        green_pct = consensus_stats['green_stake_percentage']
        st.metric(
            "Green Stake",
            f"{green_pct:.1f}%",
            delta="🌱" if green_pct > 50 else "⚡"
        )

# Footer
st.markdown("---")
st.markdown("""
<div style='text-align: center; color: #666;'>
    <p>SolarPunkCoin Dashboard | Built with Streamlit | 🌱 Renewable Energy-Backed Cryptocurrency</p>
</div>
""", unsafe_allow_html=True)
