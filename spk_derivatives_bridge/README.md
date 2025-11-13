# SPK Derivatives Bridge
## Energy-Backed Token Pricing Module

This module bridges CEIR research to SolarPunkCoin (SPK) token design through rigorous derivative pricing.

---

## 🌉 The Bridge Concept

```
CEIR Research (Your Past Work)
    ↓
    Establishes: Energy DOES anchor cryptocurrency value
    Proves: Low CEIR predicts returns when mining concentrated
    ↓
SPK Derivatives Bridge (THIS MODULE)
    ↓
    Translates: CEIR insights → Token pricing parameters
    Prices: Redemption options, guarantees, reserves
    Outputs: Fair values, optimal strategies, risk metrics
    ↓
SolarPunkCoin Implementation (Your Future Work)
    ↓
    Uses: These parameters to design actual SPK token
    Deploys: Token with scientifically-backed mechanics
```

---

## 🎯 What This Module Does

### Inputs (from CEIR)
- Bitcoin/Ethereum energy cost data
- CEIR time series (Market Cap / Cumulative Energy Cost)
- Energy price volatility estimates

### Processing (Derivative Pricing)
- Prices SPK redemption mechanisms as American options
- Computes optimal redemption strategies
- Calculates backing guarantee costs
- Determines reserve requirements

### Outputs (to SPK Design)
- Fair token prices
- Recommended backing ratios
- Reserve requirements (confidence-based)
- Risk parameters (Greeks)
- Peg stability costs

---

## 📁 Module Structure

```
spk_derivatives_bridge/
├── README.md              # This file
├── config.py              # SPK token configuration
├── ceir_bridge.py         # Bridge from CEIR to pricing
├── spk_pricer.py          # SPK-specific pricing logic
├── integration.py         # Integration utilities
├── examples/
│   ├── basic_usage.py     # Simple example
│   └── spk_calibration.py # Full SPK parameter calibration
└── docs/
    └── INTEGRATION_GUIDE.md  # How to integrate with SPK
```

---

## 🚀 Quick Start

### Basic Usage

```python
from ceir_bridge import CEIRBridge
from spk_pricer import SPKTokenPricer

# Step 1: Load CEIR data
bridge = CEIRBridge(ceir_data_path='../empirical')
energy_params = bridge.extract_pricing_parameters()

# Step 2: Price SPK token mechanics
spk_pricer = SPKTokenPricer(
    S0=energy_params['energy_price'],
    sigma=energy_params['volatility'],
    r=0.05
)

# Step 3: Get SPK design parameters
spk_params = spk_pricer.compute_token_parameters(
    redemption_fee=0.001,  # 0.1% redemption fee
    backing_target=1.1,     # 110% backing
    peg_band=0.05          # ±5% peg band
)

print(f"Fair SPK price: ${spk_params['fair_price']:.4f}")
print(f"Required reserves: ${spk_params['reserves']:.4f} per token")
print(f"Guarantee cost: ${spk_params['guarantee_cost']:.4f} per token")
```

---

## 🔗 Integration Points

### 1. CEIR Data Input
```python
# Bridge automatically loads from your CEIR research
bridge = CEIRBridge(ceir_data_path='../empirical')

# Or provide CEIR directly
bridge = CEIRBridge(ceir_series=your_ceir_data)
```

### 2. SPK Configuration
```python
from config import SPKConfig

# Define SPK token parameters
config = SPKConfig(
    name="SolarPunkCoin",
    redemption_enabled=True,
    backing_ratio=1.10,  # 110%
    peg_target=1.0,  # $1 target
    peg_band=0.05,   # ±5%
)

pricer = SPKTokenPricer.from_config(config)
```

### 3. Output to SPK Design
```python
# Get comprehensive design parameters
design_params = pricer.get_design_parameters()

# Use in SPK smart contract
spk_contract.set_parameters(
    backing_ratio=design_params['backing_ratio'],
    reserve_pool=design_params['reserve_requirement'],
    redemption_threshold=design_params['redemption_threshold']
)
```

---

## 📊 Key Features

### 1. CEIR-to-Energy-Price Conversion
Converts your CEIR research output into pricing parameters:
- Energy unit prices (S₀)
- Volatility estimates (σ)
- Trend analysis

### 2. SPK-Specific Pricing
Prices mechanisms specific to SPK token design:
- **Redemption Options**: When should holders redeem?
- **Backing Guarantees**: Cost of "always redeemable" promise
- **Peg Stability**: Cost to maintain price band
- **Reserve Requirements**: How much to hold in reserve?

### 3. Risk Management
Provides Greeks and risk metrics:
- Delta: Exposure to energy price movements
- Vega: Sensitivity to volatility
- Optimal hedge ratios

