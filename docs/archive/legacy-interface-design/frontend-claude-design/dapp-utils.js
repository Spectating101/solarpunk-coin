// SolarPunk Protocol — Pricing Engine + Real Data (JS port of spk-derivatives)

const SPKUtils = (() => {

  // ─── Binomial Tree ───────────────────────────────────────────────
  function binomialPrice(S0, K, T, r, sigma, N = 100, isCall = false, isAmerican = false) {
    if (T <= 0 || sigma <= 0 || N < 2 || S0 <= 0) return 0;
    const dt = T / N;
    const u = Math.exp(sigma * Math.sqrt(dt));
    const d = 1 / u;
    const disc = Math.exp(-r * dt);
    const p = (Math.exp(r * dt) - d) / (u - d);
    if (p < 0 || p > 1) return 0;

    let V = new Array(N + 1);
    for (let i = 0; i <= N; i++) {
      const S = S0 * Math.pow(u, N - i) * Math.pow(d, i);
      V[i] = isCall ? Math.max(S - K, 0) : Math.max(K - S, 0);
    }
    for (let j = N - 1; j >= 0; j--) {
      for (let i = 0; i <= j; i++) {
        const hold = disc * (p * V[i] + (1 - p) * V[i + 1]);
        if (isAmerican) {
          const S = S0 * Math.pow(u, j - i) * Math.pow(d, i);
          const ex = isCall ? Math.max(S - K, 0) : Math.max(K - S, 0);
          V[i] = Math.max(hold, ex);
        } else { V[i] = hold; }
      }
    }
    return V[0];
  }

  // ─── Monte Carlo ─────────────────────────────────────────────────
  function monteCarloPrice(S0, K, T, r, sigma, numPaths = 5000, isCall = false) {
    if (T <= 0 || sigma <= 0 || S0 <= 0) return { price: 0, low: 0, high: 0 };
    let sum = 0, sum2 = 0;
    const drift = (r - 0.5 * sigma * sigma) * T;
    const vol = sigma * Math.sqrt(T);
    for (let i = 0; i < numPaths; i++) {
      const u1 = Math.max(Math.random(), 1e-10);
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * Math.random());
      const ST = S0 * Math.exp(drift + vol * z);
      const pf = isCall ? Math.max(ST - K, 0) : Math.max(K - ST, 0);
      sum += pf; sum2 += pf * pf;
    }
    const disc = Math.exp(-r * T);
    const mean = sum / numPaths;
    const variance = sum2 / numPaths - mean * mean;
    const stdErr = Math.sqrt(variance / numPaths);
    const price = mean * disc;
    const ci = 1.96 * stdErr * disc;
    return { price, low: Math.max(0, price - ci), high: price + ci };
  }

  // ─── Greeks ──────────────────────────────────────────────────────
  function computeGreeks(S0, K, T, r, sigma, N = 100, isCall = false) {
    const h = S0 * 0.01;
    const price = binomialPrice(S0, K, T, r, sigma, N, isCall);
    const pUp   = binomialPrice(S0 + h, K, T, r, sigma, N, isCall);
    const pDown = binomialPrice(S0 - h, K, T, r, sigma, N, isCall);
    const delta = (pUp - pDown) / (2 * h);
    const gamma = (pUp - 2 * price + pDown) / (h * h);
    const dSig  = Math.max(sigma * 0.01, 0.001);
    const vega  = (binomialPrice(S0, K, T, r, sigma + dSig, N, isCall) - price) / dSig;
    const dT    = Math.min(1 / 365, T * 0.5);
    const theta = T > dT ? (binomialPrice(S0, K, T - dT, r, sigma, N, isCall) - price) / dT : 0;
    const dr    = 0.001;
    const rho   = (binomialPrice(S0, K, T, r + dr, sigma, N, isCall) - price) / dr;
    return { price, delta, gamma, vega, theta, rho };
  }

  // ─── Stress Test ─────────────────────────────────────────────────
  function stressTest(S0, K, T, r, sigma, N = 50, isCall = false) {
    const vols    = [0.5, 0.8, 1.2, 1.6, 1.89, 2.2];
    const strikes = [K * 0.85, K * 0.9, K * 0.95, K, K * 1.05, K * 1.1];
    return {
      byVol:    vols.map(v    => ({ v, price: binomialPrice(S0, K, T, r, v,     N, isCall) })),
      byStrike: strikes.map(k => ({ k, price: binomialPrice(S0, k, T, r, sigma, N, isCall) })),
    };
  }

  // ─── Volatility from log returns (mirrors get_volatility_params) ─
  // If `dataWithDates` is provided (array of {date, ghi}), applies deseasonalization
  // by dividing each value by its month's mean — matches Python lib's deseason=True
  function computeVolatility(ghiSeries, dataWithDates = null) {
    const n = ghiSeries.length;
    if (n < 10) return 1.89;

    let series = ghiSeries;

    // Deseasonalize: divide each value by its month's mean
    if (dataWithDates && dataWithDates.length === n) {
      const monthSums   = Array(13).fill(0);
      const monthCounts = Array(13).fill(0);
      dataWithDates.forEach(d => {
        const m = parseInt(d.date.slice(5, 7), 10);
        if (m >= 1 && m <= 12 && d.ghi > 0) {
          monthSums[m] += d.ghi;
          monthCounts[m] += 1;
        }
      });
      const monthMeans = monthSums.map((s, i) => monthCounts[i] > 0 ? s / monthCounts[i] : 1);
      series = dataWithDates.map(d => {
        const m = parseInt(d.date.slice(5, 7), 10);
        return monthMeans[m] > 0 ? d.ghi / monthMeans[m] : 1;
      });
    }

    // Log returns
    const logReturns = [];
    for (let i = 1; i < series.length; i++) {
      if (series[i] > 0.01 && series[i - 1] > 0.01) {
        logReturns.push(Math.log(series[i] / series[i - 1]));
      }
    }
    if (logReturns.length < 5) return 1.89;

    const mean = logReturns.reduce((a, b) => a + b, 0) / logReturns.length;
    const variance = logReturns.reduce((a, b) => a + (b - mean) ** 2, 0) / (logReturns.length - 1);
    const sigma = Math.sqrt(variance) * Math.sqrt(365);
    return isFinite(sigma) && sigma > 0 ? sigma : 1.89;
  }

  // S0 from GHI: GHI (kWh/m²/day) × efficiency × energy_value
  function ghiToPrice(ghi, efficiency = 0.20, energyValue = 0.10) {
    return ghi * efficiency * energyValue;
  }

  // ─── Fetch real NASA POWER API data ──────────────────────────────
  // Mirrors data_loader_nasa.py: Taoyuan, Taiwan (24.99°N, 121.30°E)
  // Parameter: ALLSKY_SFC_SW_DWN (GHI in kWh/m²/day)
  async function fetchNASAData(lat = 24.99, lon = 121.30, startYear = 2022, endYear = 2024) {
    const url = new URL('https://power.larc.nasa.gov/api/temporal/daily/point');
    url.searchParams.set('parameters', 'ALLSKY_SFC_SW_DWN');
    url.searchParams.set('community', 'RE');
    url.searchParams.set('longitude', lon);
    url.searchParams.set('latitude', lat);
    url.searchParams.set('start', `${startYear}0101`);
    url.searchParams.set('end', `${endYear}1231`);
    url.searchParams.set('format', 'JSON');

    const resp = await fetch(url.toString());
    if (!resp.ok) throw new Error(`NASA API ${resp.status}`);
    const data = await resp.json();

    const raw = data?.properties?.parameter?.ALLSKY_SFC_SW_DWN;
    if (!raw) throw new Error('NASA: missing ALLSKY_SFC_SW_DWN');

    // Parse into [{date, ghi, price}] — filter missing (-999)
    const entries = Object.entries(raw)
      .filter(([, v]) => v > -900)
      .map(([dateStr, ghi]) => ({
        date: `${dateStr.slice(0,4)}-${dateStr.slice(4,6)}-${dateStr.slice(6,8)}`,
        ghi: +ghi.toFixed(3),
        price: +ghiToPrice(ghi).toFixed(5),
      }));

    return entries;
  }

  // ─── Oracle aggregation (from pillar3_engine.py) ─────────────────
  function weightedMedian(sources) {
    const sorted = [...sources].sort((a, b) => a.value - b.value);
    const total  = sorted.reduce((s, x) => s + x.weight, 0);
    let accum = 0;
    for (const { value, weight } of sorted) {
      accum += weight;
      if (accum >= total / 2) return value;
    }
    return sorted[sorted.length - 1].value;
  }

  // VaR payoff at 99th percentile shock (30% price drop)
  function var99Payoff(S0, K, T, r, sigma, notionalKwh, N = 60) {
    return binomialPrice(S0 * 0.7, K, T, r, sigma, N, false) * notionalKwh;
  }

  return {
    binomialPrice, monteCarloPrice, computeGreeks, stressTest,
    computeVolatility, ghiToPrice, fetchNASAData, weightedMedian, var99Payoff,
  };
})();
