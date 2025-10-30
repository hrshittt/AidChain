"use client";
import React, { useState } from 'react';
import Navbar from '../../../components/Navbar';

export default function RecipientConfirmPage() {
  const [code, setCode] = useState('');
  const [issue, setIssue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      setConfirmed(true);
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
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="max-w-xl mx-auto px-8 py-10">
          <h1 className="text-3xl font-bold text-teal-700 mb-2">Confirm Aid Receipt</h1>
          <p className="text-black/80 mb-6">Enter your delivery code and report any issues.</p>
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Delivery Code</label>
              <input className="w-full px-3 py-2 rounded border text-black bg-white" value={code} onChange={e => setCode(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Issues / Disputes (optional)</label>
              <textarea className="w-full px-3 py-2 rounded border text-black bg-white" rows={4} value={issue} onChange={e => setIssue(e.target.value)} placeholder="Describe any problems or missing items" />
            </div>
            <button type="submit" disabled={submitting} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 text-sm font-semibold disabled:opacity-60">{submitting ? 'Submitting...' : 'Confirm Receipt'}</button>
            {confirmed && (
              <div className="text-green-700 font-semibold">Thank you. Your confirmation has been recorded.</div>
            )}
          </form>
        </main>
      </div>
    </div>
  );
}


