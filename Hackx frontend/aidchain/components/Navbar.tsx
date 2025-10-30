"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { shortenAddress } from '../utils/shorten';

// Minimal navbar with wallet connect and role selector
export default function Navbar() {
  const [address, setAddress] = useState<string | null>(null);
  const [role, setRole] = useState('Donor');
  const router = useRouter();

  useEffect(() => {
    // Auto-reconnect using localStorage so the wallet stays connected after reload
    const saved = localStorage.getItem('connectedAddress');
    const provider = (window as any).ethereum;

    const setAndSave = (addr: string | null) => {
      if (addr) {
        setAddress(addr);
        localStorage.setItem('connectedAddress', addr);
      } else {
        setAddress(null);
        localStorage.removeItem('connectedAddress');
      }
    };

    if (saved) {
      setAddress(saved);
    }

    // If provider available, check current authorized accounts and keep in sync
    const tryRestoreFromProvider = async () => {
      try {
        if (provider && provider.request) {
          const accounts: string[] = await provider.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            setAndSave(accounts[0]);
          } else if (saved) {
            // previously saved but provider has no access now
            setAndSave(null);
          }
        }
      } catch (err) {
        console.warn('Error checking accounts', err);
      }
    };
    tryRestoreFromProvider();

    // Listen for account changes and update state/localStorage
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts && accounts.length > 0) {
        setAndSave(accounts[0]);
      } else {
        setAndSave(null);
      }
    };

    if (provider && provider.on) {
      provider.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (provider && provider.removeListener) {
        provider.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  async function connect() {
    // detect provider via window.ethereum first
    const provider = (window as any).ethereum;
    if (!provider) {
      alert('No Ethereum provider found. Please install MetaMask.');
      return;
    }

    try {
      const accounts: string[] = await provider.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        localStorage.setItem('connectedAddress', accounts[0]);
        // optional success feedback
        // alert('Wallet connected');
      }
    } catch (err: any) {
      if (err && (err.code === 4001 || err.message?.toLowerCase?.().includes('user rejected'))) {
        // user rejected
        console.warn('User rejected the request to connect wallet');
        alert('Connection request was rejected.');
      } else {
        console.error('Error connecting to wallet', err);
        alert('Error connecting to wallet: ' + (err?.message || err));
      }
    }
  }

  function disconnect() {
    try {
      setAddress(null);
      localStorage.removeItem('connectedAddress');
      // optional: inform user
      // alert('Wallet disconnected');
    } catch (err) {
      console.error('Error disconnecting', err);
      alert('Error disconnecting wallet');
    }
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-semibold text-teal-600">AidChain</div>
          <div className="text-sm text-gray-600">Transparent disaster aid tracking</div>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
            aria-label="Select role"
          >
            <option>Donor</option>
            <option>NGO</option>
            <option>Field</option>
            <option>Auditor</option>
          </select>

          {address ? (
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-700 bg-green-100 px-3 py-1 rounded">{shortenAddress(address)}</div>
              <button onClick={disconnect} className="text-sm text-red-600 px-2 py-1">
                Disconnect
              </button>
            </div>
          ) : (
            <button onClick={connect} className="bg-teal-600 text-white px-3 py-1 rounded">
              Connect Wallet
            </button>
          )}
          <button title="Inbox" onClick={() => {
            // dispatch event to open messages panel in the main page
            try { window.dispatchEvent(new CustomEvent('openMessages')); } catch (e) {}
          }} className="relative bg-white border rounded px-2 py-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor"><path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H6l-4 3V5z" /></svg>
            <span id="inbox-count" className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 rounded-full">{(() => {
              try {
                const cs = localStorage.getItem('conversations');
                if (!cs) return 0;
                const arr = JSON.parse(cs);
                let unread = 0;
                for (const c of arr) {
                  unread += (c.messages || []).filter((m:any) => !m.read && m.from !== 'me').length;
                }
                return unread > 99 ? '99+' : unread;
              } catch (e) { return 0; }
            })()}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
