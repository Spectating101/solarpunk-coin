"""
Comprehensive Test Suite - Energy Oracle
=========================================

Tests for:
- Energy proof validation
- Grid operator registration
- Smart meter verification
- Minting authorization
- Grid stress checks (Rule E)
- Energy surplus verification
"""

import pytest
from decimal import Decimal
import time

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from oracle.energy_oracle import (
    EnergyOracle, EnergyProof, GridOperator,
    EnergySource, MintingRequest, OracleParams
)


class TestOracleInitialization:
    """Test oracle initialization."""

    def test_oracle_creation(self):
        """Test oracle creates successfully."""
        oracle = EnergyOracle()

        assert oracle is not None
        assert len(oracle.trusted_meters) == 0
        assert len(oracle.grid_operators) == 0

    def test_oracle_params(self):
        """Test oracle parameters initialization."""
        oracle = EnergyOracle()

        assert oracle.alpha > 0
        assert oracle.params.grid_stress_threshold == Decimal('0.95')


class TestGridOperatorManagement:
    """Test grid operator registration."""

    def test_register_grid_operator(self):
        """Test registering grid operator."""
        oracle = EnergyOracle()

        success, msg = oracle.register_grid_operator(
            GridOperator.CAISO,
            "caiso_cert_hash_123"
        )

        assert success
        assert GridOperator.CAISO in oracle.grid_operators

    def test_register_duplicate_operator(self):
        """Test cannot register same operator twice."""
        oracle = EnergyOracle()

        oracle.register_grid_operator(GridOperator.TAIPOWER, "cert1")
        success, msg = oracle.register_grid_operator(GridOperator.TAIPOWER, "cert2")

        assert not success
        assert "already registered" in msg.lower()

    def test_multiple_operators(self):
        """Test registering multiple operators."""
        oracle = EnergyOracle()

        oracle.register_grid_operator(GridOperator.CAISO, "cert1")
        oracle.register_grid_operator(GridOperator.TAIPOWER, "cert2")
        oracle.register_grid_operator(GridOperator.ERCOT, "cert3")

        assert len(oracle.grid_operators) == 3


class TestTrustedMeterManagement:
    """Test trusted meter management."""

    def test_register_trusted_meter(self):
        """Test registering trusted meter."""
        oracle = EnergyOracle()

        success, msg = oracle.register_trusted_meter("METER_001")

        assert success
        assert "METER_001" in oracle.trusted_meters

    def test_register_duplicate_meter(self):
        """Test cannot register same meter twice."""
        oracle = EnergyOracle()

        oracle.register_trusted_meter("METER_001")
        success, msg = oracle.register_trusted_meter("METER_001")

        assert not success

    def test_multiple_meters(self):
        """Test registering multiple meters."""
        oracle = EnergyOracle()

        for i in range(5):
            oracle.register_trusted_meter(f"METER_{i:03d}")

        assert len(oracle.trusted_meters) == 5


