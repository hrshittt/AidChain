"use client";
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { shortenAddress } from '../utils/shorten';

// Minimal navbar with wallet connect and role selector
export default function Navbar() {
  const [address, setAddress] = useState<string | null>(null);
  const [role, setRole] = useState('Donor');
    const router = useRouter();
  useEffect(() => {
    // If a wallet was connected earlier, show it (best-effort)
    if ((window as any).ethereum && (window as any).ethereum.selectedAddress) {
      setAddress((window as any).ethereum.selectedAddress);
    }
  }, []);

  async function connect() {
    if (!(window as any).ethereum) {
      alert('No Ethereum provider found. Install MetaMask.');
      return;
    }
    try {
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      setAddress(accounts[0]);
    } catch (err) {
      console.error('User rejected', err);
    }
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-semibold text-teal-600">AidChain</div>
          <div className="text-sm text-gray-600">Transparent disaster aid tracking</div>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
            aria-label="Select role"
          >
            <option>Donor</option>
            <option>NGO</option>
            <option>Field</option>
            <option>Auditor</option>
          </select>

          {address ? (
            <div className="text-sm text-gray-700 bg-green-100 px-3 py-1 rounded">{shortenAddress(address)}</div>
          ) : (
            <button onClick={connect} className="bg-teal-600 text-white px-3 py-1 rounded">
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
