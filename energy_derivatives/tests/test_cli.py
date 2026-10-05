import json
import pytest
from spk_derivatives.cli import main

ARGS = ["price", "--spot", "50", "--strike", "55", "--volatility", "0.35"]


def test_offline_price_cli(capsys):
    assert main(ARGS) == 0
    result = json.loads(capsys.readouterr().out)
    assert result["price"] > 0
    assert result["parameters"]["S0"] == 50


def test_monte_carlo_cli_is_reproducible(capsys):
    main(ARGS + ["--method", "monte-carlo"])
    first = json.loads(capsys.readouterr().out)
    main(ARGS + ["--method", "monte-carlo"])
    assert json.loads(capsys.readouterr().out) == first
    assert first["ci_95"][0] <= first["price"] <= first["ci_95"][1]


@pytest.mark.parametrize("extra", [["--steps", "10001"], ["--spot", "nan"], ["--volatility", "-1"]])
def test_cli_rejects_invalid_inputs(extra):
    with pytest.raises(SystemExit) as exc:
        main(ARGS + extra)
    assert exc.value.code == 2
