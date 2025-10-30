"use client";
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from '../../../components/Navbar';
import Link from 'next/link';

type Donation = {
  _id: string;
  txHash: string;
  donorAddr: string;
  purpose: string;
  amount: string;
  createdAt: string;
};

export default function NGODashboard() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(false);
  const [myAddress, setMyAddress] = useState<string | null>(null);
  const [onlyAssigned, setOnlyAssigned] = useState(false);

  async function fetchDonations(addr?: string) {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const q = addr && onlyAssigned ? `?assignedTo=${encodeURIComponent(addr)}` : '';
      const res = await fetch(`${apiUrl}/api/donation${q}`);
      const json = await res.json();
      if (json.success) setDonations(json.donations || []);
    } catch (e) {
      console.error('Failed to load donations', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDonations();
  }, []);

  useEffect(() => {
    if (myAddress && onlyAssigned) fetchDonations(myAddress);
  }, [myAddress, onlyAssigned]);

  async function connectAndLoad() {
    if (!(window as any).ethereum) {
      alert('No web3 provider found');
      return;
    }
    try {
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      setMyAddress(accounts[0]);
    } catch (e) {
      console.warn('Wallet connect failed', e);
    }
  }

  async function assignToMe(txHash: string) {
    if (!myAddress) {
      await connectAndLoad();
      if (!myAddress) return alert('Wallet required to assign');
    }
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/donation/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txHash, assignedTo: myAddress }),
      });
      const json = await res.json();
      if (json.success) {
        // refresh list
        fetchDonations(myAddress);
      } else {
        alert('Assign failed: ' + (json.error || 'unknown'));
      }
    } catch (e) {
      console.error('Assign error', e);
      alert('Assign error');
    }
  }

  return (
    <div className="min-h-screen bg-teal-50">
      <Head>
        <title>NGO Dashboard — AidChain</title>
      </Head>
      <Navbar />

      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-semibold text-teal-700">NGO Dashboard</h1>
        <p className="text-sm text-gray-600">List of recent donations / batches assigned to NGOs (mocked by donations list).</p>

        <div className="mt-6 bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <button onClick={connectAndLoad} className="text-sm px-3 py-1 border rounded">Connect Wallet</button>
              <label className="text-sm text-gray-600">Show only assigned to me</label>
              <input type="checkbox" checked={onlyAssigned} onChange={(e) => setOnlyAssigned(e.target.checked)} />
            </div>
            <div className="text-sm text-gray-500">Address: {myAddress ?? 'Not connected'}</div>
          </div>

          {loading && <div>Loading...</div>}
          {!loading && donations.length === 0 && <div className="text-sm text-gray-500">No donations yet.</div>}

          <ul className="mt-3 space-y-3">
            {donations.map((d) => (
              <li key={d._id} className="border rounded p-3 flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium">{d.purpose}</div>
                  <div className="text-xs text-gray-600">Amount: {d.amount} | Donor: {d.donorAddr}</div>
                  <div className="text-xs text-gray-500 mt-1">Tx: <a className="text-blue-600" href={`${process.env.NEXT_PUBLIC_EXPLORER || 'https://mumbai.polygonscan.com/tx/'}${d.txHash}`} target="_blank" rel="noreferrer">{d.txHash}</a></div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <Link href={`/verify/${encodeURIComponent(d.txHash)}`} className="text-sm text-teal-700 underline">Verify</Link>
                  <Link href={`/field/upload?batchId=${encodeURIComponent(d.txHash)}`} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Upload Evidence</Link>
                  <button onClick={() => assignToMe(d.txHash)} className="text-sm px-2 py-1 border rounded">Assign to me</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
