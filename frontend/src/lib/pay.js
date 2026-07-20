import { ethers } from 'ethers';

/** Build a collision-resistant invoice hash for UI payments. */
export function buildUiInvoiceHash(payeeId) {
  const nonce = ethers.hexlify(ethers.randomBytes(16));
  return ethers.id(`spk-v1:ui:${Date.now()}:${nonce}:${payeeId}`);
}

export function paymentKindHash(role) {
  return ethers.id(role);
}

export async function sendNetworkPayment({
  signer,
  spkAddress,
  currencyAddress,
  spkAbi,
  currencyAbi,
  payeeAddress,
  amountSpk,
  payeeRole,
  payeeId,
  onStep,
}) {
  const spk = new ethers.Contract(spkAddress, spkAbi, signer);
  const currency = new ethers.Contract(currencyAddress, currencyAbi, signer);
  const wei = ethers.parseEther(String(amountSpk));
  const invoiceHash = buildUiInvoiceHash(payeeId);
  const kind = paymentKindHash(payeeRole);

  onStep?.('approve');
  const approveTx = await spk.approve(currencyAddress, wei);
  await approveTx.wait();

  onStep?.('settle');
  const tx = await currency.settleNetworkPayment(payeeAddress, wei, invoiceHash, kind);
  const receipt = await tx.wait();
  return { receipt, invoiceHash, kind };
}
