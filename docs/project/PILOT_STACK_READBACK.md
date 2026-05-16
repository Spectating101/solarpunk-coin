# SolarPunk Pilot Stack Readback

No persistent-network pilot-stack readback has been generated in this repo snapshot.

`scripts/read_pilot_stack.js` is available and tested at the helper level. Run it after deploying the pilot stack to Sepolia or to a persistent local node:

```bash
PILOT_STACK_RECEIPT=state/deployments/sepolia_pilot_stack.json PILOT_NETWORK=sepolia npm run pilot-stack:readback
```

Do not treat a standalone Hardhat readback as persistent evidence: each `hardhat run` starts a fresh in-memory chain unless connected to a long-running node.
