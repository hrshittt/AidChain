"use client";
import React, { useMemo, useState } from 'react';
import Navbar from '../../components/Navbar';

type FeedItem = { id: string; kind: 'donation' | 'distribution' | 'milestone'; title: string; sub: string; amountEth?: number; time: string };

const ALL: FeedItem[] = [
  { id: 'f1', kind: 'donation', title: '0xA1B2...C3D4 -> HopeRelief', sub: 'Donation recorded', amountEth: 0.7, time: '3m ago' },
  { id: 'f2', kind: 'distribution', title: 'AidRoute', sub: 'Boats deployed for logistics', amountEth: 0.2, time: '20m ago' },
  { id: 'f3', kind: 'milestone', title: 'GreenHope', sub: 'Milestone verified: 2,000 water packets', time: '1h ago' },
];

export default function TransparencyPage() {
  const [q, setQ] = useState('');
  const [kind, setKind] = useState<'all' | FeedItem['kind']>('all');
  const items = useMemo(() => ALL.filter(i => (kind==='all' || i.kind===kind) && (q==='' || i.title.toLowerCase().includes(q.toLowerCase()))), [q, kind]);

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
        <main className="max-w-6xl mx-auto px-8 py-10">
          <h1 className="text-3xl font-bold text-teal-700 mb-6">Public Transparency</h1>

          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input className="px-3 py-2 rounded border text-black bg-white" placeholder="Search transactions / milestones" value={q} onChange={e => setQ(e.target.value)} />
              <select className="px-3 py-2 rounded border text-black bg-white" value={kind} onChange={e => setKind(e.target.value as any)}>
                <option value="all">All</option>
                <option value="donation">Donations</option>
                <option value="distribution">Distributions</option>
                <option value="milestone">Milestones</option>
              </select>
              <div className="flex items-center text-black/70">Real-time feed (mock)</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold text-teal-700 mb-4">Feed</h2>
              <div className="flex flex-col divide-y">
                {items.map(i => (
                  <div key={i.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-black">{i.title}</div>
                      <div className="text-xs text-black/70">{i.sub}</div>
                    </div>
                    <div className="text-right">
                      {typeof i.amountEth === 'number' && (
                        <div className="text-sm font-semibold text-black">{i.amountEth.toFixed(2)} ETH</div>
                      )}
                      <div className="text-xs text-black/70">{i.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold text-teal-700 mb-4">Visualizations</h2>
              <div className="h-32 bg-gradient-to-tr from-green-200 to-green-50 rounded flex items-center justify-center text-black">Map / Chart</div>
              <div className="mt-4 h-24 bg-gradient-to-tr from-blue-200 to-blue-50 rounded flex items-center justify-center text-black">Bar / Pie</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


