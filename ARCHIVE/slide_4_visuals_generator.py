"""
SLIDE 4 VISUAL GENERATOR: Energy Token Mechanism
Creates the key visual showing:
- Night (supply=0, demand=high, expensive)
- Noon (supply=max, demand=low, cheap)
- Token as bridge (fair price in middle)
"""

import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import Rectangle, FancyBboxPatch, FancyArrowPatch
from matplotlib.collections import PatchCollection
import matplotlib.patches as mpatches

# Create figure with 3 subplots
fig = plt.figure(figsize=(16, 10))

# ============================================================================
# LEFT: Night Scenario (Call Option)
# ============================================================================
ax1 = plt.subplot(1, 3, 1)

# Supply bar (red, tiny)
supply_night = 0.1
demand_night = 9.0
price_night = 0.08

ax1.barh(['Supply', 'Demand'], [supply_night, demand_night], 
         color=['#FF6B6B', '#FF0000'], height=0.5, alpha=0.8)
ax1.axvline(x=supply_night, color='#FF6B6B', linestyle='--', linewidth=2, label='Supply')
ax1.axvline(x=demand_night, color='#FF0000', linestyle='--', linewidth=2, label='Demand')

# Add price annotation
ax1.text(5, -0.5, f'Market Price: ${price_night:.2f}/kWh', 
         fontsize=14, fontweight='bold', color='red', ha='center',
         bbox=dict(boxstyle='round', facecolor='yellow', alpha=0.7))

# Add call option annotation
ax1.text(5, 1.8, 'CALL OPTION TERRITORY\n(Right to BUY at cap price)', 
         fontsize=11, ha='center', style='italic',
         bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.8))

ax1.set_xlim(0, 10)
ax1.set_ylim(-1, 2.5)
ax1.set_xlabel('Energy (arbitrary units)', fontsize=11)
ax1.set_title('SCENARIO A: NIGHT\nSupply > Demand', fontsize=13, fontweight='bold', color='darkred')
ax1.grid(axis='x', alpha=0.3)

# ============================================================================
# CENTER: The Token Bridge
# ============================================================================
ax2 = plt.subplot(1, 3, 2)

# Prices
price_night = 0.08
price_token = 0.025  # Fair price from derivatives
price_noon = 0.001

# Draw the spread
ax2.fill_between([0.5, 1.5], [price_noon, price_noon], [price_night, price_night], 
                 alpha=0.2, color='red', label='Spread (Waste)')

# Night price
ax2.barh([2], [price_night], left=[0.5], height=0.4, color='red', alpha=0.8, label='Night Price')
ax2.text(0.2, 2, f'${price_night:.3f}', fontsize=11, fontweight='bold', color='red')

# Token price (fair, in middle)
ax2.barh([1], [price_token], left=[0.5], height=0.4, color='green', alpha=0.8, label='Token Fair Price')
ax2.text(0.15, 1, f'${price_token:.3f}', fontsize=11, fontweight='bold', color='green')

# Noon price
ax2.barh([0], [price_noon], left=[0.5], height=0.4, color='blue', alpha=0.8, label='Noon Price')
ax2.text(0.2, 0, f'${price_noon:.4f}', fontsize=11, fontweight='bold', color='blue')

# Arrows showing the mechanism
ax2.annotate('', xy=(2.2, 2), xytext=(2.2, 1), 
             arrowprops=dict(arrowstyle='<->', color='black', lw=2))
ax2.text(2.5, 1.5, 'Miner\nPays\nLess', fontsize=10, fontweight='bold', ha='left')

ax2.annotate('', xy=(2.2, 1), xytext=(2.2, 0), 
             arrowprops=dict(arrowstyle='<->', color='black', lw=2))
ax2.text(2.5, 0.5, 'Producer\nEarns\nMore', fontsize=10, fontweight='bold', ha='left')

ax2.set_xlim(-0.5, 4.5)
ax2.set_ylim(-0.5, 2.5)
ax2.set_yticks([0, 1, 2])
ax2.set_yticklabels(['Noon\n(Surplus)', 'Token\n(Bridge)', 'Night\n(Deficit)'])
ax2.set_xticks([])
ax2.set_title('THE TOKEN BRIDGE\nFair Price via Derivatives', fontsize=13, fontweight='bold', color='darkgreen')
ax2.legend(loc='upper right', fontsize=9)
ax2.grid(axis='y', alpha=0.3)

