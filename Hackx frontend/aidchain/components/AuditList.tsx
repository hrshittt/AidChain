"use client";
import React from 'react';

export default function AuditList({ logs, loading }: { logs: any[]; loading: boolean; }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold text-teal-700 mb-4">Audit Trails</h2>
      {loading ? (
        <div>Loading audit logs...</div>
      ) : (
        <div>
          {logs.length === 0 ? (
            <div className="text-sm text-black/70">No audit logs available. This endpoint may require admin authentication.</div>
          ) : (
            <div className="space-y-3">
              {logs.map((l: any) => (
                <div key={l._id || l.id} className="p-3 border rounded">
                  <div className="text-sm text-black font-semibold">{l.action} — {l.entity}</div>
                  <div className="text-xs text-black/70">By: {l.user?.name || l.user || l.role} on {new Date(l.createdAt).toLocaleString()}</div>
                  <div className="text-sm text-black mt-2">{l.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
