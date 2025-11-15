"""
Market Sizing Study for SolarPunkCoin
======================================

Quantifies total addressable market (TAM) for SPK:
- Global renewable energy surplus
- Bitcoin mining energy market
- Cryptocurrency market sizing
- Addressable use cases
- Revenue projections
- Competitive analysis

For publication / investor materials
"""

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from typing import Dict, List
from dataclasses import dataclass


@dataclass
class MarketSegment:
    """Market segment specification."""

    segment_name: str
    description: str
    tam_billion_usd: float         # Total addressable market
    sam_billion_usd: float         # Serviceable addressable market
    som_billion_usd: float         # Serviceable obtainable market
    penetration_rate: float        # Expected penetration rate
    annual_growth_rate: float      # CAGR


class MarketSizingAnalysis:
    """Comprehensive market sizing for SolarPunkCoin."""

    def __init__(self):
        self.segments: List[MarketSegment] = []
        self._define_market_segments()

    def _define_market_segments(self):
        """Define all market segments."""

        # Segment 1: Renewable Energy Surplus Monetization
        # Global renewable capacity: 3,500 GW (2024)
        # Average surplus: 15% of production
        # Value: $0.08/kWh
        renewable_capacity_gw = 3500
        capacity_factor = 0.25  # 25% average (solar/wind intermittency)
        surplus_rate = 0.15     # 15% of production is surplus
        annual_production_twh = renewable_capacity_gw * 8760 * capacity_factor / 1000
        annual_surplus_twh = annual_production_twh * surplus_rate
        tam_renewable = annual_surplus_twh * 1e9 * 0.08 / 1e9  # Billion USD

        self.segments.append(MarketSegment(
            segment_name="Renewable Surplus Monetization",
            description="Monetizing curtailed/surplus renewable energy",
            tam_billion_usd=tam_renewable,
            sam_billion_usd=tam_renewable * 0.30,  # 30% addressable (grid-connected)
            som_billion_usd=tam_renewable * 0.05,   # 5% obtainable (first 5 years)
            penetration_rate=0.05,
            annual_growth_rate=0.25  # 25% CAGR
        ))

        # Segment 2: Bitcoin Mining Energy Hedging
        # Bitcoin annual energy: 150 TWh
        # Cost: $0.08/kWh average
        # Hedging market: 20% of miners hedge energy costs
        btc_energy_twh = 150
        btc_energy_cost_billion = btc_energy_twh * 1e9 * 0.08 / 1e9
        hedge_market_pct = 0.20

        self.segments.append(MarketSegment(
            segment_name="Crypto Mining Energy Hedging",
            description="Energy cost hedging for Bitcoin/crypto miners",
            tam_billion_usd=btc_energy_cost_billion,
            sam_billion_usd=btc_energy_cost_billion * hedge_market_pct,
            som_billion_usd=btc_energy_cost_billion * 0.03,  # 3% obtainable
            penetration_rate=0.03,
            annual_growth_rate=0.15  # 15% CAGR
        ))

        # Segment 3: Green Cryptocurrency Alternative
        # Crypto market cap: $2.5T (2024)
        # Green/sustainable focus: 5% of market
        crypto_market_cap_trillion = 2.5
        green_focus_pct = 0.05
        tam_green_crypto = crypto_market_cap_trillion * green_focus_pct * 1000  # Billion

        self.segments.append(MarketSegment(
            segment_name="Green Cryptocurrency Market",
            description="ESG-focused crypto investors seeking sustainable alternatives",
            tam_billion_usd=tam_green_crypto,
            sam_billion_usd=tam_green_crypto * 0.20,  # 20% serviceable
            som_billion_usd=tam_green_crypto * 0.01,   # 1% obtainable
            penetration_rate=0.01,
            annual_growth_rate=0.40  # 40% CAGR (high growth in ESG)
        ))

        # Segment 4: Energy-Backed Stablecoins
        # Stablecoin market: $150B (2024)
        # Energy-backed niche: 10%
        stablecoin_market_billion = 150
        energy_backed_pct = 0.10

        self.segments.append(MarketSegment(
            segment_name="Energy-Backed Stablecoins",
            description="Alternative to fiat-backed stablecoins (USDC, USDT)",
            tam_billion_usd=stablecoin_market_billion,
            sam_billion_usd=stablecoin_market_billion * energy_backed_pct,
            som_billion_usd=stablecoin_market_billion * 0.02,  # 2% obtainable
            penetration_rate=0.02,
            annual_growth_rate=0.30  # 30% CAGR
        ))

        # Segment 5: Grid Services / Demand Response
        # Global demand response market: $20B (2024)
        # Crypto-enabled: 15%
        dr_market_billion = 20
        crypto_enabled_pct = 0.15

        self.segments.append(MarketSegment(
            segment_name="Grid Services / Demand Response",
            description="Crypto-enabled demand response and grid balancing",
            tam_billion_usd=dr_market_billion,
            sam_billion_usd=dr_market_billion * crypto_enabled_pct,
            som_billion_usd=dr_market_billion * 0.02,  # 2% obtainable
            penetration_rate=0.02,
            annual_growth_rate=0.20  # 20% CAGR
        ))

    def compute_aggregate_market(self) -> Dict:
        """Compute aggregate market size across all segments."""

        total_tam = sum(s.tam_billion_usd for s in self.segments)
        total_sam = sum(s.sam_billion_usd for s in self.segments)
        total_som = sum(s.som_billion_usd for s in self.segments)

        weighted_growth = sum(
            s.annual_growth_rate * s.som_billion_usd for s in self.segments
        ) / total_som

        return {
            'total_tam_billion': total_tam,
            'total_sam_billion': total_sam,
            'total_som_billion': total_som,
            'weighted_cagr': weighted_growth,
            'num_segments': len(self.segments)
        }

    def project_revenue(self, years: int = 5) -> pd.DataFrame:
        """Project revenue over time."""

        revenue_data = []

        for year in range(years + 1):
            year_data = {'year': year}

            for segment in self.segments:
                # Revenue = SOM × penetration × (1 + growth)^year
                base_revenue = segment.som_billion_usd * segment.penetration_rate
                year_revenue = base_revenue * (1 + segment.annual_growth_rate) ** year

                year_data[segment.segment_name] = year_revenue

            # Total revenue
            year_data['total_revenue'] = sum(
                year_data[s.segment_name] for s in self.segments
            )

            revenue_data.append(year_data)

        return pd.DataFrame(revenue_data)

    def competitive_analysis(self) -> Dict:
        """Analyze competitive landscape."""

        competitors = {
            'Bitcoin': {
                'market_cap_billion': 800,
                'focus': 'Store of value',
                'energy_profile': 'High (150 TWh/year)',
                'sustainability': 'Poor',
                'spk_advantage': 'SPK is carbon negative vs BTC carbon intensive'
            },
            'Ethereum': {
                'market_cap_billion': 400,
                'focus': 'Smart contracts platform',
                'energy_profile': 'Low (0.01 TWh/year, PoS)',
                'sustainability': 'Good (post-Merge)',
                'spk_advantage': 'SPK has energy backing, ETH does not'
            },
            'Cardano': {
                'market_cap_billion': 30,
                'focus': 'Green smart contracts',
                'energy_profile': 'Very Low (0.006 TWh/year)',
                'sustainability': 'Excellent',
                'spk_advantage': 'SPK incentivizes real renewable energy, Cardano just low consumption'
            },
            'Chia': {
                'market_cap_billion': 0.5,
                'focus': 'Green mining (proof-of-space)',
                'energy_profile': 'Low',
                'sustainability': 'Good',
                'spk_advantage': 'SPK has real-world utility (energy monetization), Chia is just green PoW alternative'
            },
            'Power Ledger': {
                'market_cap_billion': 0.1,
                'focus': 'Energy trading platform',
                'energy_profile': 'Low',
                'sustainability': 'Excellent',
                'spk_advantage': 'SPK is full cryptocurrency with energy backing, PowerLedger is just trading platform'
            }
        }

        return competitors

    def use_case_analysis(self) -> List[Dict]:
        """Analyze specific use cases."""

        use_cases = [
            {
                'use_case': 'Bitcoin Miner Energy Hedge',
                'description': 'Miner hedges energy costs using SPK call options',
                'user_type': 'Bitcoin miner',
                'annual_value_usd': 50000,  # Per miner
                'potential_users': 100000,   # Global miners
                'total_market_million': 5000
            },
            {
                'use_case': 'Solar Farm Surplus Monetization',
                'description': 'Solar farm sells surplus energy for SPK tokens',
                'user_type': 'Renewable producer',
                'annual_value_usd': 200000,  # Per farm
                'potential_users': 50000,     # Global solar farms
                'total_market_million': 10000
            },
            {
                'use_case': 'ESG Portfolio Allocation',
                'description': 'Institutional investor adds SPK for ESG exposure',
                'user_type': 'Institutional investor',
                'annual_value_usd': 10000000,  # Per fund
                'potential_users': 1000,        # ESG funds
                'total_market_million': 10000
            },
            {
                'use_case': 'Energy Payment Network',
                'description': 'Consumers pay for electricity with SPK',
                'user_type': 'Consumer',
                'annual_value_usd': 1200,     # Per household
                'potential_users': 10000000,  # 10M households
                'total_market_million': 12000
            },
            {
                'use_case': 'Grid Demand Response',
                'description': 'Grid operator uses SPK pricing for demand signals',
                'user_type': 'Grid operator',
                'annual_value_usd': 5000000,  # Per operator
                'potential_users': 500,        # Global operators
                'total_market_million': 2500
            }
        ]

        return use_cases

    def geographic_analysis(self) -> Dict:
        """Analyze geographic opportunity."""

        regions = {
            'North America': {
                'renewable_capacity_gw': 700,
                'crypto_adoption': 'High',
                'regulatory_environment': 'Medium (varies by state)',
                'market_potential_billion': 15,
                'priority': 'High'
            },
            'Europe': {
                'renewable_capacity_gw': 800,
                'crypto_adoption': 'Medium-High',
                'regulatory_environment': 'Strict but clear (MiCA)',
                'market_potential_billion': 20,
                'priority': 'High'
            },
            'Asia-Pacific': {
                'renewable_capacity_gw': 1500,
                'crypto_adoption': 'Very High (esp. China solar)',
                'regulatory_environment': 'Mixed (varies by country)',
                'market_potential_billion': 30,
                'priority': 'Very High'
            },
            'Latin America': {
                'renewable_capacity_gw': 300,
                'crypto_adoption': 'Growing',
                'regulatory_environment': 'Permissive',
                'market_potential_billion': 5,
                'priority': 'Medium'
            },
            'Middle East / Africa': {
                'renewable_capacity_gw': 200,
                'crypto_adoption': 'Low-Medium',
                'regulatory_environment': 'Emerging',
                'market_potential_billion': 3,
                'priority': 'Low-Medium'
            }
        }

        return regions

    def generate_market_report(self) -> str:
        """Generate comprehensive market sizing report."""

        report = []
        report.append("=" * 80)
        report.append("SOLARPUNKCOIN MARKET SIZING ANALYSIS")
        report.append("=" * 80)
        report.append("")

        # Aggregate market
        aggregate = self.compute_aggregate_market()
        report.append("AGGREGATE MARKET SIZE")
        report.append("-" * 80)
        report.append(f"Total Addressable Market (TAM): ${aggregate['total_tam_billion']:.1f} Billion")
        report.append(f"Serviceable Addressable Market (SAM): ${aggregate['total_sam_billion']:.1f} Billion")
        report.append(f"Serviceable Obtainable Market (SOM): ${aggregate['total_som_billion']:.1f} Billion")
        report.append(f"Weighted CAGR: {aggregate['weighted_cagr']:.1%}")
        report.append(f"Number of Segments: {aggregate['num_segments']}")
        report.append("")

        # Segment breakdown
        report.append("=" * 80)
        report.append("MARKET SEGMENT ANALYSIS")
        report.append("-" * 80)

        for segment in self.segments:
            report.append(f"\n{segment.segment_name}")
            report.append(f"  Description: {segment.description}")
            report.append(f"  TAM: ${segment.tam_billion_usd:.1f}B")
            report.append(f"  SAM: ${segment.sam_billion_usd:.1f}B")
            report.append(f"  SOM: ${segment.som_billion_usd:.1f}B")
            report.append(f"  Penetration Rate: {segment.penetration_rate:.1%}")
            report.append(f"  Annual Growth: {segment.annual_growth_rate:.1%}")

        # Revenue projection
        report.append("")
        report.append("=" * 80)
        report.append("5-YEAR REVENUE PROJECTION")
        report.append("-" * 80)

        revenue_df = self.project_revenue(years=5)
        for _, row in revenue_df.iterrows():
            year = int(row['year'])
            total = row['total_revenue']
            report.append(f"Year {year}: ${total:.2f} Billion")

        # Use cases
        report.append("")
        report.append("=" * 80)
        report.append("PRIMARY USE CASES")
        report.append("-" * 80)

        use_cases = self.use_case_analysis()
        for uc in use_cases:
            report.append(f"\n{uc['use_case']}")
            report.append(f"  Description: {uc['description']}")
            report.append(f"  User Type: {uc['user_type']}")
            report.append(f"  Value per User: ${uc['annual_value_usd']:,}/year")
            report.append(f"  Potential Users: {uc['potential_users']:,}")
            report.append(f"  Total Market: ${uc['total_market_million']:,} Million")

        # Geographic
        report.append("")
        report.append("=" * 80)
        report.append("GEOGRAPHIC OPPORTUNITY")
        report.append("-" * 80)

        regions = self.geographic_analysis()
        for region_name, region_data in regions.items():
            report.append(f"\n{region_name}")
            report.append(f"  Renewable Capacity: {region_data['renewable_capacity_gw']} GW")
            report.append(f"  Crypto Adoption: {region_data['crypto_adoption']}")
            report.append(f"  Regulatory: {region_data['regulatory_environment']}")
            report.append(f"  Market Potential: ${region_data['market_potential_billion']}B")
            report.append(f"  Priority: {region_data['priority']}")

        # Competitive analysis
        report.append("")
        report.append("=" * 80)
        report.append("COMPETITIVE LANDSCAPE")
        report.append("-" * 80)

        competitors = self.competitive_analysis()
        for name, comp in competitors.items():
            report.append(f"\n{name}")
            report.append(f"  Market Cap: ${comp['market_cap_billion']}B")
            report.append(f"  Focus: {comp['focus']}")
            report.append(f"  Energy Profile: {comp['energy_profile']}")
            report.append(f"  Sustainability: {comp['sustainability']}")
            report.append(f"  SPK Advantage: {comp['spk_advantage']}")

        # Summary
        report.append("")
        report.append("=" * 80)
        report.append("KEY FINDINGS")
        report.append("=" * 80)

        year5_revenue = revenue_df[revenue_df['year'] == 5]['total_revenue'].iloc[0]

        report.append(f"1. Total addressable market: ${aggregate['total_tam_billion']:.0f}B across 5 segments")
        report.append(f"2. Obtainable market: ${aggregate['total_som_billion']:.1f}B in first 5 years")
        report.append(f"3. Projected Year 5 revenue: ${year5_revenue:.2f}B")
        report.append(f"4. Weighted market CAGR: {aggregate['weighted_cagr']:.0%} (high growth)")
        report.append(f"5. Primary opportunity: Renewable surplus (${self.segments[0].tam_billion_usd:.0f}B TAM)")
        report.append("")
        report.append("CONCLUSION: Substantial market opportunity with strong growth trajectory")
        report.append("=" * 80)

        return "\n".join(report)