class TestEnergyProofValidation:
    """Test energy proof validation."""

    def setup_method(self):
        """Setup oracle for each test."""
        self.oracle = EnergyOracle()
        self.oracle.register_grid_operator(GridOperator.TAIPOWER, "cert_123")
        self.oracle.register_trusted_meter("METER_YZU_001")

    def create_valid_proof(self):
        """Helper to create valid energy proof."""
        return EnergyProof(
            proof_id="proof_001",
            timestamp=time.time(),
            grid_operator=GridOperator.TAIPOWER,
            location="Yuan Ze University",
            source_type=EnergySource.SOLAR,
            surplus_kwh=Decimal('1500'),
            wholesale_price=Decimal('0.08'),
            grid_load=Decimal('0.70'),
            renewable_penetration=Decimal('0.35'),
            meter_signature="sig_" + "a1b2c3" * 10,
            meter_id="METER_YZU_001",
            operator_cert_hash="cert_123"
        )

    def test_validate_valid_proof(self):
        """Test valid proof passes validation."""
        proof = self.create_valid_proof()

        is_valid, error = self.oracle.validate_energy_proof(proof)

        assert is_valid
        assert error is None

    def test_reject_untrusted_meter(self):
        """Test reject proof from untrusted meter."""
        proof = self.create_valid_proof()
        proof.meter_id = "METER_UNTRUSTED"

        is_valid, error = self.oracle.validate_energy_proof(proof)

        assert not is_valid
        assert "trusted meter" in error.lower()

    def test_reject_unregistered_operator(self):
        """Test reject proof from unregistered operator."""
        proof = self.create_valid_proof()
        proof.grid_operator = GridOperator.PJM  # Not registered

        is_valid, error = self.oracle.validate_energy_proof(proof)

        assert not is_valid
        assert "grid operator" in error.lower()

    def test_reject_expired_proof(self):
        """Test reject expired proof."""
        proof = self.create_valid_proof()
        proof.timestamp = time.time() - (25 * 3600)  # 25 hours ago

        is_valid, error = self.oracle.validate_energy_proof(proof)

        assert not is_valid
        assert "expired" in error.lower()

    def test_reject_grid_stress(self):
        """Test reject proof during grid stress (Rule E)."""
        proof = self.create_valid_proof()
        proof.grid_load = Decimal('0.96')  # > 95% threshold

        is_valid, error = self.oracle.validate_energy_proof(proof)

        assert not is_valid
        assert "grid stress" in error.lower()

    def test_reject_negative_surplus(self):
        """Test reject proof with negative surplus."""
        proof = self.create_valid_proof()
        proof.surplus_kwh = Decimal('-100')

        is_valid, error = self.oracle.validate_energy_proof(proof)

        assert not is_valid

    def test_reject_zero_surplus(self):
        """Test reject proof with zero surplus."""
        proof = self.create_valid_proof()
        proof.surplus_kwh = Decimal('0')

        is_valid, error = self.oracle.validate_energy_proof(proof)

        assert not is_valid

    def test_different_energy_sources(self):
        """Test validation works for different energy sources."""
        for source in [EnergySource.SOLAR, EnergySource.WIND,
                      EnergySource.HYDRO, EnergySource.GEOTHERMAL]:
            proof = self.create_valid_proof()
            proof.source_type = source

            is_valid, error = self.oracle.validate_energy_proof(proof)

            assert is_valid


class TestMintingCalculation:
    """Test minting amount calculation."""

    def setup_method(self):
        """Setup oracle for each test."""
        self.oracle = EnergyOracle()
        self.oracle.register_grid_operator(GridOperator.TAIPOWER, "cert_123")
        self.oracle.register_trusted_meter("METER_YZU_001")

    def create_valid_proof(self, surplus_kwh=Decimal('1000')):
        """Helper to create valid energy proof."""
        return EnergyProof(
            proof_id="proof_001",
            timestamp=time.time(),
            grid_operator=GridOperator.TAIPOWER,
            location="Yuan Ze University",
            source_type=EnergySource.SOLAR,
            surplus_kwh=surplus_kwh,
            wholesale_price=Decimal('0.08'),
            grid_load=Decimal('0.70'),
            renewable_penetration=Decimal('0.35'),
            meter_signature="sig_abc",
            meter_id="METER_YZU_001",
            operator_cert_hash="cert_123"
        )

    def test_compute_minting_amount(self):
        """Test minting amount computation."""
        proof = self.create_valid_proof(surplus_kwh=Decimal('1000'))
        peg_price = Decimal('0.10')

        amount = self.oracle.compute_minting_amount(proof, peg_price)

        # Formula: alpha * surplus_kwh * peg_price
        # = 1.0 * 1000 * 0.10 = 100
        expected = Decimal('100')
        assert amount == expected

    def test_minting_proportional_to_surplus(self):
        """Test minting amount proportional to surplus."""
        peg_price = Decimal('0.10')

        proof_1000 = self.create_valid_proof(surplus_kwh=Decimal('1000'))
        proof_2000 = self.create_valid_proof(surplus_kwh=Decimal('2000'))

        amount_1000 = self.oracle.compute_minting_amount(proof_1000, peg_price)
        amount_2000 = self.oracle.compute_minting_amount(proof_2000, peg_price)

        assert amount_2000 == amount_1000 * 2

    def test_minting_with_different_peg_prices(self):
        """Test minting amount varies with peg price."""
        proof = self.create_valid_proof(surplus_kwh=Decimal('1000'))

        amount_low = self.oracle.compute_minting_amount(proof, Decimal('0.08'))
        amount_high = self.oracle.compute_minting_amount(proof, Decimal('0.12'))

        assert amount_high > amount_low


