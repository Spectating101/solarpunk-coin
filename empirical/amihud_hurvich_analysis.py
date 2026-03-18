#!/usr/bin/env python3
"""
Amihud-Hurvich (2004) bias-corrected predictive regression analysis.
Weekly non-overlapping sample. HC1 robust SEs.
Produces all numbers cited in thesis Chapter 2.
"""

import pandas as pd
import numpy as np
import statsmodels.api as sm
import statsmodels.formula.api as smf
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

CHINA_BAN = pd.Timestamp('2021-06-21')
ETH_MERGE  = pd.Timestamp('2022-09-15')

# ──────────────────────────────────────────────────────────────────────────────
# 1. LOAD DATA
# ──────────────────────────────────────────────────────────────────────────────
print("=" * 70)
print("AMIHUD-HURVICH BIAS-CORRECTED CEIR ANALYSIS — WEEKLY NON-OVERLAPPING")
print("=" * 70)

df = pd.read_csv('bitcoin_ceir_analysis_ready.csv')
df['Date'] = pd.to_datetime(df['Date'])
df = df.sort_values('Date').reset_index(drop=True)

# Compute 30-day forward return from daily data before sampling
# Returns_forward in the file is already 1-day; recompute 30-day forward
df['ret_30d_forward'] = df['Price'].shift(-30) / df['Price'] - 1

# Annualised 30-day rolling volatility
df['vol_30d'] = df['Returns'].rolling(30).std() * np.sqrt(252)

# Drop rows missing key variables
df = df.dropna(subset=['log_CEIR', 'fear_greed_index', 'ret_30d_forward', 'vol_30d'])

# ──────────────────────────────────────────────────────────────────────────────
# 2. WEEKLY NON-OVERLAPPING SAMPLE
# Every 7th calendar day to avoid overlap bias in 30-day returns
# ──────────────────────────────────────────────────────────────────────────────
df_weekly = df.iloc[::7].copy().reset_index(drop=True)
print(f"\nFull weekly sample: N = {len(df_weekly)}")
print(f"Date range: {df_weekly['Date'].min().date()} to {df_weekly['Date'].max().date()}")

pre  = df_weekly[df_weekly['Date'] <  CHINA_BAN].copy()
post = df_weekly[df_weekly['Date'] >= CHINA_BAN].copy()
print(f"Pre-ban weekly N  = {len(pre)}")
print(f"Post-ban weekly N = {len(post)}")

# ──────────────────────────────────────────────────────────────────────────────
# 3. STATIONARITY DIAGNOSTICS ON log(CEIR)
# ──────────────────────────────────────────────────────────────────────────────
from statsmodels.tsa.stattools import adfuller, kpss

print("\n" + "─" * 60)
print("STATIONARITY TESTS — log(CEIR) full weekly sample")
print("─" * 60)

adf_stat, adf_p, _, _, _, _ = adfuller(df_weekly['log_CEIR'].dropna(), maxlag=4, autolag='AIC')
print(f"ADF statistic: {adf_stat:.3f}  p-value: {adf_p:.3f}  (H0: unit root)")

kpss_stat, kpss_p, _, _ = kpss(df_weekly['log_CEIR'].dropna(), regression='c', nlags='auto')
print(f"KPSS statistic: {kpss_stat:.3f}  p-value: {kpss_p:.3f}  (H0: stationary)")

# AR(1) of log(CEIR)
ar1_model = sm.OLS(
    df_weekly['log_CEIR'].iloc[1:].values,
    sm.add_constant(df_weekly['log_CEIR'].iloc[:-1].values)
).fit()
rho_hat = ar1_model.params[1]
print(f"AR(1) coefficient ρ̂ = {rho_hat:.4f}")

# ──────────────────────────────────────────────────────────────────────────────
# 4. AMIHUD-HURVICH AUGMENTED REGRESSION
# Include AR(1) residual û_t to absorb predictor-return shock correlation
# ──────────────────────────────────────────────────────────────────────────────

