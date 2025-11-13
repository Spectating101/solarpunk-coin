"""
Professional Visualizations
===========================

Publication-quality charts for derivative pricing analysis.
"""

import numpy as np
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
from matplotlib import cm
from mpl_toolkits.mplot3d import Axes3D
import seaborn as sns

# Set professional style
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (12, 8)
plt.rcParams['font.size'] = 10
plt.rcParams['axes.labelsize'] = 11
plt.rcParams['axes.titlesize'] = 12
plt.rcParams['xtick.labelsize'] = 9
plt.rcParams['ytick.labelsize'] = 9


class ProfessionalVisualizer:
    """Create publication-quality visualizations."""

    @staticmethod
    def plot_option_value_surface(pricer_class, S0, K, T, r, sigma_range=(0.2, 0.8), S_range=None):
        """
        3D surface plot of option value vs spot price and volatility.

        Parameters:
        -----------
        pricer_class : class
            AmericanOptionPricer class
        S0, K, T, r : float
            Base parameters
        sigma_range : tuple
            (min_sigma, max_sigma)
        S_range : tuple, optional
            (min_S, max_S), defaults to (0.5*S0, 1.5*S0)
        """
        if S_range is None:
            S_range = (0.5 * S0, 1.5 * S0)

        # Create meshgrid
        S_values = np.linspace(S_range[0], S_range[1], 30)
        sigma_values = np.linspace(sigma_range[0], sigma_range[1], 30)
        S_mesh, sigma_mesh = np.meshgrid(S_values, sigma_values)

        # Compute option values
        V_mesh = np.zeros_like(S_mesh)
        for i in range(len(sigma_values)):
            for j in range(len(S_values)):
                pricer = pricer_class(S_mesh[i,j], K, T, r, sigma_mesh[i,j], N=50)
                V_mesh[i,j] = pricer.price()

        # Create 3D plot
        fig = plt.figure(figsize=(14, 10))
        ax = fig.add_subplot(111, projection='3d')

        surf = ax.plot_surface(S_mesh, sigma_mesh, V_mesh, cmap=cm.viridis,
                              linewidth=0, antialiased=True, alpha=0.9)

        ax.set_xlabel('Spot Price (S)', fontsize=11, labelpad=10)
        ax.set_ylabel('Volatility (σ)', fontsize=11, labelpad=10)
        ax.set_zlabel('Option Value', fontsize=11, labelpad=10)
        ax.set_title('American Call Option Value Surface', fontsize=13, fontweight='bold', pad=20)

        # Add colorbar
        fig.colorbar(surf, shrink=0.5, aspect=5, pad=0.1)

        # Rotate view for better perspective
        ax.view_init(elev=20, azim=45)

        plt.tight_layout()
        return fig

    @staticmethod
    def plot_comprehensive_analysis(pricer, greeks, boundary):
        """
        Comprehensive multi-panel analysis figure.

        Creates 6 subplots showing different aspects of the option.
        """
        fig = plt.figure(figsize=(16, 10))
        gs = gridspec.GridSpec(3, 3, figure=fig, hspace=0.3, wspace=0.3)

        # 1. Option Value vs Spot (top left)
        ax1 = fig.add_subplot(gs[0, 0])
        S_range = np.linspace(pricer.S0 * 0.5, pricer.S0 * 1.5, 50)
        V_values = []
        for S in S_range:
            p = pricer.__class__(S, pricer.K, pricer.T, pricer.r, pricer.sigma, N=50)
            V_values.append(p.price())

        ax1.plot(S_range, V_values, 'b-', linewidth=2, label='Option Value')
        ax1.axvline(pricer.S0, color='r', linestyle='--', alpha=0.5, label='Current S₀')
        ax1.set_xlabel('Spot Price')
        ax1.set_ylabel('Option Value')
        ax1.set_title('Option Value vs Spot Price', fontweight='bold')
        ax1.legend()
        ax1.grid(True, alpha=0.3)

        # 2. Greeks Bar Chart (top middle)
        ax2 = fig.add_subplot(gs[0, 1])
        greek_names = list(greeks.keys())
        greek_values = list(greeks.values())
        colors = ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D', '#6A994E']

        bars = ax2.bar(greek_names, greek_values, color=colors, alpha=0.8, edgecolor='black')
        ax2.set_ylabel('Value')
        ax2.set_title('Option Greeks', fontweight='bold')
        ax2.grid(True, alpha=0.3, axis='y')

        # Add value labels on bars
        for bar in bars:
            height = bar.get_height()
            ax2.text(bar.get_x() + bar.get_width()/2., height,
                    f'{height:.3f}', ha='center', va='bottom', fontsize=9)

        # 3. Exercise Boundary (top right)
        ax3 = fig.add_subplot(gs[0, 2])
        time_steps = np.linspace(0, pricer.T, len(boundary))
        valid_boundary = boundary[~np.isnan(boundary)]
        valid_times = time_steps[~np.isnan(boundary)]

        if len(valid_boundary) > 0:
            ax3.plot(valid_times, valid_boundary, 'r-', linewidth=2, marker='o', markersize=4)
            ax3.axhline(pricer.S0, color='b', linestyle='--', alpha=0.5, label='Current S₀')
            ax3.fill_between(valid_times, valid_boundary, pricer.S0*1.5,
                           alpha=0.2, color='green', label='Exercise Region')

        ax3.set_xlabel('Time to Maturity')
        ax3.set_ylabel('Critical Price')
        ax3.set_title('Optimal Exercise Boundary', fontweight='bold')
        ax3.legend()
        ax3.grid(True, alpha=0.3)

        # 4. Delta vs Spot (middle left)
        ax4 = fig.add_subplot(gs[1, 0])
        delta_values = []
        for S in S_range:
            p = pricer.__class__(S, pricer.K, pricer.T, pricer.r, pricer.sigma, N=50)
            g = p.compute_greeks()
            delta_values.append(g['delta'])

        ax4.plot(S_range, delta_values, 'g-', linewidth=2)
        ax4.axvline(pricer.S0, color='r', linestyle='--', alpha=0.5)
        ax4.axhline(0.5, color='gray', linestyle=':', alpha=0.5)
        ax4.set_xlabel('Spot Price')
        ax4.set_ylabel('Delta')
        ax4.set_title('Delta vs Spot Price', fontweight='bold')
        ax4.grid(True, alpha=0.3)

        # 5. Vega vs Spot (middle middle)
        ax5 = fig.add_subplot(gs[1, 1])
        vega_values = []
        for S in S_range:
            p = pricer.__class__(S, pricer.K, pricer.T, pricer.r, pricer.sigma, N=50)
            g = p.compute_greeks()
            vega_values.append(g['vega'])

        ax5.plot(S_range, vega_values, 'orange', linewidth=2)
        ax5.axvline(pricer.S0, color='r', linestyle='--', alpha=0.5)
        ax5.set_xlabel('Spot Price')
        ax5.set_ylabel('Vega')
        ax5.set_title('Vega vs Spot Price', fontweight='bold')
        ax5.grid(True, alpha=0.3)

        # 6. Convergence Analysis (middle right)
        ax6 = fig.add_subplot(gs[1, 2])
        N_values = [10, 20, 30, 50, 75, 100, 150, 200]
        prices = []
        for N in N_values:
            p = pricer.__class__(pricer.S0, pricer.K, pricer.T, pricer.r, pricer.sigma, N=N)
            prices.append(p.price())

        ax6.plot(N_values, prices, 'b-o', linewidth=2, markersize=6)
        ax6.axhline(prices[-1], color='r', linestyle='--', alpha=0.5, label='Converged')
        ax6.set_xlabel('Number of Steps (N)')
        ax6.set_ylabel('Option Price')
        ax6.set_title('Binomial Tree Convergence', fontweight='bold')
        ax6.legend()
        ax6.grid(True, alpha=0.3)

        # 7. Time Decay (bottom left)
        ax7 = fig.add_subplot(gs[2, 0])
        T_range = np.linspace(0.1, pricer.T, 30)
        theta_implied = []
        for T_val in T_range:
            p = pricer.__class__(pricer.S0, pricer.K, T_val, pricer.r, pricer.sigma, N=50)
            theta_implied.append(p.price())

        ax7.plot(T_range, theta_implied, 'purple', linewidth=2)
        ax7.set_xlabel('Time to Maturity')
        ax7.set_ylabel('Option Value')
        ax7.set_title('Time Decay (Theta Effect)', fontweight='bold')
        ax7.grid(True, alpha=0.3)

        # 8. Volatility Sensitivity (bottom middle)
        ax8 = fig.add_subplot(gs[2, 1])
        sigma_range_plot = np.linspace(0.2, 0.8, 30)
        prices_vol = []
        for sig in sigma_range_plot:
            p = pricer.__class__(pricer.S0, pricer.K, pricer.T, pricer.r, sig, N=50)
            prices_vol.append(p.price())

        ax8.plot(sigma_range_plot, prices_vol, 'red', linewidth=2)
        ax8.axvline(pricer.sigma, color='b', linestyle='--', alpha=0.5, label='Current σ')
        ax8.set_xlabel('Volatility (σ)')
        ax8.set_ylabel('Option Value')
        ax8.set_title('Volatility Sensitivity (Vega)', fontweight='bold')
        ax8.legend()
        ax8.grid(True, alpha=0.3)

        # 9. Summary Statistics (bottom right)
        ax9 = fig.add_subplot(gs[2, 2])
        ax9.axis('off')

        summary_text = f"""
        OPTION PARAMETERS
        ─────────────────
        Spot Price (S₀):    ${pricer.S0:.4f}
        Strike (K):         ${pricer.K:.4f}
        Maturity (T):       {pricer.T:.2f} years
        Volatility (σ):     {pricer.sigma:.1%}
        Risk-free (r):      {pricer.r:.1%}

        RESULTS
        ─────────────────
        Option Value:       ${pricer.price():.4f}
        Delta:              {greeks['delta']:.4f}
        Gamma:              {greeks['gamma']:.4f}
        Vega:               {greeks['vega']:.4f}
        Theta:              {greeks['theta']:.4f}
        Rho:                {greeks['rho']:.4f}
        """

        ax9.text(0.1, 0.5, summary_text, fontsize=10, family='monospace',
                verticalalignment='center')

        plt.suptitle('Comprehensive American Option Analysis', fontsize=16,
                    fontweight='bold', y=0.98)

        return fig

    @staticmethod
    def plot_greeks_heatmap(pricer_class, S0, K, T, r, base_sigma):
        """
        Heatmap showing Greeks across spot and volatility ranges.
        """
        S_range = np.linspace(S0*0.7, S0*1.3, 20)
        sigma_range = np.linspace(base_sigma*0.5, base_sigma*1.5, 20)

        fig, axes = plt.subplots(2, 3, figsize=(16, 10))
        axes = axes.flatten()

        greek_names = ['delta', 'gamma', 'vega', 'theta', 'rho']

        for idx, greek_name in enumerate(greek_names):
            greek_matrix = np.zeros((len(sigma_range), len(S_range)))

            for i, sig in enumerate(sigma_range):
                for j, S in enumerate(S_range):
                    p = pricer_class(S, K, T, r, sig, N=50)
                    g = p.compute_greeks()
                    greek_matrix[i, j] = g[greek_name]

            im = axes[idx].imshow(greek_matrix, cmap='RdYlGn', aspect='auto',
                                 extent=[S_range[0], S_range[-1], sigma_range[0], sigma_range[-1]],
                                 origin='lower')

            axes[idx].set_xlabel('Spot Price')
            axes[idx].set_ylabel('Volatility')
            axes[idx].set_title(f'{greek_name.capitalize()} Heatmap', fontweight='bold')

            plt.colorbar(im, ax=axes[idx])

        axes[5].axis('off')

        plt.suptitle('Greeks Sensitivity Heatmaps', fontsize=16, fontweight='bold')
        plt.tight_layout()

        return fig


# Test
if __name__ == "__main__":
    print("Visualization module loaded successfully!")
    print("Use ProfessionalVisualizer class to create charts.")