# ============================================================================
# RIGHT: Noon Scenario (Put Option)
# ============================================================================
ax3 = plt.subplot(1, 3, 3)

# Supply bar (blue, huge)
supply_noon = 9.0
demand_noon = 0.5
price_noon = 0.001

ax3.barh(['Supply', 'Demand'], [supply_noon, demand_noon], 
         color=['#4ECDC4', '#0066CC'], height=0.5, alpha=0.8)
ax3.axvline(x=supply_noon, color='#4ECDC4', linestyle='--', linewidth=2, label='Supply')
ax3.axvline(x=demand_noon, color='#0066CC', linestyle='--', linewidth=2, label='Demand')

# Add price annotation
ax3.text(5, -0.5, f'Market Price: ${price_noon:.4f}/kWh', 
         fontsize=14, fontweight='bold', color='blue', ha='center',
         bbox=dict(boxstyle='round', facecolor='lightyellow', alpha=0.7))

# Add put option annotation
ax3.text(5, 1.8, 'PUT OPTION TERRITORY\n(Right to SELL at floor price)', 
         fontsize=11, ha='center', style='italic',
         bbox=dict(boxstyle='round', facecolor='lightcoral', alpha=0.8))

ax3.set_xlim(0, 10)
ax3.set_ylim(-1, 2.5)
ax3.set_xlabel('Energy (arbitrary units)', fontsize=11)
ax3.set_title('SCENARIO B: NOON\nDemand < Supply', fontsize=13, fontweight='bold', color='darkblue')
ax3.grid(axis='x', alpha=0.3)

plt.suptitle('ENERGY TOKEN MECHANISM: Bridging Night/Noon Volatility', 
             fontsize=16, fontweight='bold', y=0.98)

plt.tight_layout(rect=[0, 0, 1, 0.96])
plt.savefig('/tmp/energy_token_mechanism.png', dpi=300, bbox_inches='tight')
print("✓ Saved: /tmp/energy_token_mechanism.png")

# ============================================================================
# SECOND FIGURE: The Flywheel
# ============================================================================
fig2, ax = plt.subplots(1, 1, figsize=(12, 10))

# Draw the flywheel circle with components
circle_center = (0.5, 0.5)
circle_radius = 0.35

# Main circle
circle = plt.Circle(circle_center, circle_radius, fill=False, edgecolor='black', linewidth=3)
ax.add_patch(circle)

# Positions (12 o'clock, 3 o'clock, 6 o'clock, 9 o'clock)
positions = {
    'Producer': (0.5, 0.92),      # Top
    'Pricing': (0.92, 0.5),       # Right
    'Miner': (0.5, 0.08),         # Bottom
    'Liquidity': (0.08, 0.5),     # Left
}

colors = {
    'Producer': '#FFD700',
    'Pricing': '#90EE90',
    'Miner': '#87CEEB',
    'Liquidity': '#FFB6C1'
}

labels_detail = {
    'Producer': 'Locks in\nRevenue\n($0.025)',
    'Pricing': 'spk-derivatives\nFair Price\n(Volatility × Risk)',
    'Miner': 'Locks in\nCost\n($0.025)',
    'Liquidity': 'Trades\nTokens\n& Options'
}

# Draw boxes at each position
for key, (x, y) in positions.items():
    box = FancyBboxPatch((x-0.12, y-0.08), 0.24, 0.16, 
                         boxstyle="round,pad=0.01", 
                         facecolor=colors[key], edgecolor='black', linewidth=2, alpha=0.8)
    ax.add_patch(box)
    ax.text(x, y, labels_detail[key], ha='center', va='center', 
            fontsize=10, fontweight='bold')

# Draw arrows around the circle (clockwise)
arrow_props = dict(arrowstyle='->', lw=3, color='darkgreen')

# Producer → Pricing
ax.annotate('', xy=(0.75, 0.75), xytext=(0.65, 0.85),
            arrowprops=arrow_props)

# Pricing → Miner
ax.annotate('', xy=(0.65, 0.15), xytext=(0.75, 0.25),
            arrowprops=arrow_props)