def amihud_hurvich_reg(data, label=""):
    """
    Runs AH-augmented regression:
      ret_30d_forward = α + β·log(CEIR) + γ·FearGreed + δ·û + ε
    Returns result object.
    """
    d = data.copy().reset_index(drop=True)

    # Step 1: AR(1) residuals of log(CEIR)
    ar = sm.OLS(
        d['log_CEIR'].iloc[1:].values,
        sm.add_constant(d['log_CEIR'].iloc[:-1].values)
    ).fit()
    d['u_hat'] = np.nan
    d.loc[1:, 'u_hat'] = ar.resid
    d = d.dropna(subset=['u_hat', 'ret_30d_forward', 'fear_greed_index', 'vol_30d'])

    n = len(d)
    print(f"\n  {label} — N = {n}")

    # Col 1: log(CEIR) only
    X1 = sm.add_constant(d['log_CEIR'])
    m1 = sm.OLS(d['ret_30d_forward'], X1).fit(cov_type='HC1')

    # Col 2: + Fear&Greed + û (AH-corrected, preferred)
    X2 = sm.add_constant(pd.DataFrame({
        'log_CEIR':        d['log_CEIR'],
        'fear_greed_index': d['fear_greed_index'],
        'u_hat':           d['u_hat'],
    }))
    m2 = sm.OLS(d['ret_30d_forward'], X2).fit(cov_type='HC1')

    # Col 3: + quadratic
    X3 = sm.add_constant(pd.DataFrame({
        'log_CEIR':        d['log_CEIR'],
        'log_CEIR_sq':     d['log_CEIR']**2,
        'fear_greed_index': d['fear_greed_index'],
        'u_hat':           d['u_hat'],
    }))
    m3 = sm.OLS(d['ret_30d_forward'], X3).fit(cov_type='HC1')

    # Print preferred (col 2)
    b  = m2.params['log_CEIR']
    se = m2.bse['log_CEIR']
    p  = m2.pvalues['log_CEIR']
    sd_ceir = d['log_CEIR'].std()
    pp_effect = abs(b) * sd_ceir * 100

    print(f"  log(CEIR) β = {b:.3f}  SE = {se:.3f}  p = {p:.4f}")
    print(f"  1 SD of log(CEIR) = {sd_ceir:.3f}")
    print(f"  Economic effect: {pp_effect:.1f} pp per 1SD")
    print(f"  R² = {m2.rsquared:.3f}   Adj R² = {m2.rsquared_adj:.3f}")
    print(f"  log(CEIR)² (col3): {m3.params.get('log_CEIR_sq', np.nan):.3f}  p={m3.pvalues.get('log_CEIR_sq', np.nan):.3f}")

    return m2, d, b, se, p

print("\n" + "─" * 60)
print("TABLE 2.2 — PRE-BAN BIAS-CORRECTED REGRESSION")
print("─" * 60)
m_pre, pre_clean, b_pre, se_pre, p_pre = amihud_hurvich_reg(pre, "Pre-ban")

print("\n" + "─" * 60)
print("TABLE 2.3 — POST-BAN BIAS-CORRECTED REGRESSION")
print("─" * 60)
m_post, post_clean, b_post, se_post, p_post = amihud_hurvich_reg(post, "Post-ban")

# ──────────────────────────────────────────────────────────────────────────────
# 5. CHOW TEST (on weekly AH spec)
# ──────────────────────────────────────────────────────────────────────────────
print("\n" + "─" * 60)
print("CHOW TEST — STRUCTURAL BREAK AT CHINA BAN (weekly AH spec)")
print("─" * 60)

all_clean = pd.concat([pre_clean, post_clean]).reset_index(drop=True)

# Restricted: single regression on full sample
X_r = sm.add_constant(pd.DataFrame({
    'log_CEIR':         all_clean['log_CEIR'],
    'fear_greed_index': all_clean['fear_greed_index'],
    'u_hat':            all_clean['u_hat'],
}))
rss_r = sm.OLS(all_clean['ret_30d_forward'], X_r).fit().ssr

# Unrestricted: pre + post separate
rss_u = m_pre.ssr + m_post.ssr

k = 4          # number of parameters in each sub-regression (const, CEIR, FG, u_hat)
n_total = len(all_clean)
chow_f = ((rss_r - rss_u) / k) / (rss_u / (n_total - 2*k))
chow_p = 1 - stats.f.cdf(chow_f, k, n_total - 2*k)
print(f"Chow F-statistic = {chow_f:.3f}   p = {chow_p:.4f}")

