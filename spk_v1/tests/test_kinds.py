from spk_v1.kinds import ZERO_HASH, kind_label
from web3 import Web3


def test_kind_label_known():
    service = Web3.keccak(text="SERVICE").to_0x_hex()
    assert kind_label(service) == "SERVICE"


def test_kind_label_invoice():
    assert kind_label(ZERO_HASH) == "INVOICE"
    assert kind_label(None) == "INVOICE"
