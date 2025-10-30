"use client";
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from '../../../components/Navbar';
import { getProviderOnly } from '../../../lib/ethers';
import { useParams } from 'next/navigation';

type EvidenceItem = {
  _id: string;
  cid: string;
  ipfs: string;
  filename?: string;
  lat?: number;
  lon?: number;
  timestamp?: string;
  agentAddr?: string;
};

export default function VerifyPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [flags, setFlags] = useState<any[]>([]);
  const [txInfo, setTxInfo] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://localhost:5000';
      try {
        const res = await fetch(`${apiUrl}/api/evidence/batch/${encodeURIComponent(id)}`);
        const json = await res.json();
        if (json.success) setEvidence(json.evidence || []);

        const aiUrl = process.env.NEXT_PUBLIC_AI_URL || 'http://localhost:6000';
        const evListForAi = (json.evidence || []).map((e: any) => ({ cid: e.cid, lat: e.lat, lon: e.lon, timestamp: e.timestamp, hash: e.cid }));
        const aiRes = await fetch(`${aiUrl}/ai/check`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ batchId: id, evidenceList: evListForAi }) });
        const aiJson = await aiRes.json();
        setFlags(aiJson.flags || []);

        if (typeof id === 'string' && id.startsWith('0x') && id.length >= 66 && (window as any).ethereum) {
          try {
            const provider = await getProviderOnly();
            const tx = await provider.getTransaction(id);
            setTxInfo(tx || null);
          } catch (e) {
            console.warn('Could not fetch tx', e);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className="min-h-screen bg-teal-50">
      <Head>
        <title>Verify — AidChain</title>
      </Head>
      <Navbar />

      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold text-teal-700">Verify Batch</h1>
        <p className="text-sm text-gray-600 mt-1">Batch ID: <strong>{id}</strong></p>

        {loading && <div className="mt-4">Loading evidence and AI flags…</div>}

        {txInfo && (
          <div className="mt-4 bg-white p-4 rounded shadow">
            <h3 className="font-medium">Transaction</h3>
            <p className="text-sm">Hash: <a className="text-blue-600" href={`${process.env.NEXT_PUBLIC_EXPLORER || 'https://mumbai.polygonscan.com/tx/'}${txInfo.hash}`} target="_blank" rel="noreferrer">{txInfo.hash}</a></p>
            <p className="text-sm">From: {txInfo.from}</p>
            <p className="text-sm">To: {txInfo.to}</p>
            <p className="text-sm">Value: {txInfo.value ? txInfo.value.toString() : '—'}</p>
          </div>
        )}

        <div className="mt-6 bg-white p-4 rounded shadow">
          <h3 className="font-medium">Evidence ({evidence.length})</h3>
          {evidence.length === 0 && <p className="text-sm text-gray-500">No evidence found for this batch.</p>}
          <ul className="mt-3 space-y-3">
            {evidence.map((e) => (
              <li key={e._id} className="border rounded p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{e.filename || e.cid}</div>
                    <div className="text-xs text-gray-600">CID: <a className="text-blue-600" href={e.ipfs} target="_blank" rel="noreferrer">{e.cid}</a></div>
                  </div>
                  <div className="text-sm text-gray-500">{e.timestamp ? new Date(e.timestamp).toLocaleString() : ''}</div>
                </div>
                <div className="mt-2 text-xs text-gray-600">Agent: {e.agentAddr || '—'} | GPS: {e.lat ?? '—'},{e.lon ?? '—'}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 bg-white p-4 rounded shadow">
          <h3 className="font-medium">AI Flags</h3>
          {flags.length === 0 ? (
            <p className="text-sm text-green-600">No flags detected.</p>
          ) : (
            <ul className="mt-2 list-disc pl-5 space-y-2">
              {flags.map((f, idx) => (
                <li key={idx} className="text-sm text-red-600">{f.rule}: {f.reason}</li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