# ──────────────────────────────────────────────────────────────────────────────
# 6. PLACEBO CHOW TESTS (6-month intervals)
# ──────────────────────────────────────────────────────────────────────────────
print("\n" + "─" * 60)
print("PLACEBO CHOW TESTS — 6-MONTH INTERVALS")
print("─" * 60)

placebo_dates = pd.date_range('2019-12-01', '2024-12-01', freq='6MS')
placebo_results = []

for pb_date in placebo_dates:
    pb_pre  = df_weekly[df_weekly['Date'] <  pb_date].copy()
    pb_post = df_weekly[df_weekly['Date'] >= pb_date].copy()
    if len(pb_pre) < 20 or len(pb_post) < 20:
        continue

    def quick_ah(data):
        d = data.copy().reset_index(drop=True)
        ar = sm.OLS(
            d['log_CEIR'].iloc[1:].values,
            sm.add_constant(d['log_CEIR'].iloc[:-1].values)
        ).fit()
        d['u_hat'] = np.nan
        d.loc[1:, 'u_hat'] = ar.resid
        d = d.dropna(subset=['u_hat', 'ret_30d_forward', 'fear_greed_index'])
        X = sm.add_constant(pd.DataFrame({
            'log_CEIR': d['log_CEIR'],
            'fear_greed_index': d['fear_greed_index'],
            'u_hat': d['u_hat'],
        }))
        return sm.OLS(d['ret_30d_forward'], X).fit(), d

    try:
        m1, d1 = quick_ah(pb_pre)
        m2, d2 = quick_ah(pb_post)
        all_d = pd.concat([d1, d2]).reset_index(drop=True)
        X_r2 = sm.add_constant(pd.DataFrame({
            'log_CEIR': all_d['log_CEIR'],
            'fear_greed_index': all_d['fear_greed_index'],
            'u_hat': all_d['u_hat'],
        }))
        rss_r2 = sm.OLS(all_d['ret_30d_forward'], X_r2).fit().ssr
        rss_u2 = m1.ssr + m2.ssr
        n2 = len(all_d)
        f2 = ((rss_r2 - rss_u2) / k) / (rss_u2 / (n2 - 2*k))
        p2 = 1 - stats.f.cdf(f2, k, n2 - 2*k)
        placebo_results.append({'date': pb_date.date(), 'F': f2, 'p': p2})
        marker = " ← ACTUAL BREAK" if abs((pb_date - CHINA_BAN).days) < 30 else ""
        print(f"  {pb_date.date()}  F={f2:.3f}  p={p2:.4f}{marker}")
    except Exception as e:
        pass

# ──────────────────────────────────────────────────────────────────────────────
# 7. BLOCK BOOTSTRAP VALIDATION (2000 reps, block=8 weeks)
# ──────────────────────────────────────────────────────────────────────────────
print("\n" + "─" * 60)
print("BLOCK BOOTSTRAP — 2000 REPLICATIONS, BLOCK SIZE = 8 WEEKS")
print("─" * 60)

def bootstrap_coef(data, n_reps=2000, block_size=8, seed=42):
    rng = np.random.default_rng(seed)
    d = data.copy().reset_index(drop=True)
    ar = sm.OLS(
        d['log_CEIR'].iloc[1:].values,
        sm.add_constant(d['log_CEIR'].iloc[:-1].values)
    ).fit()
    d['u_hat'] = np.nan
    d.loc[1:, 'u_hat'] = ar.resid
    d = d.dropna(subset=['u_hat', 'ret_30d_forward', 'fear_greed_index']).reset_index(drop=True)
    n = len(d)
    coefs = []
    starts = list(range(0, n - block_size + 1))
    for _ in range(n_reps):
        idxs = []
        while len(idxs) < n:
            s = rng.choice(starts)
            idxs.extend(range(s, min(s + block_size, n)))
        idxs = idxs[:n]
        b_data = d.iloc[idxs].reset_index(drop=True)
        try:
            X = sm.add_constant(pd.DataFrame({
                'log_CEIR': b_data['log_CEIR'],
                'fear_greed_index': b_data['fear_greed_index'],
                'u_hat': b_data['u_hat'],
            }))
            m = sm.OLS(b_data['ret_30d_forward'], X).fit()
            coefs.append(m.params['log_CEIR'])
        except:
            pass
    return np.array(coefs)

