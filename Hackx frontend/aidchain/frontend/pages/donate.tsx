import React, { useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import { getProviderAndContract } from '../lib/ethers';
import { ethers } from 'ethers';

export default function Donate() {
  const [purpose, setPurpose] = useState('Emergency food and shelter');
  const [amount, setAmount] = useState('0.01');
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('Connecting to wallet...');
    try {
      const { contract } = await getProviderAndContract();
      setStatus('Sending transaction...');
      const value = ethers.parseEther(amount);
      const tx = await contract.makeDonation(purpose, { value });
      setStatus(`Pending: ${tx.hash}`);
      await tx.wait();
      setStatus(`Confirmed: ${tx.hash}`);

      // Report to backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        const donorAddr = accounts ? accounts[0] : null;
        await fetch(`${apiUrl}/api/donation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ txHash: tx.hash, donorAddr, purpose, amount }),
        });
      } catch (e) {
        console.warn('Backend report failed', e);
      }

    } catch (err: any) {
      console.error(err);
      setStatus('Error: ' + (err?.message || 'Unknown'));
    }
  }

  return (
    <div className="min-h-screen bg-teal-50">
      <Head>
        <title>Donate — AidChain</title>
      </Head>
      <Navbar />

      <main className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-2xl font-semibold text-teal-700">Create Donation</h2>
          <p className="text-sm text-gray-600 mt-1">Your donation will be recorded on-chain and metadata saved off-chain.</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm text-gray-700">Purpose</label>
              <input value={purpose} onChange={(e) => setPurpose(e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Amount (ETH)</label>
              <input value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>

            <div>
              <button className="bg-green-600 text-white px-4 py-2 rounded">Donate</button>
            </div>
          </form>

          {status && <div className="mt-4 text-sm text-gray-700">{status}</div>}
        </div>
      </main>
    </div>
  );
}
