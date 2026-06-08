from __future__ import annotations

import json
from importlib import resources
from typing import Any


def load_abi(contract_name: str) -> list[dict[str, Any]]:
    name = f"{contract_name}.json"
    with resources.files(__package__).joinpath(name).open(encoding="utf-8") as f:
        return json.load(f)
