"use client";
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/navigation';

type Role = 'Donor' | 'NGO' | 'Government' | 'Recipient';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('Donor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // Placeholder for real auth
      await new Promise(r => setTimeout(r, 600));
      const dest = role === 'Donor' ? '/donor/dashboard' : role === 'NGO' ? '/ngo/dashboard' : '/';
      router.push(dest);
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
          <a className="text-left px-4 py-2 rounded hover:bg-teal-50 font-semibold text-black" href="/register">Register</a>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="max-w-xl mx-auto w-full px-8 py-10">
          <h1 className="text-3xl font-bold text-teal-700 mb-6">Login</h1>

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

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="text-sm text-black/70">
              New here? <a href="/register" className="text-teal-700 font-semibold">Create an account</a>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}



