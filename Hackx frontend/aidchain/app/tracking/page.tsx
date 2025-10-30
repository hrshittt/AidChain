"use client";
import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';

type Row = { id: string; ngo: string; allocationEth: number; stage: 'pending' | 'verified' | 'completed' | 'failed'; detail: string; updated: string };

function mapStatus(status: string) {
  // map backend status to display stages
  switch (status) {
    case 'initiated':
      return 'pending';
    case 'in-progress':
      return 'verified';
    case 'completed':
      return 'completed';
    case 'failed':
      return 'failed';
    default:
      return 'pending';
  }
}

function Badge({ stage }: { stage: Row['stage'] }) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    verified: 'bg-blue-100 text-blue-800 border-blue-300',
    completed: 'bg-green-100 text-green-800 border-green-300',
    failed: 'bg-red-100 text-red-800 border-red-300',
  };
  return <span className={`px-2 py-0.5 text-xs rounded border ${map[stage] || map.pending}`}>{stage}</span>;
}

export default function TrackingPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [onChainStatus, setOnChainStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Public endpoint added on backend to allow anonymous reads
        const res = await fetch('http://localhost:5000/api/transactions/public');
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        setOnChainStatus(data.onChainStatus || null);
        const list = (data.dbRecords || []).map((t: any) => {
          const ngoName = t.ngoId?.name || t.ngoId?.username || (t.ngoId && t.ngoId._id) || 'Unknown NGO';
          const amount = t.amount || 0;
          const status = mapStatus(t.status || 'initiated') as Row['stage'];
          const updated = t.updatedAt ? new Date(t.updatedAt).toLocaleString() : (t.createdAt ? new Date(t.createdAt).toLocaleString() : '');
          const detail = `${t.aidCategory || 'aid'}${t.type ? ' • ' + t.type : ''}`;
          return { id: t._id, ngo: ngoName, allocationEth: amount, stage: status, detail, updated } as Row;
        });
        // sort by createdAt desc if present
        list.sort((a, b) => 0);
        setRows(list);
      } catch (err: any) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
          <h1 className="text-3xl font-bold text-teal-700 mb-6">Aid Distribution Tracking</h1>

          {onChainStatus && <div className="mb-4 text-sm text-gray-600">On-chain status: <strong>{onChainStatus}</strong></div>}

          <div className="bg-white rounded-xl shadow p-6 mb-8 overflow-x-auto">
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div className="text-red-600">Error: {error}</div>
            ) : (
              <table className="w-full text-sm text-left text-black">
                <thead>
                  <tr>
                    <th>NGO</th>
                    <th>Allocation</th>
                    <th>Status</th>
                    <th>Detail</th>
                    <th>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r => (
                    <tr key={r.id} className="border-t">
                      <td className="py-3">{r.ngo}</td>
                      <td className="py-3">{r.allocationEth.toFixed(2)} ETH</td>
                      <td className="py-3"><Badge stage={r.stage as Row['stage']} /></td>
                      <td className="py-3">{r.detail}</td>
                      <td className="py-3">{r.updated}</td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr><td colSpan={5} className="py-6 text-center text-gray-600">No records found</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold text-teal-700 mb-4">Timeline</h2>
            <div className="relative pl-6">
              {rows.map((r) => (
                <div key={r.id} className="mb-4">
                  <div className="absolute left-1.5 h-full w-px bg-gray-300" style={{ top: 8 }} />
                  <div className={`w-3 h-3 rounded-full ${r.stage==='completed'?'bg-green-600':r.stage==='verified'?'bg-blue-600':r.stage==='failed'?'bg-red-600':'bg-yellow-600'} absolute left-0`} style={{ marginTop: 6 }} />
                  <div className="ml-4 text-sm text-black">
                    <div className="font-semibold">{r.ngo} • {r.detail}</div>
                    <div className="text-black/70">{r.updated} • {r.allocationEth.toFixed(2)} ETH</div>
                  </div>
                </div>
              ))}
              {rows.length === 0 && <div className="text-sm text-gray-600">No timeline events yet.</div>}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


