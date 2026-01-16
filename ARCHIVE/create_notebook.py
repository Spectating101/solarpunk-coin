import json

notebook = {
    "cells": [
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": ["# Energy Derivatives Demo\n", "\n", "Price renewable energy derivatives using real solar data from NASA."]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "import subprocess, sys\n",
                "print('Installing spk-derivatives...')\n",
                "subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-q', 'git+https://github.com/Spectating101/spk-derivatives.git'])\n",
                "print('Done!')"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "from spk_derivatives import load_solar_parameters, BinomialTree, MonteCarloSimulator, calculate_greeks\n",
                "\n",
                "params = load_solar_parameters(lat=24.99, lon=121.30, volatility_cap=2.0, volatility_method='log', cache=True)\n",
                "print(f'Spot: ${params[\"S0\"]:.4f}/kWh')\n",
                "print(f'Strike: ${params[\"K\"]:.4f}/kWh')\n",
                "print(f'Volatility: {params[\"sigma\"]:.2%}')"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "core = {k: params[k] for k in ('S0', 'K', 'T', 'r', 'sigma')}\n",
                "bt = BinomialTree(**core, N=400, payoff_type='call')\n",
                "price = bt.price()\n",
                "print(f'Binomial Call Price: ${price:.6f}/kWh')"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "mc = MonteCarloSimulator(**core, num_simulations=20000, seed=42, payoff_type='call')\n",
                "mc_price, low, high = mc.confidence_interval(0.95)\n",
                "print(f'Monte Carlo Call Price: ${mc_price:.6f}/kWh')\n",
                "print(f'95% CI: ${low:.6f} - ${high:.6f}')\n",
                "print(f'Convergence Error: {abs(price - mc_price) / mc_price * 100:.2f}%')"
            ]
        },
        {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "greeks_df = calculate_greeks(**core, pricing_method='binomial', N=100)\n",
                "print('\\nGREEKS:')\n",
                "for _, row in greeks_df.iterrows():\n",
                "    print(f'{row[\"Greek\"]}: {row[\"Value\"]:.6f}')"
            ]
        },
        {
            "cell_type": "markdown",
            "metadata": {},
            "source": [
                "## Done!\n",
                "\n",
                "You've priced a renewable energy derivative using:\n",
                "- Real solar data from NASA\n",
                "- Binomial tree pricing\n",
                "- Monte Carlo validation\n",
                "- Full Greeks for risk management\n",
                "\n",
                "This is how energy-backed cryptocurrencies work!"
            ]
        }
    ],
    "metadata": {
        "kernelspec": {
            "display_name": "Python 3",
            "language": "python",
            "name": "python3"
        },
        "language_info": {
            "name": "python",
            "version": "3.10.0"
        }
    },
    "nbformat": 4,
    "nbformat_minor": 4
}

with open('examples/simple_demo.ipynb', 'w') as f:
    json.dump(notebook, f, indent=1)

print('Created examples/simple_demo.ipynb')
