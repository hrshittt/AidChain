"use client";
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';

export default function SettingsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notifyDonation, setNotifyDonation] = useState(true);
  const [notifyMilestone, setNotifyMilestone] = useState(true);
  const [notifyDelivery, setNotifyDelivery] = useState(true);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      alert('Saved (mock)');
    } finally {
      setSaving(false);
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
        <main className="max-w-2xl mx-auto px-8 py-10">
          <h1 className="text-3xl font-bold text-teal-700 mb-6">Profile & Settings</h1>

          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-lg font-bold text-teal-700 mb-4">Profile</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Name</label>
                <input className="w-full px-3 py-2 rounded border text-black bg-white" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Email</label>
                <input className="w-full px-3 py-2 rounded border text-black bg-white" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-lg font-bold text-teal-700 mb-4">Notifications</h2>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 text-black">
                <input type="checkbox" checked={notifyDonation} onChange={e => setNotifyDonation(e.target.checked)} /> Donation confirmations
              </label>
              <label className="flex items-center gap-3 text-black">
                <input type="checkbox" checked={notifyMilestone} onChange={e => setNotifyMilestone(e.target.checked)} /> Milestone verifications
              </label>
              <label className="flex items-center gap-3 text-black">
                <input type="checkbox" checked={notifyDelivery} onChange={e => setNotifyDelivery(e.target.checked)} /> Aid delivery updates
              </label>
            </div>
          </div>

          <button onClick={save} disabled={saving} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 text-sm font-semibold disabled:opacity-60">
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </main>
      </div>
    </div>
  );
}