class TestMintingProcess:
    """Test complete minting process."""

    def setup_method(self):
        """Setup oracle for each test."""
        self.oracle = EnergyOracle()
        self.oracle.register_grid_operator(GridOperator.TAIPOWER, "cert_123")
        self.oracle.register_trusted_meter("METER_YZU_001")

    def create_valid_proof(self):
        """Helper to create valid energy proof."""
        return EnergyProof(
            proof_id="proof_001",
            timestamp=time.time(),
            grid_operator=GridOperator.TAIPOWER,
            location="Yuan Ze University",
            source_type=EnergySource.SOLAR,
            surplus_kwh=Decimal('1500'),
            wholesale_price=Decimal('0.08'),
            grid_load=Decimal('0.70'),
            renewable_penetration=Decimal('0.35'),
            meter_signature="sig_abc",
            meter_id="METER_YZU_001",
            operator_cert_hash="cert_123"
        )

    def test_process_valid_minting_request(self):
        """Test processing valid minting request."""
        proof = self.create_valid_proof()
        recipient = "SPKrecipient123"
        peg_price = Decimal('0.10')

        success, mint_req, msg = self.oracle.process_minting_request(
            proof=proof,
            recipient=recipient,
            peg_price=peg_price
        )

        assert success
        assert mint_req is not None
        assert mint_req.recipient == recipient
        assert mint_req.requested_amount > 0

    def test_reject_invalid_proof(self):
        """Test reject invalid proof."""
        proof = self.create_valid_proof()
        proof.meter_id = "METER_UNTRUSTED"

        success, mint_req, msg = self.oracle.process_minting_request(
            proof=proof,
            recipient="SPKaddr",
            peg_price=Decimal('0.10')
        )

        assert not success
        assert mint_req is None

    def test_minting_request_contains_proof_data(self):
        """Test minting request contains proof data."""
        proof = self.create_valid_proof()

        success, mint_req, msg = self.oracle.process_minting_request(
            proof=proof,
            recipient="SPKaddr",
            peg_price=Decimal('0.10')
        )

        assert success
        assert mint_req.energy_kwh == proof.surplus_kwh
        assert mint_req.proof_id == proof.proof_id

    def test_duplicate_proof_rejection(self):
        """Test cannot process same proof twice."""
        proof = self.create_valid_proof()

        # Process first time
        success1, _, _ = self.oracle.process_minting_request(
            proof=proof,
            recipient="SPKaddr",
            peg_price=Decimal('0.10')
        )

        # Try second time
        success2, _, msg2 = self.oracle.process_minting_request(
            proof=proof,
            recipient="SPKaddr",
            peg_price=Decimal('0.10')
        )

        assert success1
        assert not success2
        assert "already processed" in msg2.lower()


