"use client";
import React from 'react';

export default function ProfilePanel({ user, onSignOut, onSignIn }: any) {
  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-2xl">
      {!user ? (
        <div>
          <h2 className="text-xl font-bold text-teal-700 mb-4">Sign in</h2>
          <div className="space-y-3">
            <input id="login-email-panel" placeholder="Email" className="w-full border px-3 py-2 rounded text-black" />
            <input id="login-pass-panel" placeholder="Password" type="password" className="w-full border px-3 py-2 rounded text-black" />
            <div className="flex gap-2 justify-end">
              <button onClick={() => {
                const email = (document.getElementById('login-email-panel') as HTMLInputElement).value;
                const name = email.split('@')[0] || 'Donor';
                onSignIn({ email, name });
              }} className="px-3 py-2 rounded bg-emerald-600 text-white">Sign in</button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold text-teal-700 mb-4">Profile</h2>
          <div className="mb-4">Name: <strong className="text-black">{user.name}</strong></div>
          <div className="mb-4">Email: <strong className="text-black">{user.email}</strong></div>
          <div className="mb-4">Role: <strong className="text-black">{user.role}</strong></div>
          <div className="flex gap-2">
            <button onClick={onSignOut} className="px-3 py-2 rounded border">Sign out</button>
          </div>
        </div>
      )}
    </div>
  );
}
