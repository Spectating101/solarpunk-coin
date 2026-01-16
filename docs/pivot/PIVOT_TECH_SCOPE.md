# PIVOT TECH SCOPE (ENERGY CREDIT + HEDGING)

## CORE COMPONENTS
- Oracle data ingestion: energy production + price indices
- Verification rules: surplus detection + normalization
- Credit issuance: minted only from verified surplus
- Settlement logic: hedges settle against oracle index
- Risk controls: staleness gating, quorum, deviation circuit breaker

## NON-GOALS (FOR PIVOT)
- No open-ended "stablecoin" claims
- No general-purpose currency framing
- No uncontrolled minting

## DATA SOURCES (EXAMPLES)
- Grid operator pricing indices
- Irradiance and production data
- Partner-provided telemetry

## INTEGRATION NOTES
- Polygon for execution and settlement
- Chainlink oracles for aggregation and delivery

## OUTPUTS
- Verified credit minting events
- Settlement reports
- Public dashboards for transparency
