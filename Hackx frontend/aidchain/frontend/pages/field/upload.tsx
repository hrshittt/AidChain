"use client";
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import { useParams } from 'next/navigation';

export default function FieldUpload() {
  const params = useParams();
  const qBatchId = params?.batchId as string | undefined;
  const [batchId, setBatchId] = useState(qBatchId || '');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lon, setLon] = useState<number | undefined>(undefined);
  const [timestamp, setTimestamp] = useState<string>(new Date().toISOString());
  const [status, setStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (qBatchId) setBatchId(qBatchId);
  }, [qBatchId]);

  async function captureLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLon(pos.coords.longitude);
      },
      (err) => {
        console.warn('Geolocation error', err);
        alert('Unable to get location');
      },
      { enableHighAccuracy: true }
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return alert('Please select a photo');
    if (!batchId) return alert('Batch ID required');
    setStatus('Preparing upload...');

    try {
      // Attempt to get agent address from wallet
      let agentAddr = '';
      if ((window as any).ethereum) {
        try {
          const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
          agentAddr = accounts && accounts[0] ? accounts[0] : '';
        } catch (e) { /* ignore */ }
      }

      const form = new FormData();
      form.append('file', file);
      form.append('batchId', batchId);
      if (lat != null) form.append('lat', String(lat));
      if (lon != null) form.append('lon', String(lon));
      form.append('timestamp', timestamp);
      form.append('agentAddr', agentAddr);

      setStatus('Uploading to backend...');
      setProgress(0);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      // Use XMLHttpRequest to track upload progress for a progress bar
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${apiUrl}/api/evidence/upload`);
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const json = JSON.parse(xhr.responseText);
                if (json.success) {
                  setStatus('Upload successful: ' + json.cid);
                  setProgress(100);
                  resolve();
                } else {
                  setStatus('Upload failed: ' + (json.error || 'unknown'));
                  reject(new Error('Upload failed'));
                }
              } catch (e) {
                setStatus('Upload failed: invalid response');
                reject(e);
              }
            } else {
              setStatus('Upload failed: ' + xhr.statusText);
              reject(new Error(xhr.statusText));
            }
          }
        };
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const pct = Math.round((event.loaded / event.total) * 100);
            setProgress(pct);
          }
        };
        xhr.onerror = () => {
          setStatus('Upload error');
          reject(new Error('Network error'));
        };
        xhr.send(form);
      });
    } catch (err) {
      console.error('Upload error', err);
      setStatus('Upload error');
    }
  }

  return (
    <div className="min-h-screen bg-teal-50">
      <Head>
        <title>Field Upload — AidChain</title>
      </Head>
      <Navbar />

      <main className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-semibold text-teal-700">Field Evidence Upload</h1>
        <p className="text-sm text-gray-600">Capture photo (camera-friendly), attach GPS and submit evidence for a batch.</p>

        <form onSubmit={onSubmit} className="mt-6 bg-white p-4 rounded shadow space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Batch ID</label>
            <input value={batchId} onChange={(e) => setBatchId(e.target.value)} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Photo (use camera on mobile)</label>
            <input accept="image/*" capture="environment" type="file" onChange={(e) => { const f = e.target.files ? e.target.files[0] : null; setFile(f); if (f) setPreviewUrl(URL.createObjectURL(f)); else setPreviewUrl(null); }} />
            {previewUrl && (
              <div className="mt-2">
                <div className="text-xs text-gray-600">Preview:</div>
                <img src={previewUrl} alt="preview" className="mt-1 max-h-48 rounded border" />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button type="button" onClick={captureLocation} className="bg-teal-600 text-white px-3 py-1 rounded">Capture GPS</button>
            <div className="text-sm text-gray-600">GPS: {lat ?? '—'}, {lon ?? '—'}</div>
          </div>

          <div>
            <label className="block text-sm text-gray-700">Timestamp</label>
            <input type="datetime-local" value={new Date(timestamp).toISOString().slice(0,16)} onChange={(e) => setTimestamp(new Date(e.target.value).toISOString())} className="border rounded px-3 py-2" />
          </div>

          <div>
            <button className="bg-green-600 text-white px-4 py-2 rounded">Upload Evidence</button>
          </div>

          {status && <div className="text-sm text-gray-700">{status}</div>}
          {progress > 0 && (
            <div className="mt-2 w-full bg-gray-200 rounded">
              <div style={{ width: `${progress}%` }} className="bg-green-600 text-white text-xs text-center rounded py-1">{progress}%</div>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