# Miner → Liquidity
ax.annotate('', xy=(0.25, 0.25), xytext=(0.35, 0.15),
            arrowprops=arrow_props)

# Liquidity → Producer
ax.annotate('', xy=(0.35, 0.85), xytext=(0.25, 0.75),
            arrowprops=arrow_props)

# Central text
ax.text(0.5, 0.5, 'ENERGY\nTOKEN\nFLYWHEEL', ha='center', va='center',
        fontsize=14, fontweight='bold',
        bbox=dict(boxstyle='circle', facecolor='white', edgecolor='black', linewidth=2))

ax.set_xlim(-0.1, 1.1)
ax.set_ylim(-0.1, 1.1)
ax.set_aspect('equal')
ax.axis('off')

plt.title('THE ENERGY TOKEN FLYWHEEL: How It All Fits Together', 
          fontsize=14, fontweight='bold', pad=20)

plt.tight_layout()
plt.savefig('/tmp/energy_token_flywheel.png', dpi=300, bbox_inches='tight')
print("✓ Saved: /tmp/energy_token_flywheel.png")

# ============================================================================
# THIRD FIGURE: Before vs After Comparison
# ============================================================================
fig3, (ax_before, ax_after) = plt.subplots(1, 2, figsize=(14, 8))

# BEFORE
ax_before.text(0.5, 0.9, 'WITHOUT ENERGY TOKEN', ha='center', fontsize=14, fontweight='bold',
               transform=ax_before.transAxes)

scenarios_before = [
    ('Noon Surplus', 'Producers', '$0.001/kWh', 'red'),
    ('Night Deficit', 'Miners', '$0.080/kWh', 'darkred'),
]

y_pos = 0.7
for scenario, actor, price, color in scenarios_before:
    ax_before.text(0.05, y_pos, f'{scenario}:', fontsize=11, fontweight='bold',
                   transform=ax_before.transAxes)
    ax_before.text(0.05, y_pos-0.08, f'  {actor} faces: {price}', fontsize=10,
                   transform=ax_before.transAxes, color=color, fontweight='bold')
    y_pos -= 0.2

# Problem statement
ax_before.text(0.5, 0.15, 'Spread = $0.079/kWh\n(All Waste)', 
               ha='center', fontsize=12, fontweight='bold', color='red',
               transform=ax_before.transAxes,
               bbox=dict(boxstyle='round', facecolor='yellow', alpha=0.7))

ax_before.axis('off')

# AFTER
ax_after.text(0.5, 0.9, 'WITH ENERGY TOKEN', ha='center', fontsize=14, fontweight='bold',
              transform=ax_after.transAxes)

scenarios_after = [
    ('Noon Surplus', 'Producers', '$0.025/kWh', 'green'),
    ('Night Deficit', 'Miners', '$0.025/kWh', 'green'),
]

y_pos = 0.7
for scenario, actor, price, color in scenarios_after:
    ax_after.text(0.05, y_pos, f'{scenario}:', fontsize=11, fontweight='bold',
                  transform=ax_after.transAxes)
    ax_after.text(0.05, y_pos-0.08, f'  {actor} pays: {price}', fontsize=10,
                  transform=ax_after.transAxes, color=color, fontweight='bold')
    y_pos -= 0.2

# Solution statement
ax_after.text(0.5, 0.15, 'Fair Price = $0.025/kWh\n(Efficiency + Liquidity)', 
              ha='center', fontsize=12, fontweight='bold', color='green',
              transform=ax_after.transAxes,
              bbox=dict(boxstyle='round', facecolor='lightgreen', alpha=0.7))

ax_after.axis('off')

plt.suptitle('THE ENERGY TOKEN: Creating Efficiency Through Derivatives', 
             fontsize=14, fontweight='bold')

plt.tight_layout()
plt.savefig('/tmp/energy_token_before_after.png', dpi=300, bbox_inches='tight')
print("✓ Saved: /tmp/energy_token_before_after.png")

print("\n✅ ALL SLIDE 4 VISUALS CREATED:")
print("   1. /tmp/energy_token_mechanism.png (Night/Day/Bridge)")
print("   2. /tmp/energy_token_flywheel.png (Circular flow)")
print("   3. /tmp/energy_token_before_after.png (Impact comparison)")