class TestOracleStatistics:
    """Test oracle statistics tracking."""

    def setup_method(self):
        """Setup oracle for each test."""
        self.oracle = EnergyOracle()
        self.oracle.register_grid_operator(GridOperator.TAIPOWER, "cert_123")
        self.oracle.register_trusted_meter("METER_YZU_001")

    def create_valid_proof(self, proof_id="proof_001"):
        """Helper to create valid energy proof."""
        return EnergyProof(
            proof_id=proof_id,
            timestamp=time.time(),
            grid_operator=GridOperator.TAIPOWER,
            location="Yuan Ze University",
            source_type=EnergySource.SOLAR,
            surplus_kwh=Decimal('1000'),
            wholesale_price=Decimal('0.08'),
            grid_load=Decimal('0.70'),
            renewable_penetration=Decimal('0.35'),
            meter_signature="sig_abc",
            meter_id="METER_YZU_001",
            operator_cert_hash="cert_123"
        )

    def test_get_oracle_stats(self):
        """Test oracle statistics retrieval."""
        stats = self.oracle.get_oracle_stats()

        assert 'total_proofs_verified' in stats
        assert 'total_energy_kwh' in stats
        assert 'total_spk_minted' in stats

    def test_stats_update_after_processing(self):
        """Test statistics update after processing proofs."""
        initial_stats = self.oracle.get_oracle_stats()
        initial_proofs = initial_stats['total_proofs_verified']

        proof = self.create_valid_proof()
        self.oracle.process_minting_request(
            proof=proof,
            recipient="SPKaddr",
            peg_price=Decimal('0.10')
        )

        new_stats = self.oracle.get_oracle_stats()
        assert new_stats['total_proofs_verified'] == initial_proofs + 1

    def test_energy_tracking(self):
        """Test total energy tracking."""
        proof1 = self.create_valid_proof("proof1")
        proof1.surplus_kwh = Decimal('1000')

        proof2 = self.create_valid_proof("proof2")
        proof2.surplus_kwh = Decimal('1500')

        self.oracle.process_minting_request(proof1, "SPKaddr", Decimal('0.10'))
        self.oracle.process_minting_request(proof2, "SPKaddr", Decimal('0.10'))

        stats = self.oracle.get_oracle_stats()
        assert stats['total_energy_kwh'] == Decimal('2500')


class TestGridStressSafeguard:
    """Test Rule E: Grid-Stress Safeguard."""

    def setup_method(self):
        """Setup oracle for each test."""
        self.oracle = EnergyOracle()
        self.oracle.register_grid_operator(GridOperator.TAIPOWER, "cert_123")
        self.oracle.register_trusted_meter("METER_YZU_001")

    def create_proof_with_load(self, grid_load):
        """Helper to create proof with specific grid load."""
        return EnergyProof(
            proof_id=f"proof_{grid_load}",
            timestamp=time.time(),
            grid_operator=GridOperator.TAIPOWER,
            location="Yuan Ze University",
            source_type=EnergySource.SOLAR,
            surplus_kwh=Decimal('1000'),
            wholesale_price=Decimal('0.08'),
            grid_load=grid_load,
            renewable_penetration=Decimal('0.35'),
            meter_signature="sig_abc",
            meter_id="METER_YZU_001",
            operator_cert_hash="cert_123"
        )

    def test_accept_normal_grid_load(self):
        """Test accept proof with normal grid load."""
        proof = self.create_proof_with_load(Decimal('0.70'))

        is_valid, error = self.oracle.validate_energy_proof(proof)

        assert is_valid

    def test_accept_at_threshold(self):
        """Test accept proof exactly at threshold."""
        proof = self.create_proof_with_load(Decimal('0.95'))

        is_valid, error = self.oracle.validate_energy_proof(proof)

        assert is_valid

    def test_reject_above_threshold(self):
        """Test reject proof above grid stress threshold."""
        proof = self.create_proof_with_load(Decimal('0.96'))

        is_valid, error = self.oracle.validate_energy_proof(proof)

        assert not is_valid
        assert "grid stress" in error.lower()

    def test_reject_full_grid(self):
        """Test reject proof at 100% grid load."""
        proof = self.create_proof_with_load(Decimal('1.00'))

        is_valid, error = self.oracle.validate_energy_proof(proof)

        assert not is_valid


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
