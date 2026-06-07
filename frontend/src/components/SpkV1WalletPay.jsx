import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Coins, ExternalLink, Send } from 'lucide-react';
import SPK_ABI from '../abi/SolarPunkCoin.json';
import CURRENCY_ABI from '../abi/SolarPunkCurrencySystem.json';
import { SEPOLIA_EXPLORER } from '../constants/contracts';

const PRESET_PAYEES = [
  { id: 'merchant', label: 'Merchant (goods)', address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', kind: 'GOODS' },
  { id: 'gateway', label: 'Gateway (service)', address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', kind: 'SERVICE' },
  { id: 'maintenance', label: 'Maintenance (labor)', address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906', kind: 'LABOR' },
];

export default function SpkV1WalletPay({ provider, signer, account, runtime }) {
  const [balance, setBalance] = useState(null);
  const [amount, setAmount] = useState('5');
  const [payeeId, setPayeeId] = useState('merchant');
  const [status, setStatus] = useState({ state: 'idle', message: null, txHash: null });

  const spkAddress = runtime?.contracts?.solar_punk_coin;
  const currencyAddress = runtime?.contracts?.currency_system;
  const payee = PRESET_PAYEES.find((p) => p.id === payeeId) || PRESET_PAYEES[0];

  useEffect(() => {
    if (!provider || !account || !spkAddress) return;
    let cancelled = false;
    const spk = new ethers.Contract(spkAddress, SPK_ABI, provider);
    spk.balanceOf(account).then((value) => {
      if (!cancelled) setBalance(Number(ethers.formatEther(value)));
    }).catch(() => {
      if (!cancelled) setBalance(null);
    });
    return () => { cancelled = true; };
  }, [provider, account, spkAddress, status.state]);

  const pay = async () => {
    if (!signer || !spkAddress || !currencyAddress) return;
    setStatus({ state: 'pending', message: 'Confirm in wallet…', txHash: null });
    try {
      const spk = new ethers.Contract(spkAddress, SPK_ABI, signer);
      const currency = new ethers.Contract(currencyAddress, CURRENCY_ABI, signer);
      const parsed = ethers.parseEther(amount);
      const invoiceHash = ethers.id(`spk-v1:wallet:${Date.now()}:${payee.id}`);
      const kind = ethers.id(payee.kind);
      await (await spk.approve(currencyAddress, parsed)).wait();
      const tx = await currency.settleNetworkPayment(payee.address, parsed, invoiceHash, kind);
      const receipt = await tx.wait();
      setStatus({ state: 'ok', message: `Paid ${amount} SPK (${payee.kind})`, txHash: receipt.hash });
    } catch (error) {
      setStatus({ state: 'error', message: error.shortMessage || error.message, txHash: null });
    }
  };

  if (!account) {
    return (
      <div className="proof-panel">
        <h2>Wallet payments</h2>
        <p className="muted">Connect wallet to settle a network payment on the live SPK v1 stack.</p>
      </div>
    );
  }

  return (
    <div className="proof-panel">
      <h2><Send size={16} /> Wallet network payment</h2>
      <p>Pay SPK on Sepolia via <code>settleNetworkPayment</code> — circulation-first money path.</p>
      <div className="system-grid">
        <span>Your SPK</span><strong>{balance != null ? `${balance.toFixed(4)} SPK` : '…'}</strong>
        <span>CurrencySystem</span>
        <strong>
          <a href={`${SEPOLIA_EXPLORER}/address/${currencyAddress}`} target="_blank" rel="noreferrer">
            {currencyAddress?.slice(0, 10)}… <ExternalLink size={12} />
          </a>
        </strong>
      </div>
      <div className="launch-mode-grid" style={{ marginTop: '1rem' }}>
        <label>
          Amount (SPK)
          <input type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <label>
          Payee
          <select value={payeeId} onChange={(e) => setPayeeId(e.target.value)}>
            {PRESET_PAYEES.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </label>
      </div>
      <button className="wallet-button" type="button" onClick={pay} disabled={status.state === 'pending'} style={{ marginTop: '1rem' }}>
        <Coins size={16} /> {status.state === 'pending' ? 'Waiting…' : 'Settle payment'}
      </button>
      {status.message ? (
        <p className={status.state === 'error' ? 'muted' : ''}>
          {status.message}
          {status.txHash ? (
            <>
              {' '}
              <a href={`${SEPOLIA_EXPLORER}/tx/${status.txHash}`} target="_blank" rel="noreferrer">
                tx <ExternalLink size={12} />
              </a>
            </>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