boot_pre = bootstrap_coef(pre, n_reps=2000, block_size=8)
boot_post = bootstrap_coef(post, n_reps=2000, block_size=8)

print(f"\n  Pre-ban bootstrap:  mean β = {boot_pre.mean():.3f}  "
      f"95% CI = [{np.percentile(boot_pre,2.5):.3f}, {np.percentile(boot_pre,97.5):.3f}]  "
      f"p(β<0) = {(boot_pre < 0).mean():.3f}")
print(f"  Post-ban bootstrap: mean β = {boot_post.mean():.3f}  "
      f"95% CI = [{np.percentile(boot_post,2.5):.3f}, {np.percentile(boot_post,97.5):.3f}]  "
      f"p(β<0) = {(boot_post < 0).mean():.3f}")

# ──────────────────────────────────────────────────────────────────────────────
# 8. ETH MERGE — PARALLEL TRENDS + MULTIPLE-WINDOW DiD
# ──────────────────────────────────────────────────────────────────────────────
print("\n" + "─" * 60)
print("TABLE 2.5 — ETH MERGE DiD (MULTIPLE WINDOWS)")
print("─" * 60)

# Load ETH price and energy
eth_price = pd.read_csv('eth_ds_parsed.csv')
eth_price.columns = [c.strip() for c in eth_price.columns]
eth_price['Date'] = pd.to_datetime(eth_price['Exchange Date'], dayfirst=True, errors='coerce')
eth_price = eth_price.dropna(subset=['Date'])
eth_price['Bid'] = pd.to_numeric(eth_price['Bid'].astype(str).str.replace(',',''), errors='coerce')
eth_price = eth_price[['Date','Bid']].rename(columns={'Bid':'eth_price'}).sort_values('Date')

eth_con = pd.read_csv('eth_con.csv')
eth_con['Date'] = pd.to_datetime(eth_con['DateTime'])
eth_con = eth_con[['Date','Estimated TWh per Year']].rename(columns={'Estimated TWh per Year':'eth_twh'})

btc_price = df[['Date','Price']].rename(columns={'Price':'btc_price'})

# Merge all
merge = eth_price.merge(eth_con, on='Date', how='inner')
merge = merge.merge(btc_price, on='Date', how='inner')
merge = merge.sort_values('Date').reset_index(drop=True)

# Compute 30-day rolling volatility for each
merge['eth_ret'] = merge['eth_price'].pct_change()
merge['btc_ret'] = merge['btc_price'].pct_change()
merge['eth_vol'] = merge['eth_ret'].rolling(30).std() * np.sqrt(252) * 100
merge['btc_vol'] = merge['btc_ret'].rolling(30).std() * np.sqrt(252) * 100
merge = merge.dropna(subset=['eth_vol','btc_vol'])

# ── Table 2.5: multiple windows ──
windows = [
    ("180-day symmetric", ETH_MERGE - pd.Timedelta(days=180), ETH_MERGE + pd.Timedelta(days=180)),
    ("Pre-anticipation (t-210 to t-90)", ETH_MERGE - pd.Timedelta(days=210), ETH_MERGE - pd.Timedelta(days=90)),
    ("Placebo (6 months early)", ETH_MERGE - pd.Timedelta(days=365), ETH_MERGE - pd.Timedelta(days=185)),
]

print(f"\n  {'Pre-Period':<35} {'Pre-Gap (ETH−BTC)':<22} {'DiD Estimate':<15} Note")
print("  " + "─" * 85)

