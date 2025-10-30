"use client";
import React, { useState } from 'react';
import Navbar from '../../../components/Navbar';

export default function MilestoneVerificationPage() {
  const [milestoneId, setMilestoneId] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [gps, setGps] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  async function connectWallet() {
    setConnecting(true);
    try {
      // Placeholder wallet connect
      await new Promise(r => setTimeout(r, 600));
      alert('Wallet connected (mock)');
    } finally {
      setConnecting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Placeholder: upload proof and trigger verification tx
      await new Promise(r => setTimeout(r, 1000));
      const fake = '0x' + Math.random().toString(16).slice(2).padEnd(64, '0');
      setTxHash(fake);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex">
      <aside className="w-64 bg-white shadow-lg flex flex-col py-8 px-4 min-h-screen">
        <h2 className="text-2xl font-bold text-teal-700 mb-8">AidChain</h2>
        <nav className="flex flex-col gap-4">
          <a className="text-left px-4 py-2 rounded hover:bg-teal-50 font-semibold text-black" href="/">Home</a>
          <a className="text-left px-4 py-2 rounded hover:bg-teal-50 font-semibold text-black" href="/tracking">Tracking</a>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="max-w-2xl mx-auto px-8 py-10">
          <h1 className="text-3xl font-bold text-teal-700 mb-2">Milestone Verification</h1>
          <p className="text-black/80 mb-6">NGOs/Admins can verify milestones with proof.</p>
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Milestone ID</label>
              <input className="w-full px-3 py-2 rounded border text-black bg-white" value={milestoneId} onChange={e => setMilestoneId(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Upload Proof (photos/videos)</label>
              <input type="file" multiple onChange={e => setFiles(e.target.files)} className="w-full text-black" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">GPS Coordinates</label>
              <input className="w-full px-3 py-2 rounded border text-black bg-white" placeholder="lat, lng" value={gps} onChange={e => setGps(e.target.value)} />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={connectWallet} disabled={connecting} className="px-4 py-2 rounded border border-green-600 text-green-600 hover:bg-green-50 text-sm font-semibold disabled:opacity-60">{connecting ? 'Connecting...' : 'Connect Wallet'}</button>
              <button type="submit" disabled={submitting} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 text-sm font-semibold disabled:opacity-60">{submitting ? 'Verifying...' : 'Submit Verification'}</button>
            </div>
            {txHash && (
              <div className="mt-4">
                <div className="text-sm text-black">Blockchain transaction hash</div>
                <div className="font-mono break-all text-black bg-gray-100 rounded p-3 mt-1">{txHash}</div>
              </div>
            )}
          </form>
        </main>
      </div>
    </div>
  );
}


