"use client";
import React, { useMemo, useState } from 'react';
import Navbar from '../../../components/Navbar';
import { useParams, useRouter } from 'next/navigation';

export default function DonateToNgoPage() {
  const params = useParams<{ ngoId: string }>();
  const router = useRouter();
  const ngoId = params?.ngoId ?? '';
  const [amount, setAmount] = useState('');
  const [cause, setCause] = useState('General Relief');
  const [paymentMethod, setPaymentMethod] = useState('Crypto');
  const [nameOnCard, setNameOnCard] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const ngoName = useMemo(() => {
    const map: Record<string, string> = {
      'hope-relief': 'HopeRelief',
      'aid-route': 'AidRoute',
      'green-hope': 'GreenHope',
      'earthquake-aid': 'EarthquakeAid',
      'medic-bridge': 'MedicBridge',
      'rebuild-together': 'RebuildTogether',
    };
    return map[ngoId] ?? ngoId;
  }, [ngoId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Placeholder: simulate blockchain tx and return a fake hash
      await new Promise(r => setTimeout(r, 1000));
      const fake = '0x' + Math.random().toString(16).slice(2).padEnd(64, '0');
      setTxHash(fake);
    } finally {
      setSubmitting(false);
    }
  }

  if (txHash) {
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
            <div className="bg-white rounded-xl shadow p-6">
              <h1 className="text-2xl font-bold text-teal-700 mb-2">Donation Confirmed</h1>
              <div className="text-black mb-4">Thank you for supporting {ngoName}.</div>
              <div className="text-sm text-black">Blockchain transaction hash</div>
              <div className="font-mono break-all text-black bg-gray-100 rounded p-3 mt-1">{txHash}</div>
              <div className="flex gap-3 mt-6">
                <a href="/tracking" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 text-sm font-semibold">View Tracking</a>
                <button onClick={() => router.push('/donate')} className="px-4 py-2 rounded border border-green-600 text-green-600 hover:bg-green-50 text-sm font-semibold">Donate More</button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex">
      <aside className="w-64 bg-white shadow-lg flex flex-col py-8 px-4 min-h-screen">
        <h2 className="text-2xl font-bold text-teal-700 mb-8">AidChain</h2>
        <nav className="flex flex-col gap-4">
          <a className="text-left px-4 py-2 rounded hover:bg-teal-50 font-semibold text-black" href="/">Home</a>
          <a className="text-left px-4 py-2 rounded hover:bg-teal-50 font-semibold text-black" href="/donate">Back to NGOs</a>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="max-w-2xl mx-auto px-8 py-10">
          <h1 className="text-3xl font-bold text-teal-700 mb-2">Donate to {ngoName}</h1>
          <p className="text-black/80 mb-6">Support the cause with a secure contribution.</p>
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Amount (ETH)</label>
              <input
                className="w-full px-3 py-2 rounded border text-black bg-white"
                placeholder="e.g., 0.25"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Cause</label>
              <select className="w-full px-3 py-2 rounded border text-black bg-white" value={cause} onChange={e => setCause(e.target.value)}>
                <option>General Relief</option>
                <option>Food & Water</option>
                <option>Medical</option>
                <option>Shelter</option>
                <option>Reconstruction</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Payment Method</label>
              <select className="w-full px-3 py-2 rounded border text-black bg-white" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                <option>Crypto</option>
                <option>Card</option>
              </select>
            </div>

            {paymentMethod === 'Card' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-black mb-1">Name on Card</label>
                  <input className="w-full px-3 py-2 rounded border text-black bg-white" value={nameOnCard} onChange={e => setNameOnCard(e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-black mb-1">Card Number</label>
                  <input className="w-full px-3 py-2 rounded border text-black bg-white" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">Expiry</label>
                  <input className="w-full px-3 py-2 rounded border text-black bg-white" placeholder="MM/YY" value={expiry} onChange={e => setExpiry(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-1">CVC</label>
                  <input className="w-full px-3 py-2 rounded border text-black bg-white" value={cvc} onChange={e => setCvc(e.target.value)} />
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button type="submit" disabled={submitting} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 text-sm font-semibold disabled:opacity-60">
                {submitting ? 'Processing...' : 'Donate'}
              </button>
              <button type="button" onClick={() => router.back()} className="px-4 py-2 rounded border border-green-600 text-green-600 hover:bg-green-50 text-sm font-semibold">Cancel</button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}


