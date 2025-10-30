"use client";
import React from 'react';
import Navbar from '../../components/Navbar';

export default function AdminPage() {
  const users = [
    { id: 'u1', name: 'Alice', role: 'Donor', status: 'active' },
    { id: 'u2', name: 'ReliefOrg', role: 'NGO', status: 'active' },
    { id: 'u3', name: 'GovDept', role: 'Government', status: 'suspended' },
  ];
  const logs = [
    { id: 'l1', time: '5m', message: 'Milestone verified by AidRoute' },
    { id: 'l2', time: '18m', message: 'Donation processed: 0.50 ETH' },
    { id: 'l3', time: '1h', message: 'User suspended: GovDept' },
  ];

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
          <h1 className="text-3xl font-bold text-teal-700 mb-6">Admin Panel</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow p-6 overflow-x-auto">
              <h2 className="text-lg font-bold text-teal-700 mb-4">Users & Roles</h2>
              <table className="w-full text-sm text-left text-black">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-t">
                      <td className="py-2">{u.name}</td>
                      <td className="py-2">{u.role}</td>
                      <td className="py-2">{u.status}</td>
                      <td className="py-2">
                        <button className="px-2 py-1 text-xs rounded border border-green-600 text-green-600 hover:bg-green-50 mr-2">Edit</button>
                        <button className="px-2 py-1 text-xs rounded border border-red-600 text-red-600 hover:bg-red-50">{u.status==='active'?'Suspend':'Activate'}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold text-teal-700 mb-4">System Health & Audit Logs</h2>
              <ul className="text-sm text-black list-disc pl-5">
                {logs.map(l => (
                  <li key={l.id}><span className="text-black/70">{l.time}:</span> {l.message}</li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