for label, w_start, w_end in windows:
    w = merge[(merge['Date'] >= w_start) & (merge['Date'] <= w_end)].copy()
    if len(w) < 60:
        print(f"  {label:<35} insufficient data")
        continue
    is_post = (w['Date'] >= ETH_MERGE if 'Placebo' not in label
               else w['Date'] >= ETH_MERGE - pd.Timedelta(days=185))

    gap_pre   = (w.loc[~is_post, 'eth_vol'] - w.loc[~is_post, 'btc_vol']).mean()
    gap_post  = (w.loc[ is_post, 'eth_vol'] - w.loc[ is_post, 'btc_vol']).mean()
    did_est   = gap_post - gap_pre

    # OLS DiD
    long_pre  = pd.concat([
        pd.DataFrame({'vol': w.loc[~is_post,'eth_vol'].values, 'eth':1, 'post':0}),
        pd.DataFrame({'vol': w.loc[~is_post,'btc_vol'].values, 'eth':0, 'post':0}),
    ])
    long_post = pd.concat([
        pd.DataFrame({'vol': w.loc[ is_post,'eth_vol'].values, 'eth':1, 'post':1}),
        pd.DataFrame({'vol': w.loc[ is_post,'btc_vol'].values, 'eth':0, 'post':1}),
    ])
    long = pd.concat([long_pre, long_post]).reset_index(drop=True)
    try:
        m = smf.ols('vol ~ eth + post + eth:post', data=long).fit(cov_type='HC1')
        did_coef = m.params.get('eth:post', np.nan)
        did_p    = m.pvalues.get('eth:post', np.nan)
        note = f"β₃={did_coef:.1f}pp (p={did_p:.3f})"
    except:
        note = f"gap diff={did_est:.1f}pp"

    print(f"  {label:<35} {gap_pre:+.1f} pp{'':<14} {did_est:+.1f} pp{'':<6} {note}")

# Parallel trends: monthly ETH-BTC gap in 7 months before merge
print(f"\n  Monthly ETH−BTC volatility gap (pre-merge anticipation check):")
for months_back in range(7, 0, -1):
    start = ETH_MERGE - pd.Timedelta(days=30*months_back)
    end   = ETH_MERGE - pd.Timedelta(days=30*(months_back-1))
    w = merge[(merge['Date'] >= start) & (merge['Date'] < end)]
    if len(w) > 0:
        gap = (w['eth_vol'] - w['btc_vol']).mean()
        print(f"    t−{months_back} months: ETH−BTC gap = {gap:.1f} pp")

# ──────────────────────────────────────────────────────────────────────────────
# 9. SUMMARY TABLE FOR THESIS
# ──────────────────────────────────────────────────────────────────────────────
print("\n" + "=" * 70)
print("THESIS NUMBERS SUMMARY")
print("=" * 70)
print(f"\nAR(1) ρ̂ on log(CEIR)  = {rho_hat:.3f}")
print(f"\nPre-ban  (N={len(pre_clean)}): β = {b_pre:.3f}  SE = {se_pre:.3f}  p = {p_pre:.4f}")
print(f"  1SD effect = {abs(b_pre)*pre_clean['log_CEIR'].std()*100:.1f} pp")
print(f"\nPost-ban (N={len(post_clean)}): β = {b_post:.3f}  SE = {se_post:.3f}  p = {p_post:.4f}")
print(f"  1SD effect = {abs(b_post)*post_clean['log_CEIR'].std()*100:.1f} pp")
print(f"\nChow F = {chow_f:.3f}   p = {chow_p:.4f}")
print(f"\nBootstrap pre-ban  95% CI: [{np.percentile(boot_pre,2.5):.3f}, {np.percentile(boot_pre,97.5):.3f}]")
print(f"Bootstrap post-ban 95% CI: [{np.percentile(boot_post,2.5):.3f}, {np.percentile(boot_post,97.5):.3f}]")

# Save results
results = {
    'rho_hat': rho_hat,
    'pre_ban_N': len(pre_clean),
    'post_ban_N': len(post_clean),
    'pre_ban_beta': b_pre,
    'pre_ban_se': se_pre,
    'pre_ban_p': p_pre,
    'pre_ban_1sd_effect_pp': abs(b_pre)*pre_clean['log_CEIR'].std()*100,
    'post_ban_beta': b_post,
    'post_ban_se': se_post,
    'post_ban_p': p_post,
    'post_ban_1sd_effect_pp': abs(b_post)*post_clean['log_CEIR'].std()*100,
    'chow_F': chow_f,
    'chow_p': chow_p,
    'boot_pre_ci_low': np.percentile(boot_pre, 2.5),
    'boot_pre_ci_high': np.percentile(boot_pre, 97.5),
    'boot_post_ci_low': np.percentile(boot_post, 2.5),
    'boot_post_ci_high': np.percentile(boot_post, 97.5),
}
pd.DataFrame([results]).to_csv('ah_regression_results.csv', index=False)
print("\n✓ Results saved to ah_regression_results.csv")