def plot_market_sizing():
    """Plot market sizing visualizations."""

    analyzer = MarketSizingAnalysis()

    fig, axes = plt.subplots(2, 2, figsize=(14, 10))
    fig.suptitle('SolarPunkCoin Market Sizing Analysis', fontsize=16, fontweight='bold')

    # Segment TAM
    segments = [s.segment_name for s in analyzer.segments]
    tams = [s.tam_billion_usd for s in analyzer.segments]

    axes[0, 0].barh(segments, tams, color='blue', alpha=0.7)
    axes[0, 0].set_title('Total Addressable Market by Segment')
    axes[0, 0].set_xlabel('TAM ($ Billions)')
    axes[0, 0].grid(True, alpha=0.3, axis='x')

    # TAM/SAM/SOM comparison
    aggregate = analyzer.compute_aggregate_market()
    market_types = ['TAM', 'SAM', 'SOM']
    market_values = [
        aggregate['total_tam_billion'],
        aggregate['total_sam_billion'],
        aggregate['total_som_billion']
    ]

    axes[0, 1].bar(market_types, market_values, color=['blue', 'orange', 'green'], alpha=0.7)
    axes[0, 1].set_title('Market Funnel')
    axes[0, 1].set_ylabel('$ Billions')
    axes[0, 1].grid(True, alpha=0.3, axis='y')

    # Revenue projection
    revenue_df = analyzer.project_revenue(years=5)
    axes[1, 0].plot(revenue_df['year'], revenue_df['total_revenue'],
                    marker='o', linewidth=2, markersize=8, color='green')
    axes[1, 0].set_title('5-Year Revenue Projection')
    axes[1, 0].set_xlabel('Year')
    axes[1, 0].set_ylabel('Revenue ($ Billions)')
    axes[1, 0].grid(True, alpha=0.3)

    # Geographic opportunity
    regions = analyzer.geographic_analysis()
    region_names = list(regions.keys())
    potentials = [regions[r]['market_potential_billion'] for r in region_names]

    axes[1, 1].pie(potentials, labels=region_names, autopct='%1.1f%%',
                   colors=plt.cm.Set3.colors[:len(region_names)])
    axes[1, 1].set_title('Geographic Market Distribution')

    plt.tight_layout()
    return fig


def run_market_sizing():
    """Run complete market sizing analysis."""

    print("Running market sizing analysis...")
    print()

    analyzer = MarketSizingAnalysis()

    # Generate report
    report = analyzer.generate_market_report()
    print(report)

    # Save report
    output_file = "/home/user/solarpunk-coin/solarpunkcoin/MARKET_SIZING.md"
    with open(output_file, 'w') as f:
        f.write(report)
    print(f"\nMarket sizing report saved to: {output_file}")

    # Plot
    fig = plot_market_sizing()
    plt.savefig('/home/user/solarpunk-coin/solarpunkcoin/market_sizing.png',
                dpi=300, bbox_inches='tight')
    print("Market sizing chart saved to: market_sizing.png")

    return analyzer


if __name__ == "__main__":
    analyzer = run_market_sizing()
    plt.show()
