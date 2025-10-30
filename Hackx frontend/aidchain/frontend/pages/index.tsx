"use client";
import React, { useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [batchId, setBatchId] = useState('');
  const router = useRouter();

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!batchId) return;
    router.push(`/verify/${encodeURIComponent(batchId)}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <Head>
        <title>AidChain — Transparent Disaster Aid</title>
      </Head>
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <section className="text-center">
          <h1 className="text-4xl font-bold text-teal-700">AidChain</h1>
          <p className="mt-4 text-gray-700 text-lg">Bringing transparency to disaster aid distribution with blockchain + IPFS.</p>

          <div className="mt-8 flex justify-center">
            <a href="/donate" className="bg-green-600 text-white px-6 py-3 rounded mr-4">Donate</a>
            <a href="/" className="border border-green-600 text-green-600 px-6 py-3 rounded">Learn more</a>
          </div>

          <div className="mt-12 bg-white rounded shadow p-6">
            <form onSubmit={onSearch} className="flex max-w-xl mx-auto">
              <input
                className="flex-1 border rounded-l px-3 py-2"
                placeholder="Enter batch ID to verify"
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
              />
              <button className="bg-teal-600 text-white px-4 rounded-r">Verify</button>
            </form>
            <p className="mt-3 text-sm text-gray-500">Public verification: view on-chain timeline and IPFS evidence for any batch.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
