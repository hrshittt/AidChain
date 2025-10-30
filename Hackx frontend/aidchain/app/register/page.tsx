"use client";
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/navigation';

type Role = 'Donor' | 'NGO' | 'Government' | 'Recipient';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('Donor');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      alert('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      // Placeholder for real registration
      await new Promise(r => setTimeout(r, 800));
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex">
      <aside className="w-64 bg-white shadow-lg flex flex-col py-8 px-4 min-h-screen">
        <h2 className="text-2xl font-bold text-teal-700 mb-8">AidChain</h2>
        <nav className="flex flex-col gap-4">
          <a className="text-left px-4 py-2 rounded hover:bg-teal-50 font-semibold text-black" href="/">Home</a>
          <a className="text-left px-4 py-2 rounded hover:bg-teal-50 font-semibold text-black" href="/login">Login</a>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="max-w-xl mx-auto w-full px-8 py-10">
          <h1 className="text-3xl font-bold text-teal-700 mb-6">Create Account</h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Role</label>
              <select
                className="w-full px-3 py-2 rounded border text-black bg-white"
                value={role}
                onChange={e => setRole(e.target.value as Role)}
              >
                <option>Donor</option>
                <option>NGO</option>
                <option>Government</option>
                <option>Recipient</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-1">Name</label>
              <input
                className="w-full px-3 py-2 rounded border text-black bg-white"
                placeholder="Your full name / organization"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-1">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 rounded border text-black bg-white"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 rounded border text-black bg-white"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-1">Confirm Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 rounded border text-black bg-white"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'Create account'}
            </button>

            <div className="text-sm text-black/70">
              Already have an account? <a href="/login" className="text-teal-700 font-semibold">Sign in</a>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}



