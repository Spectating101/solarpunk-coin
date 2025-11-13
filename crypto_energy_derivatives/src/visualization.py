"""
Visualization Utilities
=======================

Create publication-quality plots for energy derivatives analysis.

Author: Derivative Securities Final Project
Version: 1.0.0
"""

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from typing import Optional, Tuple, Dict
import warnings

# Set style
plt.style.use('seaborn-v0_8-darkgrid' if 'seaborn-v0_8-darkgrid' in plt.style.available else 'default')


class Visualizer:
    """
    Create visualizations for derivative pricing analysis.

    Examples
    --------
    >>> from src.visualization import Visualizer
    >>> viz = Visualizer()
    >>> viz.plot_energy_price_history(dates, prices)
    """

    def __init__(self, figsize: Tuple[int, int] = (10, 6)):
        """Initialize visualizer."""
        self.figsize = figsize

    def plot_energy_price_history(self, dates, prices, title: str = "Energy Unit Price Over Time", save_path: Optional[str] = None):
        """
        Plot energy price time series.

        Parameters
        ----------
        dates : array-like
            Dates
        prices : array-like
            Energy prices
        title : str
            Plot title
        save_path : str, optional
            Path to save figure

        Examples
        --------
        >>> viz = Visualizer()
        >>> viz.plot_energy_price_history(df['Date'], df['Energy_Price'])
        """
        fig, ax = plt.subplots(figsize=self.figsize)

        ax.plot(dates, prices, linewidth=2, color='#2E86AB')
        ax.set_xlabel('Date', fontsize=12)
        ax.set_ylabel('Energy Unit Price', fontsize=12)
        ax.set_title(title, fontsize=14, fontweight='bold')
        ax.grid(True, alpha=0.3)

        plt.tight_layout()

        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
            print(f"Saved to {save_path}")

        plt.show()

    def plot_exercise_boundary(self, boundary, T, title: str = "Optimal Exercise Boundary", save_path: Optional[str] = None):
        """
        Plot optimal exercise boundary for American option.

        Parameters
        ----------
        boundary : array-like
            Exercise boundary values
        T : float
            Time to maturity
        title : str
            Plot title
        save_path : str, optional
            Path to save figure
        """
        fig, ax = plt.subplots(figsize=self.figsize)

        time_steps = np.linspace(0, T, len(boundary))

        ax.plot(time_steps, boundary, linewidth=2, color='#A23B72', label='Exercise Boundary')
        ax.axhline(y=np.nanmean(boundary), color='gray', linestyle='--', alpha=0.5, label='Mean')

        ax.set_xlabel('Time to Maturity (years)', fontsize=12)
        ax.set_ylabel('Critical Stock Price', fontsize=12)
        ax.set_title(title, fontsize=14, fontweight='bold')
        ax.legend()
        ax.grid(True, alpha=0.3)

        plt.tight_layout()

        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')

        plt.show()

    def plot_greeks(self, greeks_df, title: str = "Option Greeks", save_path: Optional[str] = None):
        """
        Plot Greeks surface.

        Parameters
        ----------
        greeks_df : pd.DataFrame
            DataFrame with columns: S, Delta, Gamma, Vega, Theta, Rho
        title : str
            Plot title
        save_path : str, optional
            Path to save figure
        """
        fig, axes = plt.subplots(2, 3, figsize=(15, 10))
        axes = axes.flatten()

        greeks_names = ['Delta', 'Gamma', 'Vega', 'Theta', 'Rho']
        colors = ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D', '#6A994E']

        for i, (greek, color) in enumerate(zip(greeks_names, colors)):
            if greek in greeks_df.columns:
                axes[i].plot(greeks_df['S'], greeks_df[greek], linewidth=2, color=color)
                axes[i].set_xlabel('Spot Price', fontsize=10)
                axes[i].set_ylabel(greek, fontsize=10)
                axes[i].set_title(f'{greek} vs Spot Price', fontsize=11, fontweight='bold')
                axes[i].grid(True, alpha=0.3)

        # Hide last subplot if only 5 Greeks
        axes[5].axis('off')

        plt.suptitle(title, fontsize=14, fontweight='bold', y=1.00)
        plt.tight_layout()

        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')

        plt.show()

    def plot_forward_curve(self, forward_curve: Dict, title: str = "Forward Curve", save_path: Optional[str] = None):
        """
        Plot forward price curve.

        Parameters
        ----------
        forward_curve : Dict
            Dictionary mapping maturity to forward price
        title : str
            Plot title
        save_path : str, optional
            Path to save figure
        """
        fig, ax = plt.subplots(figsize=self.figsize)

        maturities = sorted(forward_curve.keys())
        prices = [forward_curve[T] for T in maturities]

        ax.plot(maturities, prices, linewidth=2, marker='o', color='#2E86AB', markersize=8)
        ax.set_xlabel('Maturity (years)', fontsize=12)
        ax.set_ylabel('Forward Price', fontsize=12)
        ax.set_title(title, fontsize=14, fontweight='bold')
        ax.grid(True, alpha=0.3)

        plt.tight_layout()

        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')

        plt.show()

    def plot_convergence(self, convergence_results: Dict, title: str = "Binomial Tree Convergence", save_path: Optional[str] = None):
        """
        Plot convergence analysis.

        Parameters
        ----------
        convergence_results : Dict
            Dictionary mapping N to price
        title : str
            Plot title
        save_path : str, optional
            Path to save figure
        """
        fig, ax = plt.subplots(figsize=self.figsize)

        N_values = sorted(convergence_results.keys())
        prices = [convergence_results[N] for N in N_values]

        ax.plot(N_values, prices, linewidth=2, marker='o', color='#A23B72', markersize=8)
        ax.axhline(y=prices[-1], color='gray', linestyle='--', alpha=0.5, label=f'Converged Value: ${prices[-1]:.4f}')

        ax.set_xlabel('Number of Steps (N)', fontsize=12)
        ax.set_ylabel('Option Price', fontsize=12)
        ax.set_title(title, fontsize=14, fontweight='bold')
        ax.legend()
        ax.grid(True, alpha=0.3)

        plt.tight_layout()

        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')

        plt.show()

    def plot_stress_test(self, stress_results: Dict, xlabel: str, title: str = "Stress Test Results", save_path: Optional[str] = None):
        """
        Plot stress test results.

        Parameters
        ----------
        stress_results : Dict
            Dictionary mapping parameter value to price
        xlabel : str
            X-axis label
        title : str
            Plot title
        save_path : str, optional
            Path to save figure
        """
        fig, ax = plt.subplots(figsize=self.figsize)

        x_values = sorted(stress_results.keys())
        y_values = [stress_results[x] for x in x_values]

        ax.plot(x_values, y_values, linewidth=2, marker='o', color='#F18F01', markersize=8)
        ax.set_xlabel(xlabel, fontsize=12)
        ax.set_ylabel('Option Price', fontsize=12)
        ax.set_title(title, fontsize=14, fontweight='bold')
        ax.grid(True, alpha=0.3)

        plt.tight_layout()

        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')

        plt.show()

    def plot_comparison(self, data: Dict[str, float], title: str = "Price Comparison", save_path: Optional[str] = None):
        """
        Plot comparison of different derivative prices.

        Parameters
        ----------
        data : Dict[str, float]
            Dictionary mapping label to price
        title : str
            Plot title
        save_path : str, optional
            Path to save figure
        """
        fig, ax = plt.subplots(figsize=self.figsize)

        labels = list(data.keys())
        values = list(data.values())
        colors = ['#2E86AB', '#A23B72', '#F18F01', '#C73E1D', '#6A994E'][:len(labels)]

        bars = ax.bar(labels, values, color=colors, alpha=0.8)

        # Add value labels on bars
        for bar in bars:
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height,
                   f'${height:.4f}',
                   ha='center', va='bottom', fontsize=10)

        ax.set_ylabel('Price', fontsize=12)
        ax.set_title(title, fontsize=14, fontweight='bold')
        ax.grid(True, alpha=0.3, axis='y')

        plt.tight_layout()

        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')

        plt.show()


# Convenience functions
def plot_quick(x, y, xlabel: str = 'X', ylabel: str = 'Y', title: str = 'Plot'):
    """Quick plot function."""
    viz = Visualizer()
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.plot(x, y, linewidth=2)
    ax.set_xlabel(xlabel)
    ax.set_ylabel(ylabel)
    ax.set_title(title, fontweight='bold')
    ax.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.show()
