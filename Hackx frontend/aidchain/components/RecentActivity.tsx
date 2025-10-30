"use client";
import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type Activity = { amount: number; department: string; coin: string; txId: string; createdAt?: string };

let socket: Socket | null = null;

export default function RecentActivity() {
  const [items, setItems] = useState<Activity[]>(() => {
    try {
      const raw = localStorage.getItem('recentActivity');
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  });

  useEffect(() => {
    // connect to backend realtime server
    if (!socket) {
      socket = io('http://localhost:5000');
    }
    socket.on('donation', (payload: Activity) => {
      setItems(prev => {
        const next = [payload, ...prev].slice(0, 10);
        try { localStorage.setItem('recentActivity', JSON.stringify(next)); } catch (e) {}
        return next;
      });
    });
    return () => {
      if (socket) {
        socket.off('donation');
      }
    };
  }, []);

  return (
    <div className="bg-white rounded-xl p-4 mb-6 shadow">
      <h3 className="text-lg font-semibold text-teal-700 mb-2">Recent Activity (real-time)</h3>
      {items.length === 0 ? (
        <div className="text-sm text-gray-600">No recent donations yet.</div>
      ) : (
        <ul className="space-y-2">
          {items.map((it, i) => (
            <li key={it.txId || i} className="flex items-center justify-between border p-2 rounded">
              <div>
                <div className="text-sm text-black">{it.department}</div>
                <div className="text-xs text-gray-600">{it.createdAt ? new Date(it.createdAt).toLocaleString() : ''}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-black">{it.amount} {it.coin || 'ETH'}</div>
                <div className="text-xs text-gray-600">{it.txId}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
