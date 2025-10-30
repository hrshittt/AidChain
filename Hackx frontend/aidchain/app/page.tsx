"use client";
import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import TransactionsTable from '../components/TransactionsTable';
import AuditList from '../components/AuditList';
import MessagesPanel from '../components/MessagesPanel';
import ProfilePanel from '../components/ProfilePanel';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend);

export default function Home() {
  const [profile, setProfile] = React.useState('Donor');
  const [mainView, setMainView] = React.useState('');
  const [transactions, setTransactions] = React.useState<any[]>([]);
  const [auditLogs, setAuditLogs] = React.useState<any[]>([]);
  const [loadingTx, setLoadingTx] = React.useState(false);
  const [loadingAudit, setLoadingAudit] = React.useState(false);
  const [conversations, setConversations] = React.useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = React.useState<any | null>(null);
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    // load conversations and user from localStorage (client-only)
    try {
      const cs = typeof window !== 'undefined' ? localStorage.getItem('conversations') : null;
      if (cs) setConversations(JSON.parse(cs));
      const u = typeof window !== 'undefined' ? localStorage.getItem('aid_user') : null;
      if (u) setUser(JSON.parse(u));
    } catch (e) { /* ignore */ }
  }, []);

  // seed demo data if none present
  React.useEffect(() => {
    if (transactions.length === 0) {
      const demoTx = [
        { _id: 'tx-demo-1', createdAt: new Date().toISOString(), type: 'donation', aidCategory: 'funds', donorName: 'alice', ngoName: 'HopeRelief', amount: 0.5, status: 'completed', txId: '0xabc123' },
        { _id: 'tx-demo-2', createdAt: new Date(Date.now()-1000*60*60).toISOString(), type: 'delivery', aidCategory: 'food', donorName: 'FieldAgent#21', ngoName: 'AidRoute', amount: 0.0, status: 'completed', proof: 'https://via.placeholder.com/300x200.png?text=Proof+1' },
        { _id: 'tx-demo-3', createdAt: new Date(Date.now()-1000*60*60*24).toISOString(), type: 'logistics', aidCategory: 'medical', donorName: 'logistics', ngoName: 'GreenHope', amount: 0.0, status: 'in-progress', proof: 'https://via.placeholder.com/300x200.png?text=Proof+2' },
      ];
      setTransactions(demoTx);
    }
    if (auditLogs.length === 0) {
      const demoAudit = [
        { _id: 'audit-1', action: 'approved', entity: 'AidTransaction', description: 'Audit approved for tx-demo-1', user: { name: 'AuditorJane' }, createdAt: new Date().toISOString() },
        { _id: 'audit-2', action: 'flagged', entity: 'Milestone', description: 'Suspicious proof for AidRoute milestone', user: { name: 'AuditorSam' }, createdAt: new Date(Date.now()-1000*60*30).toISOString() },
      ];
      setAuditLogs(demoAudit);
    }
    if (conversations.length === 0) {
      const demoConvos = [
        { with: 'hope-relief', withName: 'HopeRelief', messages: [ { from: 'ngo', text: 'Thanks for your support!', ts: new Date(Date.now()-1000*60*60).toISOString(), read: false }, { from: 'me', text: 'How soon will the supplies reach?', ts: new Date(Date.now()-1000*30).toISOString(), read: true } ] },
        { with: 'aid-route', withName: 'AidRoute', messages: [ { from: 'ngo', text: 'We have dispatched volunteers to the coastal region.', ts: new Date(Date.now()-1000*60*60*3).toISOString(), read: false } ] },
        { with: 'greenhope', withName: 'GreenHope', messages: [ { from: 'ngo', text: 'Medical kits en route.', ts: new Date(Date.now()-1000*60*60*6).toISOString(), read: true } ] },
      ];
      setConversations(demoConvos);
      try { localStorage.setItem('conversations', JSON.stringify(demoConvos)); } catch (e) {}
    }
  }, []);

  // listen for Navbar openMessages event
  React.useEffect(() => {
    function onOpen() {
      setMainView('messages');
    }
    window.addEventListener('openMessages', onOpen as EventListener);
    return () => window.removeEventListener('openMessages', onOpen as EventListener);
  }, []);

  async function fetchTransactions() {
    setLoadingTx(true);
    try {
      const res = await fetch('http://localhost:5000/api/transactions/public');
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setTransactions(data.txs || data || []);
    } catch (err: any) {
      console.warn('Failed to load transactions', err);
      setTransactions([]);
    } finally {
      setLoadingTx(false);
    }
  }

  async function fetchAuditLogs() {
    setLoadingAudit(true);
    try {
      const res = await fetch('http://localhost:5000/api/audit/list');
      if (!res.ok) {
        // may require auth - show friendly message
        throw new Error(`Audit fetch failed: ${res.status}`);
      }
      const data = await res.json();
      setAuditLogs(data.logs || []);
    } catch (err: any) {
      console.warn('Failed to load audit logs', err);
      setAuditLogs([]);
    } finally {
      setLoadingAudit(false);
    }
  }

  React.useEffect(() => {
    // load lists when view changes
    if (mainView === 'transactions' || mainView === 'field-logs') fetchTransactions();
    if (mainView === 'audit-view') fetchAuditLogs();
  }, [mainView]);

  // --- message & profile handlers ---
  function handleSelectConversation(c: any) {
    setSelectedConversation(c);
    // mark messages as read
    const updated = conversations.map((cv: any) => cv === c ? { ...cv, messages: cv.messages.map((m:any) => ({ ...m, read: true })) } : cv);
    setConversations(updated);
    try { localStorage.setItem('conversations', JSON.stringify(updated)); } catch (e) {}
  }

  function handleSendMessage(conv: any, msg: any) {
    const updated = conversations.map((c: any) => c === conv ? { ...c, messages: [...(c.messages||[]), msg] } : c);
    setConversations(updated);
    setSelectedConversation(updated.find((u:any) => u.with === conv.with));
    try { localStorage.setItem('conversations', JSON.stringify(updated)); } catch (e) {}
  }

  const router = useRouter();
  function handleSignIn(u: any) {
    const userObj = { ...u, role: profile };
    setUser(userObj);
    try { localStorage.setItem('aid_user', JSON.stringify(userObj)); } catch (e) {}
    // redirect to dashboard/root after sign-in
    try { router.push('/'); } catch (e) { window.location.href = '/'; }
  }
  function handleSignOut() { setUser(null); localStorage.removeItem('aid_user'); }

  const summary = {
    totalDonationsEth: 182.4,
    aidDistributedEth: 149.9,
    milestonesCompleted: 37,
  };
  const recentEvents: Array<{ id: string; type: 'donation' | 'distribution' | 'milestone'; title: string; actor: string; amountEth?: number; time: string; }> = [
    { id: 'e1', type: 'donation', title: 'Donation to HopeRelief', actor: '0xA1B2...C3D4', amountEth: 0.5, time: '2m ago' },
    { id: 'e2', type: 'distribution', title: 'Aid delivered - Flood Relief', actor: 'FieldAgent#21', amountEth: 0.2, time: '12m ago' },
    { id: 'e3', type: 'milestone', title: 'Milestone reached - 5,000 meals', actor: 'AidRoute', time: '1h ago' },
    { id: 'e4', type: 'donation', title: 'Donation to GreenHope', actor: '0xE5F6...G7H8', amountEth: 1.1, time: '3h ago' },
    { id: 'e5', type: 'distribution', title: 'Medical kits dispatched', actor: 'MedicBridge', amountEth: 0.4, time: '6h ago' },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white shadow-lg flex flex-col py-8 px-4 min-h-screen">
        <h2 className="text-2xl font-bold text-teal-700 mb-8">AidChain</h2>
        <select className="mb-6 px-4 py-2 rounded border text-black bg-white" value={profile} onChange={e=>{setProfile(e.target.value);setMainView('')}}>
          <option value="Donor">Donor</option>
          <option value="NGO">NGO</option>
          <option value="Field">Field Agent</option>
          <option value="Auditor">Auditor</option>
        </select>
        <nav className="flex flex-col gap-4">
          <button className={`text-left px-4 py-2 rounded hover:bg-teal-50 font-semibold text-black ${mainView==='dashboard'?'bg-teal-100':''}`} onClick={()=>setMainView('dashboard')}>Dashboard</button>
          <button className={`text-left px-4 py-2 rounded hover:bg-teal-50 font-semibold text-black ${mainView==='transactions'?'bg-teal-100':''}`} onClick={()=>setMainView('transactions')}>Transactions</button>
          <button className={`text-left px-4 py-2 rounded hover:bg-teal-50 font-semibold text-black ${mainView==='messages'?'bg-teal-100':''}`} onClick={()=>setMainView('messages')}>Messages</button>
          <button className={`text-left px-4 py-2 rounded hover:bg-teal-50 font-semibold text-black ${mainView==='profile'?'bg-teal-100':''}`} onClick={()=>setMainView('profile')}>Profile</button>
          <button className={`text-left px-4 py-2 rounded hover:bg-teal-50 font-semibold text-black ${mainView==='settings'?'bg-teal-100':''}`} onClick={()=>setMainView('settings')}>Settings</button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="max-w-6xl mx-auto px-8 py-8">
          {/* Welcome + Summary Statistics */}
          <div className="bg-white rounded-xl shadow p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-teal-700 mb-2">Welcome, {profile === 'Donor' ? 'Donor' : profile === 'NGO' ? 'NGO' : profile === 'Field' ? 'Field Agent' : 'Auditor'}!</h1>
                <p className="text-black text-lg">Transparent disaster aid tracking powered by blockchain + IPFS.</p>
              </div>
              <div className="grid grid-cols-3 gap-6 mt-6 md:mt-0">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-black">Total Donations</span>
                  <span className="text-2xl font-bold text-blue-700">{summary.totalDonationsEth.toFixed(1)} ETH</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-black">Aid Distributed</span>
                  <span className="text-2xl font-bold text-green-700">{summary.aidDistributedEth.toFixed(1)} ETH</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-black">Milestones</span>
                  <span className="text-2xl font-bold text-yellow-700">{summary.milestonesCompleted}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Role-specific main actions */}
          {profile === 'Donor' && !mainView && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <button className="bg-green-600 text-white px-8 py-12 rounded-xl shadow flex flex-col items-center hover:bg-green-700 transition" onClick={()=>setMainView('dashboard')}>
                <span className="text-3xl font-bold mb-2">Dashboard</span>
                <span className="text-black">View donation stats, history, and verification</span>
              </button>
              <button className="bg-white border border-green-600 text-green-600 px-8 py-12 rounded-xl shadow flex flex-col items-center hover:bg-green-50 transition" onClick={()=>window.location.href='/donate'}>
                <span className="text-3xl font-bold mb-2">Donate</span>
                <span className="text-black">Make a donation to any campaign</span>
              </button>
            </div>
          )}

          {profile === 'NGO' && !mainView && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <button className="bg-green-600 text-white px-8 py-12 rounded-xl shadow hover:bg-green-700 transition" onClick={()=>setMainView('ngo-dashboard')}>
                <span className="text-2xl font-bold">NGO Dashboard</span>
                <span className="text-black block mt-1">Track funds, milestones</span>
              </button>
              <button className="bg-white border border-green-600 text-green-600 px-8 py-12 rounded-xl shadow hover:bg-green-50 transition" onClick={()=>setMainView('create-campaign')}>
                <span className="text-2xl font-bold">Create Campaign</span>
                <span className="text-black block mt-1">Start a new aid initiative</span>
              </button>
              <a className="bg-white border border-green-600 text-green-600 px-8 py-12 rounded-xl shadow hover:bg-green-50 transition flex items-center justify-center" href="/verify">
                <span className="text-2xl font-bold">Verify</span>
              </a>
            </div>
          )}

          {profile === 'Field' && !mainView && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <button className="bg-green-600 text-white px-8 py-12 rounded-xl shadow hover:bg-green-700 transition" onClick={()=>setMainView('field-logs')}>
                <span className="text-2xl font-bold">Log Aid Delivery</span>
                <span className="text-black block mt-1">Attach GPS, photos</span>
              </button>
              <button className="bg-white border border-green-600 text-green-600 px-8 py-12 rounded-xl shadow hover:bg-green-50 transition" onClick={()=>window.location.href='/field/upload'}>
                <span className="text-2xl font-bold">Upload Evidence</span>
                <span className="text-black block mt-1">IPFS-backed proof</span>
              </button>
            </div>
          )}

          {profile === 'Auditor' && !mainView && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <button className="bg-green-600 text-white px-8 py-12 rounded-xl shadow hover:bg-green-700 transition" onClick={()=>setMainView('audit-view')}>
                <span className="text-2xl font-bold">Audit Trails</span>
                <span className="text-black block mt-1">Trace donations → aid</span>
              </button>
              <a className="bg-white border border-green-600 text-green-600 px-8 py-12 rounded-xl shadow hover:bg-green-50 transition flex items-center justify-center" href="/verify">
                <span className="text-2xl font-bold">Verify</span>
              </a>
            </div>
          )}

          {/* Donor Dashboard View */}
          {profile === 'Donor' && mainView==='dashboard' && (
            <div className="bg-white rounded-xl shadow p-8">
              <h2 className="text-xl font-bold text-teal-700 mb-4">Donor Dashboard</h2>
              <div className="flex flex-wrap gap-8 mb-8">
                <div className="flex flex-col gap-2">
                  <div className="font-bold text-black">Total Donated: <span className="text-teal-700">2.3 ETH</span></div>
                  <div className="flex gap-4 text-black">
                    <span>4 NGOs</span>
                    <span>2 Active Campaigns</span>
                    <span className="flex items-center gap-1"><span className="bg-green-600 w-4 h-4 rounded-full flex items-center justify-center text-white text-xs">✓</span> Verified Donor</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white rounded-xl border p-4">
                  <div className="font-bold text-black mb-3">Your Donations (Recent)</div>
                  <Line
                    data={{
                      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                      datasets: [
                        { label: 'ETH', data: [0.1, 0.2, 0.05, 0.3, 0.15, 0.4], borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,0.15)', tension: 0.3, fill: true, pointRadius: 3 },
                      ],
                    }}
                    options={{ responsive: true, plugins: { legend: { display: true, position: 'bottom' } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true } } }}
                  />
                </div>
                <div className="bg-white rounded-xl border p-4">
                  <div className="font-bold text-black mb-3">Donations by NGO</div>
                  <Bar
                    data={{
                      labels: ['HopeRelief', 'AidRoute', 'GreenHope', 'EarthquakeAid'],
                      datasets: [
                        { label: 'ETH Donated', data: [0.9, 0.5, 0.3, 0.6], backgroundColor: ['#16a34a', '#22c55e', '#86efac', '#4ade80'] },
                      ],
                    }}
                    options={{ responsive: true, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true } } }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl border p-4">
                  <div className="font-bold text-black mb-3">Fund Allocation</div>
                  <Doughnut
                    data={{
                      labels: ['Food', 'Shelter', 'Medical', 'Logistics'],
                      datasets: [
                        { data: [35, 25, 20, 20], backgroundColor: ['#22c55e', '#86efac', '#34d399', '#bbf7d0'], borderColor: '#ffffff' },
                      ],
                    }}
                    options={{ plugins: { legend: { position: 'bottom' } }, cutout: '60%' }}
                  />
                </div>
                <div className="bg-white rounded-xl border p-4">
                  <div className="font-bold text-black mb-3">Milestones Status</div>
                  <Bar
                    data={{
                      labels: ['HopeRelief', 'AidRoute', 'GreenHope', 'EarthquakeAid'],
                      datasets: [
                        { label: 'Pending', data: [2, 1, 1, 0], backgroundColor: '#fbbf24' },
                        { label: 'Verified', data: [3, 2, 1, 2], backgroundColor: '#60a5fa' },
                        { label: 'Completed', data: [5, 4, 2, 3], backgroundColor: '#22c55e' },
                      ],
                    }}
                    options={{ responsive: true, plugins: { legend: { position: 'bottom' } }, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } } }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="font-bold text-black mb-2">Donation History</div>
                  <table className="w-full text-xs text-black">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>NGO</th>
                        <th>Disaster</th>
                        <th>Amount</th>
                        <th>Tx ID</th>
                        <th>Proof</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>2025-10-01</td>
                        <td>HopeRelief</td>
                        <td>Tsunami</td>
                        <td>0.3 ETH</td>
                        <td>0xA1B2...C3D4</td>
                        <td>GPS</td>
                      </tr>
                      <tr>
                        <td>2025-09-15</td>
                        <td>AidRoute</td>
                        <td>Flood</td>
                        <td>0.1 ETH</td>
                        <td>0xE5F6...G7H8</td>
                        <td>Drone</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <div className="font-bold text-black mb-2">Live Verification</div>
                  <div className="bg-gray-100 rounded p-4 flex gap-4 items-center">
                    <div className="w-24 h-16 bg-green-200 rounded flex items-center justify-center text-black font-bold">Map</div>
                    <div className="flex flex-col gap-1 text-xs text-black">
                      <span>AI: 97% delivery success</span>
                      <span>Avg aid time: 12h</span>
                      <span>No fraud detected</span>
                    </div>
                  </div>
                  <div className="font-bold text-black mt-4 mb-2">NFT Badge</div>
                  <div className="bg-green-100 rounded p-4 flex items-center justify-center text-black font-bold">Verified Donor</div>
                </div>
              </div>
            </div>
          )}

          {/* NGO Dashboard view */}
          {profile === 'NGO' && mainView==='ngo-dashboard' && (
            <div className="bg-white rounded-xl shadow p-8">
              <h2 className="text-xl font-bold text-teal-700 mb-4">NGO Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-teal-50 rounded p-4">
                  <div className="text-xs text-black">Funds Raised</div>
                  <div className="text-2xl font-bold text-teal-700">32.5 ETH</div>
                </div>
                <div className="bg-teal-50 rounded p-4">
                  <div className="text-xs text-black">Aid Distributed</div>
                  <div className="text-2xl font-bold text-teal-700">24.1 ETH</div>
                </div>
                <div className="bg-teal-50 rounded p-4">
                  <div className="text-xs text-black">Active Campaigns</div>
                  <div className="text-2xl font-bold text-teal-700">3</div>
                </div>
              </div>
              <div className="font-bold text-black mb-2">Milestones</div>
              <ul className="text-sm text-black list-disc pl-5">
                <li>5,000 meals delivered in coastal region</li>
                <li>1,200 families received temporary shelters</li>
                <li>Medical camp reached 900 individuals</li>
              </ul>
            </div>
          )}

          {/* Field Agent Logs view */}
          {profile === 'Field' && mainView==='field-logs' && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-teal-700 mb-4">Field Aid Logs</h2>
              <div className="mb-4 text-sm text-black">Recent delivery logs collected by field agents (delivery type transactions).</div>
              {loadingTx ? (
                <div>Loading...</div>
              ) : (
                <div className="space-y-3">
                  {transactions.filter(t => t.type === 'delivery' || t.type === 'logistics' || t.type === 'distribution').length === 0 && (
                    <div className="text-sm text-black/70">No delivery logs found.</div>
                  )}
                  {transactions.filter(t => t.type === 'delivery' || t.type === 'logistics' || t.type === 'distribution').map(tx => (
                    <div key={tx._id || tx.id} className="p-3 border rounded flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-black">{tx.type} — {tx.aidCategory}</div>
                        <div className="text-sm text-black/80">By: {tx.donorId?.name || tx.donorId || tx.from || 'unknown'}</div>
                        <div className="text-sm text-black/70">To: {tx.ngoId?.name || tx.ngoId || tx.recipientId || 'NGO'}</div>
                        <div className="text-sm text-black/70">Amount: {tx.amount ?? '—'}</div>
                        <div className="text-xs text-black/60">Status: {tx.status} • {new Date(tx.createdAt).toLocaleString()}</div>
                        {tx.proof && <div className="mt-2"><button onClick={() => window.open(tx.proof, '_blank')} className="px-2 py-1 rounded border text-sm">View Proof</button></div>}
                      </div>
                      <div className="text-right text-xs text-black/70">
                        <div>Tx ID</div>
                        <div className="font-mono">{tx._id || tx.txId || tx.tx}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Audit Trails view */}
          {profile === 'Auditor' && mainView==='audit-view' && (
            <AuditList logs={auditLogs} loading={loadingAudit} />
          )}

          {/* Transactions view (shows all transactions with details) */}
          {mainView === 'transactions' && (
            <div className="mb-6">
              <TransactionsTable transactions={transactions} loading={loadingTx} />
            </div>
          )}

          {/* Messages view */}
          {mainView === 'messages' && (
            <MessagesPanel
              conversations={conversations}
              selectedConversation={selectedConversation}
              onSelect={handleSelectConversation}
              onSend={handleSendMessage}
            />
          )}

          {/* Profile view (basic sign-in + details) */}
          {mainView === 'profile' && (
            <ProfilePanel user={user} onSignOut={handleSignOut} onSignIn={handleSignIn} />
          )}

          {/* Recent transactions and aid logs feed */}
          <div className="bg-white rounded-xl shadow p-6 mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-teal-700">Recent Activity</h3>
              <span className="text-xs text-black">Last 24 hours</span>
            </div>
            <div className="flex flex-col divide-y">
              {recentEvents.map(ev => (
                <div key={ev.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${ev.type==='donation'?'bg-blue-600':ev.type==='distribution'?'bg-green-600':'bg-yellow-600'}`}></span>
                    <div className="text-sm text-black">
                      <div className="font-semibold">{ev.title}</div>
                      <div className="text-black/70">By {ev.actor}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    {typeof ev.amountEth === 'number' && (
                      <div className="text-sm font-semibold text-black">{ev.amountEth.toFixed(2)} ETH</div>
                    )}
                    <div className="text-xs text-black/70">{ev.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
