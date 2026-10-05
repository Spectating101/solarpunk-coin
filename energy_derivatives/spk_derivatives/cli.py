"""Offline pricing command for the historical derivatives library."""

from __future__ import annotations

import argparse
import json
import math

from . import __version__
from .binomial import BinomialTree
from .monte_carlo import MonteCarloSimulator


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="spk-derivatives", description=__doc__)
    parser.add_argument("--version", action="version", version=__version__)
    commands = parser.add_subparsers(dest="command", required=True)
    price = commands.add_parser("price", help="Price a European option from declared parameters")
    price.add_argument("--spot", type=float, required=True)
    price.add_argument("--strike", type=float, required=True)
    price.add_argument("--volatility", type=float, required=True)
    price.add_argument("--years", type=float, default=1.0)
    price.add_argument("--rate", type=float, default=0.05)
    price.add_argument("--steps", type=int, default=100)
    price.add_argument("--method", choices=["binomial", "monte-carlo"], default="binomial")
    price.add_argument("--payoff", choices=["call", "put"], default="call")
    price.add_argument("--seed", type=int, default=0)
    args = parser.parse_args(argv)
    for name in ["spot", "strike", "volatility", "years", "rate"]:
        value = getattr(args, name)
        if not math.isfinite(value) or (name != "rate" and value <= 0):
            parser.error(f"--{name} must be finite" + (" and positive" if name != "rate" else ""))
    if not 10 <= args.steps <= 1000:
        parser.error("--steps must be between 10 and 1000")
    parameters = dict(
        S0=args.spot,
        K=args.strike,
        sigma=args.volatility,
        T=args.years,
        r=args.rate,
        payoff_type=args.payoff,
    )
    try:
        if args.method == "binomial":
            result = {"price": BinomialTree(**parameters, N=args.steps).price()}
        else:
            value, low, high = MonteCarloSimulator(
                **parameters, num_simulations=args.steps * 100, seed=args.seed
            ).confidence_interval()
            result = {"price": value, "ci_95": [low, high], "seed": args.seed}
        print(
            json.dumps({"model": args.method, **result, "parameters": parameters}, allow_nan=False)
        )
    except (ValueError, OverflowError) as exc:
        parser.error(str(exc))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