### 4. Scenario Analysis
Test different SPK configurations:
- Various backing ratios (100%, 110%, 120%)
- Different peg bands (±2%, ±5%, ±10%)
- Multiple redemption fee structures

---

## 🔬 Theoretical Foundation

### From CEIR to SPK Pricing

**CEIR Insight:**
> "Energy costs anchor Bitcoin value when mining is geographically concentrated"

**Bridge Question:**
> "If we create a token directly redeemable for energy, what's the fair price?"

**Pricing Answer:**
```
SPK Token Value = Base Energy Claim + Redemption Option Premium + Peg Guarantee Value

Where:
- Base Energy Claim: Present value of 1 kWh
- Redemption Option: American call (exercise anytime)
- Peg Guarantee: Put option (issuer promises backing)
```

### Mathematical Framework

**1. Energy Unit Price (from CEIR)**
```
S_t = CEIR_t / CEIR_0  (normalized)
```

**2. SPK Fair Value**
```
V_SPK = American_Call(S, K=cost, T=maturity, σ=CEIR_volatility)
```

**3. Backing Guarantee Cost**
```
C_guarantee = American_Put(S, K=backing_ratio×S, T, σ)
```

**4. Reserves Required**
```
Reserves = VaR_α(S, T, σ)  (Value-at-Risk at α% confidence)
```

---

## 📈 Output Parameters for SPK

After running this module, you get scientifically-backed parameters for SPK:

| Parameter | Typical Value | Use In SPK |
|-----------|---------------|------------|
| Fair Token Price | $1.234 | Initial issuance price |
| Backing Ratio | 110% | Collateral requirement |
| Reserve Requirement | $1.15/token | Reserve pool size |
| Redemption Threshold | $1.45 | When redemption profitable |
| Guarantee Cost | $0.08/token | Insurance cost |
| Delta | 0.58 | Hedge 58% of energy exposure |
| Peg Maintenance Cost | $0.02/token/year | Stability fund |

---

## 🛠️ Configuration Options

### SPKConfig Parameters

```python
SPKConfig(
    # Token Identity
    name="SolarPunkCoin",
    symbol="SPK",

    # Redemption Mechanics
    redemption_enabled=True,
    redemption_fee=0.001,  # 0.1%
    redemption_delay=0,     # Immediate or T days

    # Backing & Reserves
    backing_ratio=1.10,     # 110% backing
    reserve_ratio=1.05,     # 105% reserves
    confidence_level=0.95,  # 95% VaR

    # Peg Mechanism
    peg_target=1.0,         # $1 target
    peg_band=0.05,          # ±5%
    mint_burn_enabled=True,

    # Time Horizon
    maturity=1.0,           # 1 year default
    risk_free_rate=0.05,    # 5%
)
```

---

## 🔄 Workflow Integration

### Research Pipeline

```
1. CEIR Research (Completed)
   └─ Bitcoin energy data → CEIR time series

2. Bridge Module (This)
   └─ CEIR → Pricing parameters → SPK design values

3. SPK Implementation (Next)
   └─ Design values → Smart contract → Deployment
```

### Code Integration

```python
# In your SPK project:

from spk_derivatives_bridge import CEIRBridge, SPKTokenPricer

# Load your CEIR research results
bridge = CEIRBridge('../empirical')
params = bridge.extract_pricing_parameters()

# Price SPK mechanics
pricer = SPKTokenPricer(**params)
spk_design = pricer.compute_token_parameters()

# Use in SPK smart contract
deploy_spk_token(
    initial_price=spk_design['fair_price'],
    backing_ratio=spk_design['backing_ratio'],
    reserves=spk_design['reserves']
)
```

---

## 📚 Documentation

- **INTEGRATION_GUIDE.md**: Step-by-step integration instructions
- **API_REFERENCE.md**: Complete API documentation
- **EXAMPLES.md**: Common use cases and patterns

---

## 🎯 Key Differences from Coursework Version

| Aspect | Coursework Version | SPK Integration Version |
|--------|-------------------|------------------------|
| **Purpose** | Demonstrate option pricing | Design real SPK token |
| **Input** | Generic Bitcoin data | Your CEIR research output |
| **Output** | Option prices & Greeks | SPK design parameters |
| **Focus** | Academic theory | Practical implementation |
| **Structure** | Standalone demo | Pluggable module |
| **Configuration** | Hardcoded params | Flexible SPKConfig |

---

## ✅ Ready for SPK Development

This module provides:
- ✅ Bridge from CEIR research to token design
- ✅ Scientifically-backed parameter recommendations
- ✅ Risk management framework
- ✅ Integration-ready architecture
- ✅ Configuration flexibility

Use this to translate your academic research into a deployable token design.

---

**Status:** Ready for integration with SPK implementation
**Version:** 1.0.0
**Compatibility:** Designed for solarpunk-coin repository structure
