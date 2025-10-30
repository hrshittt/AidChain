"use client";
import React, { useMemo, useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import RecentActivity from '../../components/RecentActivity';

type Milestone = { id?: string; name: string; requested: number; proof?: string; status: 'locked'|'fundable'|'verification_pending'|'verified'|'funded'; txId?: string; releaseTx?: string; fundedAt?: string; releasedAt?: string; verifier?: string };

type Ngo = {
  id: string;
  name: string;
  cause: string;
  description: string;
  raisedEth: number;
  goalEth: number;
  location: string;
  rating: number;
  trustScore: number; // 0-100
  contractId: string;
  familiesHelped: number;
  volunteers: number;
  lastVerified: string;
  geoVerified: boolean;
  fundingTimeline: { month: string; amount: number }[];
  allocation: Record<string, number>;
  milestones?: Milestone[];
};

const INITIAL_NGOS: Ngo[] = [
  {
    id: 'hope-relief',
    name: 'HopeRelief',
    cause: 'Tsunami',
    description: 'Emergency food, shelter, and medical kits for coastal families.',
    raisedEth: 12.3,
    goalEth: 20,
      location: 'Indonesia',
    rating: 4.6,
    trustScore: 86,
    contractId: '0x9f4a...c3b2',
    familiesHelped: 1240,
    volunteers: 58,
    lastVerified: '5m ago',
    geoVerified: true,
    fundingTimeline: [
      { month: 'Jan', amount: 1.2 },
      { month: 'Feb', amount: 2.5 },
      { month: 'Mar', amount: 3.0 },
      { month: 'Apr', amount: 5.6 },
    ],
    allocation: { Transport: 20, Food: 40, Shelter: 25, Medical: 15 },
    milestones: [
      { name: 'Transport', requested: 1.2, proof: 'https://via.placeholder.com/160', status: 'verified' },
      { name: 'Food & Water', requested: 1.8, proof: 'https://via.placeholder.com/160', status: 'verified' },
  { name: 'Labour', requested: 1.0, proof: 'https://via.placeholder.com/160', status: 'funded' },
  { name: 'Medical Supplies', requested: 0.9, proof: '', status: 'fundable' },
      { name: 'Construction Materials', requested: 2.5, proof: '', status: 'locked' },
      { name: 'Shelter Kits', requested: 1.4, proof: '', status: 'locked' },
      { name: 'Sanitation', requested: 0.6, proof: '', status: 'locked' },
      { name: 'Monitoring', requested: 0.5, proof: '', status: 'locked' },
    ],
  },
  {
    id: 'aid-route',
    name: 'AidRoute',
    cause: 'Flood',
    description: 'Clean water, sanitation, and temporary shelters in flood zones.',
    raisedEth: 8.7,
    goalEth: 15,
    location: 'Bangladesh',
    rating: 4.2,
    trustScore: 79,
    contractId: '0xa1b2...d4e5',
    familiesHelped: 820,
    volunteers: 34,
    lastVerified: '18m ago',
    geoVerified: true,
    fundingTimeline: [
      { month: 'Jan', amount: 0.5 },
      { month: 'Feb', amount: 1.2 },
      { month: 'Mar', amount: 2.0 },
      { month: 'Apr', amount: 5.0 },
    ],
    allocation: { Transport: 10, Food: 50, Shelter: 25, Medical: 15 },
    milestones: [
  { name: 'Transport', requested: 0.8, proof: 'https://via.placeholder.com/160', status: 'verified' },
  { name: 'Food & Water', requested: 1.0, proof: '', status: 'fundable' },
      { name: 'Shelter Kits', requested: 1.2, proof: '', status: 'locked' },
      { name: 'Medical Supplies', requested: 0.7, proof: '', status: 'locked' },
      { name: 'Cleanup', requested: 0.5, proof: '', status: 'locked' },
      { name: 'Logistics', requested: 0.6, proof: '', status: 'locked' },
    ],
  },
  {
    id: 'green-hope',
    name: 'GreenHope',
    cause: 'Drought',
    description: 'Food security and water access for drought-affected communities.',
    raisedEth: 4.1,
    goalEth: 10,
    location: 'Kenya',
    rating: 4.0,
    trustScore: 72,
    contractId: '0xdead...beef',
    familiesHelped: 430,
    volunteers: 18,
    lastVerified: '1h ago',
    geoVerified: false,
    fundingTimeline: [
      { month: 'Jan', amount: 0.3 },
      { month: 'Feb', amount: 0.8 },
      { month: 'Mar', amount: 1.0 },
      { month: 'Apr', amount: 2.0 },
    ],
    allocation: { Transport: 15, Food: 60, Shelter: 10, Medical: 15 },
    milestones: [
  { name: 'Transport', requested: 0.3, proof: '', status: 'fundable' },
  { name: 'Food & Water', requested: 0.5, proof: '', status: 'locked' },
      { name: 'Labour', requested: 0.8, proof: '', status: 'locked' },
      { name: 'Water Systems', requested: 1.5, proof: '', status: 'locked' },
    ],
  },
  {
    id: 'earthquake-aid',
    name: 'EarthquakeAid',
    cause: 'Earthquake',
    description: 'Search, rescue, and rehabilitation for affected families.',
    raisedEth: 16.9,
    goalEth: 25,
    location: 'Turkey',
    rating: 4.8,
    trustScore: 91,
    contractId: '0x4c2f...11a9',
    familiesHelped: 3020,
    volunteers: 150,
    lastVerified: '2h ago',
    geoVerified: true,
    fundingTimeline: [
      { month: 'Jan', amount: 3.2 },
      { month: 'Feb', amount: 4.1 },
      { month: 'Mar', amount: 5.6 },
      { month: 'Apr', amount: 4.0 },
    ],
    allocation: { Transport: 25, Food: 30, Shelter: 25, Medical: 20 },
    milestones: [
      { name: 'Transport', requested: 3.0, proof: 'https://via.placeholder.com/160', status: 'verified' },
      { name: 'Food & Water', requested: 4.0, proof: 'https://via.placeholder.com/160', status: 'verified' },
  { name: 'Labour', requested: 5.0, proof: '', status: 'funded' },
  { name: 'Shelter Kits', requested: 2.0, proof: '', status: 'fundable' },
      { name: 'Medical', requested: 2.0, proof: '', status: 'locked' },
    ],
  },
  {
    id: 'medic-bridge',
    name: 'MedicBridge',
    cause: 'Medical',
    description: 'Mobile clinics and essential medicines for remote areas.',
    raisedEth: 6.2,
    goalEth: 12,
    location: 'Nepal',
    rating: 4.3,
    trustScore: 83,
    contractId: '0x7e8f...b3c1',
    familiesHelped: 920,
    volunteers: 40,
    lastVerified: '3h ago',
    geoVerified: false,
    fundingTimeline: [
      { month: 'Jan', amount: 0.8 },
      { month: 'Feb', amount: 1.0 },
      { month: 'Mar', amount: 1.4 },
      { month: 'Apr', amount: 3.0 },
    ],
    allocation: { Transport: 5, Food: 20, Shelter: 10, Medical: 65 },
    milestones: [
  { name: 'Medication', requested: 1.0, proof: 'https://via.placeholder.com/160', status: 'verified' },
  { name: 'Clinics', requested: 2.0, proof: '', status: 'fundable' },
      { name: 'Transport', requested: 1.5, proof: '', status: 'locked' },
      { name: 'Training', requested: 1.7, proof: '', status: 'locked' },
    ],
  },
  {
    id: 'rebuild-together',
    name: 'RebuildTogether',
    cause: 'Reconstruction',
    description: 'Long-term housing and school rebuilding initiatives.',
    raisedEth: 11.5,
    goalEth: 18,
    location: 'Philippines',
    rating: 4.5,
    trustScore: 88,
    contractId: '0x1a2b...3c4d',
    familiesHelped: 1500,
    volunteers: 72,
    lastVerified: '6h ago',
    geoVerified: true,
    fundingTimeline: [
      { month: 'Jan', amount: 1.5 },
      { month: 'Feb', amount: 2.5 },
      { month: 'Mar', amount: 3.0 },
      { month: 'Apr', amount: 4.5 },
    ],
    allocation: { Transport: 15, Food: 25, Shelter: 40, Medical: 20 },
    milestones: [
  { name: 'Assessment', requested: 1.5, proof: 'https://via.placeholder.com/160', status: 'verified' },
  { name: 'Materials', requested: 3.0, proof: '', status: 'fundable' },
      { name: 'Construction', requested: 6.0, proof: '', status: 'locked' },
      { name: 'Schools', requested: 2.5, proof: '', status: 'locked' },
    ],
  },
];

function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
  <div className="flex items-center gap-1 text-yellow-500">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < full ? 'fill-current' : 'text-black'}`} viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.561-.955L10 0l2.949 5.955 6.561.955-4.755 4.635 1.123 6.545z" />
        </svg>
      ))}
      <span className="text-sm text-black ml-2">{value.toFixed(1)}</span>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div>
      <div className="h-2 bg-gray-200 rounded overflow-hidden">
        <div className="h-2 bg-emerald-500" style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}

function MiniBarChart({ data }: { data: { month: string; amount: number }[] }) {
  const max = Math.max(...data.map(d => d.amount), 1);
  return (
    <div className="flex items-end gap-1 h-20">
      {data.map(d => (
        <div key={d.month} className="flex flex-col items-center text-xs text-black">
          <div className="bg-teal-400 w-6 rounded-t" style={{ height: `${(d.amount / max) * 100}%` }} />
          <div className="mt-1">{d.month}</div>
        </div>
      ))}
    </div>
  );
}

function PieChart({ allocation }: { allocation: Record<string, number> }) {
  const entries = Object.entries(allocation);
  const total = entries.reduce((s, [, v]) => s + v, 0) || 1;
  let angle = 0;
  return (
    <svg width="120" height="120" viewBox="0 0 32 32">
      {entries.map(([k, v], i) => {
        const portion = v / total;
        const large = portion > 0.5 ? 1 : 0;
        const start = angle;
        const end = angle + portion * 2 * Math.PI;
        const x1 = 16 + 16 * Math.cos(start);
        const y1 = 16 + 16 * Math.sin(start);
        const x2 = 16 + 16 * Math.cos(end);
        const y2 = 16 + 16 * Math.sin(end);
        const d = `M16 16 L ${x1} ${y1} A 16 16 0 ${large} 1 ${x2} ${y2} Z`;
        angle = end;
        const colors = ['#10B981', '#60A5FA', '#F59E0B', '#EF4444', '#A78BFA'];
        return <path key={k} d={d} fill={colors[i % colors.length]} stroke="#fff" strokeWidth="0.2" />;
      })}
      <circle cx="16" cy="16" r="6" fill="#fff" />
    </svg>
  );
}

function shortHash(h: string) {
  return h.length > 10 ? `${h.slice(0, 6)}...${h.slice(-4)}` : h;
}

export default function Donate() {
  const [ngos, setNgos] = useState<Ngo[]>(INITIAL_NGOS);
  const [query, setQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterCause, setFilterCause] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [selectedNgo, setSelectedNgo] = useState<Ngo | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [trackNgo, setTrackNgo] = useState<Ngo | null>(null);
  const [showFieldAgentModal, setShowFieldAgentModal] = useState(false);
  const [showAuditorModal, setShowAuditorModal] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  // small helpers for mock chain/ipfs
  function genMockTx() {
    const hex = Math.floor(Math.random()*1e16).toString(16).padStart(12, '0');
    return `0x${hex}...${hex.slice(-6)}`;
  }

  async function uploadToIPFSGlobal(file: File): Promise<string> {
    await new Promise(r => setTimeout(r, 500));
    const cid = `bafy${Math.floor(Math.random()*1e12).toString(36)}`;
    setNotifications(n => [`IPFS: ${cid}`, ...n].slice(0,10));
    return cid;
  }

  async function recordHashOnChainGlobal(cid: string): Promise<string> {
    await new Promise(r => setTimeout(r, 700));
    const tx = genMockTx();
    setNotifications(n => [`On-chain TX: ${tx}`, ...n].slice(0,10));
    return tx;
  }

  async function recordAuditOnChainGlobal(action: 'approved' | 'flagged', ngoId: string): Promise<string> {
    await new Promise(r => setTimeout(r, 700));
    const tx = genMockTx();
    setNotifications(n => [`Audit TX: ${tx}`, ...n].slice(0,10));
    return tx;
  }

  const locations = useMemo(() => ['All', ...Array.from(new Set(ngos.map(n => n.location)))], [ngos]);
  const causes = useMemo(() => ['All', ...Array.from(new Set(ngos.map(n => n.cause)))], [ngos]);

  const results = useMemo(() => ngos.filter(n => {
    if (filterLocation !== 'All' && n.location !== filterLocation) return false;
    if (filterCause !== 'All' && n.cause !== filterCause) return false;
    if (n.rating < minRating) return false;
    if (query && !(n.name.toLowerCase().includes(query.toLowerCase()) || n.description.toLowerCase().includes(query.toLowerCase()))) return false;
    return true;
  }), [ngos, query, filterLocation, filterCause, minRating]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex">
      <aside className="w-64 bg-white shadow-lg flex flex-col py-8 px-4 min-h-screen">
        <h2 className="text-2xl font-bold text-teal-700 mb-8">AidChain</h2>
        <nav className="flex flex-col gap-4">
          <a className="text-left px-4 py-2 rounded hover:bg-teal-50 font-semibold text-black" href="/">Home</a>
          <a className="text-left px-4 py-2 rounded hover:bg-teal-50 font-semibold text-black" href="/donor/dashboard">Donor Dashboard</a>
            <button onClick={() => setShowCreateModal(true)} className="text-left px-4 py-2 rounded hover:bg-teal-50 font-semibold text-black text-left">Create Campaign</button>
            <button onClick={() => setShowFieldAgentModal(true)} className="text-left px-4 py-2 rounded hover:bg-teal-50 font-semibold text-black text-left">Field Agent: Log Delivery</button>
            <button onClick={() => setShowAuditorModal(true)} className="text-left px-4 py-2 rounded hover:bg-teal-50 font-semibold text-black text-left">Auditor: Audit Trails</button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="max-w-7xl mx-auto px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-teal-700">NGO Marketplace — Compare, Verify, Donate</h1>
        <div className="text-sm text-black">Blockchain-powered transparency • Smart contract verified disbursements</div>
          </div>

          <div className="bg-white rounded-xl p-4 mb-6 shadow flex gap-4 items-center">
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search NGOs or causes" className="flex-1 px-3 py-2 border rounded text-black" />
            <select value={filterLocation} onChange={e => setFilterLocation(e.target.value)} className="px-3 py-2 border rounded text-black">
              {/* display label 'Location' while keeping value All for logic */}
              <option value="All">Location</option>
              {locations.filter(l=>l!=='All').map((l:any) => <option key={l} value={l}>{l}</option>)}
            </select>
            <select value={filterCause} onChange={e => setFilterCause(e.target.value)} className="px-3 py-2 border rounded text-black">
              <option value="All">Disaster Type</option>
              {causes.filter(c=>c!=='All').map((c:any) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="flex items-center gap-2">
              <label className="text-sm text-black">Min Rating</label>
              <input type="range" min={0} max={5} step={0.1} value={minRating} onChange={e => setMinRating(Number(e.target.value))} />
              <div className="text-sm text-black">{minRating.toFixed(1)}</div>
            </div>
          </div>

          <RecentActivity />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(ngo => {
              const progress = Math.min(100, Math.round((ngo.raisedEth / ngo.goalEth) * 100));
              return (
                <div key={ngo.id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-2xl font-bold text-emerald-700">{ngo.name.split(' ').map(s=>s[0]).slice(0,2).join('')}</div>
                      <div>
                        <div className="text-lg font-bold text-black">{ngo.name}</div>
                        <div className="text-sm text-teal-700 font-semibold">{ngo.location} • {ngo.cause}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Stars value={ngo.rating} />
                      <div className="text-sm text-black">Trust {ngo.trustScore}%</div>
                    </div>
                  </div>

                  <p className="text-sm text-black/80 mt-4">{ngo.description}</p>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-black mb-2">
                      <div>Raised <strong className="text-black">{ngo.raisedEth.toFixed(2)} ETH</strong></div>
                      <div>Goal <strong className="text-black">{ngo.goalEth.toFixed(2)} ETH</strong></div>
                    </div>
                    <ProgressBar value={progress} />
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-black">Contract: <span className="font-mono text-sm text-black">{shortHash(ngo.contractId)}</span></div>
                    <div className="flex items-center gap-2">
                      {ngo.geoVerified ? <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-sm">Geo Verified</span> : <span className="px-2 py-0.5 bg-gray-50 text-black rounded text-sm">No Geo</span>}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-start">
                      <div className="text-xs text-black">Families needing help</div>
                      <div className="font-semibold text-black">{ngo.familiesHelped.toLocaleString()}</div>
                    </div>
                    <div className="flex flex-col items-start">
                      <div className="text-xs text-black">Volunteers</div>
                      <div className="font-semibold text-black">{ngo.volunteers}</div>
                    </div>
                    <div className="col-span-2 mt-2">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <MiniBarChart data={ngo.fundingTimeline} />
                          <div className="text-xs text-black">Funding timeline</div>
                        </div>
                        <div className="w-24 h-24 flex items-center justify-center">
                          <PieChart allocation={ngo.allocation} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button onClick={() => setSelectedNgo(ngo)} className="flex-1 px-4 py-2 rounded bg-white border border-gray-200 text-black hover:bg-gray-50">View Details</button>
                    <a href={`/donate/${encodeURIComponent(ngo.id)}`} className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700">Fund NGO</a>
                    <button onClick={() => setTrackNgo(ngo)} className="px-4 py-2 rounded border border-emerald-600 text-emerald-600 hover:bg-emerald-50">Track Impact</button>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedNgo && (
            <DetailsModal ngo={selectedNgo} onClose={() => setSelectedNgo(null)} onOpenTrack={(n: Ngo) => setTrackNgo(n)} />
          )}
          {showCreateModal && (
            <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                <h3 className="text-xl font-semibold text-black mb-2">Create Campaign</h3>
                <div className="space-y-2">
                  <input id="c-name" placeholder="NGO name" className="w-full border px-3 py-2 rounded text-black" />
                  <input id="c-cause" placeholder="Cause (e.g., Flood)" className="w-full border px-3 py-2 rounded text-black" />
                  <input id="c-location" placeholder="Location" className="w-full border px-3 py-2 rounded text-black" />
                  <input id="c-goal" type="number" placeholder="Goal ETH" className="w-full border px-3 py-2 rounded text-black" />
                  <textarea id="c-desc" placeholder="Short description" className="w-full border px-3 py-2 rounded text-black" />
                  <textarea id="c-milestones" placeholder="Milestones (one per line, format: Name:amount)" className="w-full border px-3 py-2 rounded text-black" />
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button onClick={() => setShowCreateModal(false)} className="px-3 py-2 rounded border text-black">Cancel</button>
                  <button onClick={() => {
                    const name = (document.getElementById('c-name') as HTMLInputElement | null)?.value?.trim();
                    if (!name) return alert('Please provide NGO name');
                    const cause = (document.getElementById('c-cause') as HTMLInputElement | null)?.value?.trim() || 'General';
                    const location = (document.getElementById('c-location') as HTMLInputElement | null)?.value?.trim() || 'Unknown';
                    const goal = parseFloat((document.getElementById('c-goal') as HTMLInputElement | null)?.value || '0') || 0;
                    const desc = (document.getElementById('c-desc') as HTMLTextAreaElement | null)?.value?.trim() || '';
                    const msText = (document.getElementById('c-milestones') as HTMLTextAreaElement | null)?.value || '';
                    const milestones: Milestone[] = msText.split('\n').map((line, idx) => {
                      const [namePart, amtPart] = line.split(':').map(s=>s && s.trim());
                      const requested = parseFloat(amtPart || '0') || 0;
                      return { id: `new-${Date.now()}-${idx}`, name: namePart || `Step ${idx+1}`, requested, status: idx===0 ? 'fundable' : 'locked' } as Milestone;
                    }).filter(m=>m.name);
                    const id = name.toLowerCase().replace(/[^a-z0-9]+/g,'-');
                    const newNgo: Ngo = {
                      id,
                      name,
                      cause,
                      description: desc,
                      raisedEth: 0,
                      goalEth: goal,
                      location,
                      rating: 0,
                      trustScore: 50,
                      contractId: `0x${Math.floor(Math.random()*1e8).toString(16)}`,
                      familiesHelped: 0,
                      volunteers: 0,
                      lastVerified: 'never',
                      geoVerified: false,
                      fundingTimeline: [],
                      allocation: {},
                      milestones,
                    };
                    setNgos(n => [newNgo, ...n]);
                    setShowCreateModal(false);
                  }} className="px-3 py-2 rounded bg-emerald-600 text-white">Create</button>
                </div>
              </div>
            </div>
          )}
          {showFieldAgentModal && (
            <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-lg p-6 w-11/12 md:w-3/4 lg:w-2/3 shadow-lg max-h-[90vh] overflow-auto">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-black">Field Agent — Log Aid Delivery</h3>
                  <button onClick={() => setShowFieldAgentModal(false)} className="text-black">Close</button>
                </div>

                <div className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-black">Select NGO</label>
                      <select id="fa-ngo" className="w-full border px-3 py-2 rounded text-black">
                        {ngos.map(n => <option key={n.id} value={n.id}>{n.name} — {n.location}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-black">Select Milestone</label>
                      <select id="fa-ms" className="w-full border px-3 py-2 rounded text-black">
                        {ngos[0]?.milestones?.map((m, i) => <option key={m.id||i} value={m.id}>{m.name} ({m.status})</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="text-sm text-black">Upload Proof (image or pdf)</label>
                    <input id="fa-file" type="file" accept="image/*,.pdf" className="w-full" />
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <button onClick={() => setShowFieldAgentModal(false)} className="px-3 py-2 rounded border text-black">Cancel</button>
                    <button onClick={async () => {
                      const ngoId = (document.getElementById('fa-ngo') as HTMLSelectElement).value;
                      const msId = (document.getElementById('fa-ms') as HTMLSelectElement).value;
                      const fileInput = (document.getElementById('fa-file') as HTMLInputElement);
                      const file = fileInput?.files?.[0];
                      if (!ngoId || !msId || !file) return alert('Please select NGO, milestone and a file');
                      // simulate IPFS upload + chain record
                      const cid = await uploadToIPFSGlobal(file);
                      const tx = await recordHashOnChainGlobal(cid);
                      // update ngos state
                      setNgos(prev => prev.map(n => {
                        if (n.id !== ngoId) return n;
                        const ms = n.milestones?.map(m => m.id === msId ? ({ ...m, proof: URL.createObjectURL(file), status: 'verification_pending', txId: m.txId ?? undefined } as Milestone) : m) || [];
                        return { ...n, milestones: ms };
                      }));
                      setShowFieldAgentModal(false);
                    }} className="px-3 py-2 rounded bg-emerald-600 text-white">Upload & Mark</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showAuditorModal && (
            <div className="fixed inset-0 z-80 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-lg p-6 w-11/12 md:w-3/4 lg:w-2/3 shadow-lg max-h-[90vh] overflow-auto">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-black">Auditor — Audit Trails</h3>
                  <button onClick={() => setShowAuditorModal(false)} className="text-black">Close</button>
                </div>
                <div className="mt-4">
                  <div className="space-y-3">
                    {ngos.map(n => (
                      <div key={n.id} className="p-3 border rounded">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-black font-semibold">{n.name} — {n.location}</div>
                            <div className="text-sm text-black">{n.cause}</div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => {
                              // open details in track view
                              setTrackNgo(n);
                              setShowAuditorModal(false);
                            }} className="px-2 py-1 border rounded text-black">View</button>
                            <button onClick={async () => {
                              const tx = await recordAuditOnChainGlobal('approved', n.id);
                              // optimistic UI: tag all milestones as approved (no separate field)
                              setNgos(prev => prev.map(p => p.id === n.id ? { ...p, lastVerified: 'audited' } : p));
                            }} className="px-2 py-1 rounded bg-emerald-600 text-white">Approve</button>
                            <button onClick={async () => {
                              const tx = await recordAuditOnChainGlobal('flagged', n.id);
                              setNgos(prev => prev.map(p => p.id === n.id ? { ...p, lastVerified: 'flagged' } : p));
                            }} className="px-2 py-1 rounded bg-red-600 text-white">Flag</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {trackNgo && (
            <div className="fixed inset-0 z-90 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-lg p-6 w-11/12 md:w-3/4 lg:w-2/3 shadow-lg max-h-[90vh] overflow-auto">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-black">Impact — {trackNgo.name}</h2>
                    <div className="text-sm text-black">{trackNgo.cause} • {trackNgo.location}</div>
                  </div>
                  <div><button onClick={() => setTrackNgo(null)} className="text-black">Close</button></div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <div className="bg-gray-50 p-4 rounded mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-black">Raised</div>
                          <div className="text-2xl font-semibold text-black">{trackNgo.raisedEth.toFixed(2)} ETH</div>
                        </div>
                        <div>
                          <div className="text-sm text-black">Goal</div>
                          <div className="text-2xl font-semibold text-black">{trackNgo.goalEth.toFixed(2)} ETH</div>
                        </div>
                        <div>
                          <div className="text-sm text-black">Families helped</div>
                          <div className="text-xl font-semibold text-black">{trackNgo.familiesHelped.toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="mt-4"><MiniBarChart data={trackNgo.fundingTimeline} /></div>
                    </div>

                    <div className="bg-white p-4 rounded mb-4">
                      <h3 className="font-semibold mb-2 text-black">Milestones</h3>
                      <div className="space-y-3">
                        {trackNgo.milestones?.map((m, i) => (
                          <div key={m.id || i} className="p-3 border rounded flex items-center justify-between">
                            <div>
                              <div className="text-black font-semibold">{m.name}</div>
                              <div className="text-sm text-black">Requested: {m.requested} ETH</div>
                              <div className="text-sm text-black">Status: {m.status}</div>
                            </div>
                            <div className="text-right">
                              {m.txId && <div className="text-xs text-black">Fund TX: {m.txId}</div>}
                              {m.releaseTx && <div className="text-xs text-black">Release TX: {m.releaseTx}</div>}
                              {m.proof && <div className="mt-2"><button onClick={() => window.open(m.proof, '_blank')} className="px-3 py-1 rounded border text-sm">View Proof</button></div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded">
                      <h3 className="font-semibold mb-2 text-black">Payment & Transactions</h3>
                      <div className="space-y-2 text-sm text-black">
                        {trackNgo.milestones?.flatMap(m => [m.txId, m.releaseTx]).filter(Boolean).map((tx, idx) => (
                          <div key={idx} className="border p-2 rounded">{tx}</div>
                        ))}
                        {(!trackNgo.milestones || trackNgo.milestones.length===0) && <div>No transactions yet</div>}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="bg-white p-4 rounded mb-4">
                      <h4 className="font-semibold text-black">Allocation</h4>
                      <PieChart allocation={trackNgo.allocation} />
                    </div>
                    <div className="bg-white p-4 rounded">
                      <h4 className="font-semibold text-black">Quick Stats</h4>
                      <div className="mt-2 text-black">Volunteers: {trackNgo.volunteers}</div>
                      <div className="text-black">Trust: {trackNgo.trustScore}%</div>
                      <div className="text-black">Last verified: {trackNgo.lastVerified}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function DetailsModal({ ngo, onClose, onOpenTrack }: { ngo: Ngo; onClose: () => void; onOpenTrack?: (n: Ngo) => void }) {
  // initial milestones: prefer ngo.milestones if present (these are mocks)
  const makeInitial = (): Milestone[] => {
    if (ngo.milestones && ngo.milestones.length) {
      return ngo.milestones.map((m, i) => ({
        id: `${ngo.id}-m-${i}`,
        name: m.name,
        requested: m.requested,
        proof: m.proof || undefined,
  // accept existing milestone status from mock data (already using new status union)
  status: m.status,
      }));
    }
    // fallback: build from allocation keys
    const keys = Object.keys(ngo.allocation);
    return keys.map((k, idx) => ({
      id: `${ngo.id}-m-${idx}`,
      name: k,
      requested: Math.round((ngo.goalEth * (ngo.allocation[k] / 100)) * 10) / 10,
      proof: undefined,
      status: idx === 0 ? 'fundable' : 'locked',
    }));
  };

  const [milestones, setMilestones] = useState<Milestone[]>(makeInitial);
  const [isAdminView, setIsAdminView] = useState(false); // toggle to simulate NGO/admin tools (upload proofs)
  const [notifications, setNotifications] = useState<string[]>([]);
  const [txModal, setTxModal] = useState<{tx:string|null, title?:string} | null>(null);
  const [fundModal, setFundModal] = useState<{ open: boolean; presetId?: string | null }>({ open: false, presetId: null });

  useEffect(() => {
    // ensure only one milestone is 'funded' at a time in state
    const fundedCount = milestones.filter(m => m.status === 'funded').length;
    if (fundedCount > 1) {
      // keep the earliest funded and revert others to 'fundable'
      let firstSeen = false;
      setMilestones(ms => ms.map(m => {
        if (m.status === 'funded') {
          if (!firstSeen) { firstSeen = true; return m; }
          return { ...m, status: 'fundable' };
        }
        return m;
      }));
    }
  }, [milestones]);

  function pushNotification(msg: string) {
    setNotifications(n => [msg, ...n].slice(0, 10));
  }

  function genTx() {
    const hex = Math.floor(Math.random()*1e16).toString(16).padStart(12, '0');
    return `0x${hex}...${hex.slice(-6)}`;
  }

  // --- Mock IPFS / Blockchain helpers (stubs) ---
  async function uploadToIPFS(file: File): Promise<string> {
    // simulate upload delay
    await new Promise(r => setTimeout(r, 600));
    // generate a fake CID
    const cid = `bafy${Math.floor(Math.random()*1e12).toString(36)}`;
    pushNotification(`Uploaded proof to IPFS: ${cid}`);
    return cid;
  }

  async function recordHashOnChain(cid: string): Promise<string> {
    // simulate chain tx
    await new Promise(r => setTimeout(r, 800));
    const tx = genTx();
    pushNotification(`Recorded IPFS hash on-chain: ${tx}`);
    return tx;
  }

  async function recordAuditOnChain(action: 'approved' | 'flagged', ngoId: string): Promise<string> {
    await new Promise(r => setTimeout(r, 800));
    const tx = genTx();
    pushNotification(`Audit action '${action}' recorded on-chain: ${tx}`);
    return tx;
  }

  function onFundMilestone(mid: string) {
    // call backend demo donate endpoint to record transaction and emit realtime update
    const ngoId = ngo.id;
    const milestone = milestones.find(m => m.id === mid);
    const amount = milestone?.requested || 0;
    // optimistic UI update
    setMilestones(prev => prev.map(m => m.id === mid ? { ...m, status: 'funded', txId: genTx(), fundedAt: new Date().toISOString() } : m));
    pushNotification('Funded (escrowed) — creating transaction...');
    (async () => {
      try {
        const res = await fetch('http://localhost:5000/api/donate/public', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            donorId: '000000000000000000000000',
            ngoId: ngoId,
            recipientId: ngoId,
            type: 'donation',
            aidCategory: milestone?.name || 'funds',
            amount,
            coin: 'ETH'
          })
        });
        if (!res.ok) {
          const body = await res.text();
          throw new Error(body || 'Failed to create donation');
        }
        const data = await res.json();
        pushNotification('Donation recorded — ' + (data?.msg || 'ok'));
      } catch (err: any) {
        console.error('Donation API failed', err);
        pushNotification('Donation failed: ' + (err?.message || err));
        // revert optimistic update
        setMilestones(prev => prev.map(m => m.id === mid ? { ...m, status: 'fundable', txId: undefined } : m));
      }
    })();
  }

  function onUploadProof(mid: string, fileUrl: string) {
    // NGO/admin uploads proof: attach proof and mark verification pending
    setMilestones(prev => prev.map(m => m.id === mid ? { ...m, proof: fileUrl, status: 'verification_pending' } : m));
    pushNotification('Proof uploaded — awaiting verifier review');
    // simulate verifier action (auto-verify after a short delay)
    setTimeout(() => {
      // mark verified and release funds
      setMilestones(prev => {
        const idx = prev.findIndex(x => x.id === mid);
        if (idx === -1) return prev;
        const copy = prev.map(x => ({ ...x }));
        copy[idx].status = 'verified';
        copy[idx].releaseTx = genTx();
        copy[idx].releasedAt = new Date().toISOString();
        copy[idx].verifier = 'Verifier01';
        // unlock next milestone if exists
        if (copy[idx+1] && copy[idx+1].status === 'locked') copy[idx+1].status = 'fundable';
        return copy;
      });
      pushNotification('Verified & Released — funds released on-chain');
    }, 2200);
  }

  function onDownloadProof(url?: string) {
    if (!url) return;
    // open proof in new tab (mock download)
    window.open(url, '_blank');
  }

  const nextFundable = milestones.find(m => m.status === 'fundable');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-11/12 md:w-3/4 lg:w-2/3 p-6 shadow-xl overflow-auto max-h-[90vh]">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-black italic">{`${ngo.cause} relief — ${ngo.location} community support`}</div>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold">{ngo.name}</div>
              <div className="text-sm text-black">{shortHash(ngo.contractId)}</div>
              <div className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-sm">Verified on Blockchain</div>
            </div>
            <div className="mt-2 text-sm text-black">{ngo.description}</div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm text-black mb-2">
                <div>Raised <strong className="text-black">{ngo.raisedEth.toFixed(2)} ETH</strong></div>
                <div>Goal <strong className="text-black">{ngo.goalEth.toFixed(2)} ETH</strong></div>
              </div>
              <ProgressBar value={Math.round((ngo.raisedEth / ngo.goalEth) * 100)} />
            </div>
            <div className="mt-3 text-sm text-black flex gap-4">
              <div>Trust: <strong className="text-black">{ngo.trustScore}%</strong></div>
              <div>Families: <strong className="text-black">{ngo.familiesHelped.toLocaleString()}</strong></div>
              <div>Volunteers: <strong className="text-black">{ngo.volunteers}</strong></div>
              <div>Last verified: <strong className="text-black">{ngo.lastVerified}</strong></div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <div className="text-sm text-black">Simulate NGO/Admin:</div>
              <label className="inline-flex items-center">
                <input type="checkbox" className="mr-2" checked={isAdminView} onChange={e => setIsAdminView(e.target.checked)} />
                <span className="text-sm">Admin view</span>
              </label>
            </div>
            <button onClick={onClose} className="mt-3 text-black">Close</button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Milestone Tracker</h3>
            <div className="space-y-3">
              {milestones.map((m, i) => {
                const anyOtherFunded = milestones.some(x => x.status === 'funded' && x.id !== m.id);
                const canFund = m.status !== 'verified' && m.status !== 'funded' && !anyOtherFunded;
                return (
                  <div key={m.id || i} className="p-3 border rounded-lg flex items-center justify-between bg-white">
                    <div>
                      <div className="font-semibold text-black">{m.name}</div>
                      <div className="text-sm text-black">Requested: {m.requested} ETH</div>
                      <div className="text-sm text-black">Status: <strong className={`${m.status==='verified' || m.status==='funded' ? 'text-green-700' : 'text-black'}`}>{m.status}</strong></div>
                      {m.txId && <div className="text-xs text-black">Fund TX: <button onClick={() => setTxModal({tx: m.txId ?? null, title:'Funding TX'})} className="underline">{m.txId}</button></div>}
                      {m.releaseTx && <div className="text-xs text-black">Release TX: <button onClick={() => setTxModal({tx: m.releaseTx ?? null, title:'Release TX'})} className="underline">{m.releaseTx}</button></div>}
                      {m.verifier && <div className="text-xs text-black">Verified by: {m.verifier} at {m.releasedAt ? new Date(m.releasedAt).toLocaleString() : ''}</div>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                              {m.proof ? (
                        <div className="flex flex-col items-end">
                          <img src={m.proof} className="w-24 h-16 object-cover rounded mb-1" alt="proof" />
                          <div className="flex gap-2">
                            <button onClick={() => onDownloadProof(m.proof)} className="text-xs px-2 py-1 border rounded">View / Download</button>
                                    {isAdminView && m.status !== 'funded' && m.status !== 'verified' && <label className="text-xs px-2 py-1 border rounded cursor-pointer bg-gray-50">Replace Proof <input type="file" accept="image/*,.pdf" onChange={e => { const f = e.target.files?.[0]; if (f) onUploadProof(m.id!, URL.createObjectURL(f)); }} hidden /></label>}
                          </div>
                        </div>
                      ) : (
                                <div className="text-sm text-black">No proof yet</div>
                      )}

                      <div className="flex gap-2">
                                {!isAdminView && m.status !== 'verified' && m.status !== 'funded' && (
                                  <button onClick={() => setFundModal({ open: true, presetId: m.id })} disabled={!canFund} className={`px-3 py-1 rounded text-sm ${!canFund ? 'bg-gray-200 text-black' : 'bg-blue-600 text-white'}`}>Fund this Step</button>
                                )}
                        {isAdminView && m.status !== 'funded' && m.status !== 'verified' && !m.proof && (
                          <label className="px-3 py-1 rounded bg-emerald-600 text-white text-sm cursor-pointer">Upload Proof <input type="file" accept="image/*,.pdf" onChange={e => { const f = e.target.files?.[0]; if (f) onUploadProof(m.id!, URL.createObjectURL(f)); }} hidden /></label>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Impact & Allocation</h3>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-black">Families helped</div>
              <div className="font-semibold text-lg text-black">{ngo.familiesHelped.toLocaleString()}</div>
              <div className="text-sm text-black mt-2">Volunteers</div>
              <div className="font-semibold text-black">{ngo.volunteers}</div>
              <div className="mt-4"><MiniBarChart data={ngo.fundingTimeline} /></div>
              <div className="mt-4 flex items-center gap-4">
                <PieChart allocation={ngo.allocation} />
                <div>
                  <div className="text-sm text-black">Last verified</div>
                  <div className="font-semibold text-black">{ngo.lastVerified}</div>
                  <div className="text-sm text-black mt-2">Trust score</div>
                  <div className="font-semibold text-black">{ngo.trustScore}%</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm text-black mb-2">Upcoming milestones</div>
                <div className="flex gap-2">
                  {milestones.slice(0,3).map((m,i) => (
                    <div key={i} className={`px-3 py-1 rounded ${m.status==='fundable'?'bg-emerald-100':m.status==='verified'?'bg-green-100':'bg-gray-100'}`}>
                      <div className="text-xs text-black">{m.name}</div>
                      <div className="text-xs font-semibold">{m.requested} ETH</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

            <div className="mt-6 flex justify-between items-center">
          <div className="flex gap-3">
            <button disabled={!nextFundable} onClick={() => setFundModal({ open: true, presetId: nextFundable?.id ?? null })} className={`px-4 py-2 rounded ${nextFundable ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-black'}`}>Fund NGO</button>
            <button onClick={() => onOpenTrack && onOpenTrack(ngo)} className="px-4 py-2 rounded border border-emerald-600 text-emerald-600">Track Impact</button>
            <button className="px-4 py-2 rounded border text-sm">Ask NGO Question</button>
            <button className="px-4 py-2 rounded border text-sm">Report Issue</button>
          </div>
          <div className="text-sm text-black">Wallet: <span className="font-mono text-black">Connect (placeholder)</span></div>
        </div>

        {txModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center">
            <div className="bg-white p-4 rounded shadow-lg">
              <div className="font-semibold mb-2">{txModal.title}</div>
              <div className="font-mono mb-2">{txModal.tx}</div>
                <div className="text-xs text-black">This is a mock TX detail view.</div>
              <div className="mt-3 text-right"><button onClick={() => setTxModal(null)} className="px-3 py-1 rounded border">Close</button></div>
            </div>
          </div>
        )}

        {notifications.length > 0 && (
          <div className="fixed bottom-6 right-6 space-y-2 z-60">
            {notifications.map((n, i) => (
              <div key={i} className="bg-white border p-2 rounded shadow text-sm">{n}</div>
            ))}
          </div>
        )}
        {fundModal.open && (
          <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
              <h3 className="text-xl font-semibold text-black mb-2">Donate to {ngo.name}</h3>
              <p className="text-sm text-black mb-4">Support the cause with a secure contribution.</p>

              <label className="text-sm text-black">Amount (ETH)</label>
              <input type="number" step="0.01" min="0" className="w-full border px-3 py-2 rounded mb-3 text-black" placeholder="e.g., 0.25" id="donation-amount" />

              <label className="text-sm text-black">Cause</label>
              <select className="w-full border px-3 py-2 rounded mb-3 text-black" id="donation-cause" defaultValue={fundModal.presetId ?? ''}>
                {/* list only milestones that are not verified and not funded */}
                {milestones.filter(mm => mm.status !== 'verified' && mm.status !== 'funded').map(mm => (
                  <option key={mm.id} value={mm.id}>{mm.name}</option>
                ))}
              </select>

              <label className="text-sm text-black">Payment Method</label>
              <select className="w-full border px-3 py-2 rounded mb-4 text-black" id="donation-method">
                <option value="crypto">Crypto</option>
                <option value="card">Card</option>
              </select>

              <div className="flex justify-end gap-2">
                <button onClick={() => setFundModal({ open: false, presetId: null })} className="px-3 py-2 rounded border text-black">Cancel</button>
                <button onClick={() => {
                  const amtInput = (document.getElementById('donation-amount') as HTMLInputElement | null);
                  const causeSelect = (document.getElementById('donation-cause') as HTMLSelectElement | null);
                  const chosen = causeSelect?.value;
                  // optionally we could use amtInput.value but the mock flow ignores amount and calls onFundMilestone
                  if (chosen) {
                    onFundMilestone(chosen);
                  }
                  setFundModal({ open: false, presetId: null });
                }} className="px-3 py-2 rounded bg-emerald-600 text-white">Donate</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
