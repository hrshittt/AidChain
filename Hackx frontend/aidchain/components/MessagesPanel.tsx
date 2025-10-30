"use client";
import React from 'react';

export default function MessagesPanel({ conversations, selectedConversation, onSelect, onSend }: any) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold text-teal-700 mb-4">Messages</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 border rounded p-2">
          <div className="font-semibold mb-2">Conversations</div>
          <div className="space-y-2">
            {conversations.length === 0 && <div className="text-sm text-black/70">No conversations yet.</div>}
            {conversations.map((c: any, i: number) => (
              <div key={i} className={`p-2 rounded cursor-pointer ${selectedConversation===c? 'bg-teal-50':''}`} onClick={() => onSelect(c)}>
                <div className="font-semibold text-black">{c.withName || c.with}</div>
                <div className="text-xs text-black/70">{c.messages?.slice(-1)[0]?.text || 'No messages'}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-2 border rounded p-2">
          {selectedConversation ? (
            <div className="flex flex-col h-[60vh]">
              <div className="flex-1 overflow-auto p-2 space-y-2">
                {selectedConversation.messages.map((m:any, idx:number) => (
                  <div key={idx} className={`p-2 rounded ${m.from==='me' ? 'bg-green-50 self-end' : 'bg-gray-100 self-start'}`}>{m.text}<div className="text-xs text-black/60">{new Date(m.ts).toLocaleString()}</div></div>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                <input id="msg-input-panel" className="flex-1 border px-3 py-2 rounded text-black" placeholder="Write a message" />
                <button onClick={() => {
                  const el = document.getElementById('msg-input-panel') as HTMLInputElement | null;
                  const text = el?.value?.trim();
                  if (!text) return;
                  onSend(selectedConversation, { from: 'me', text, ts: new Date().toISOString() });
                  if (el) el.value = '';
                }} className="px-3 py-2 rounded bg-emerald-600 text-white">Send</button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-black/70">Select a conversation or start a new one from an NGO profile.</div>
          )}
        </div>
      </div>
    </div>
  );
}
