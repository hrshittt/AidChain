"use client";
import React from 'react';

export default function TransactionsTable({ transactions, loading }: { transactions: any[]; loading: boolean; }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold text-teal-700 mb-4">All Transactions</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-sm text-left text-black">
            <thead>
              <tr className="border-b">
                <th className="px-2 py-2">Date</th>
                <th className="px-2 py-2">Type</th>
                <th className="px-2 py-2">Category</th>
                <th className="px-2 py-2">Donor</th>
                <th className="px-2 py-2">NGO / Recipient</th>
                <th className="px-2 py-2">Amount</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Tx ID</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx._id || tx.id} className="border-b hover:bg-gray-50">
                  <td className="px-2 py-2 align-top">{new Date(tx.createdAt).toLocaleString()}</td>
                  <td className="px-2 py-2 align-top">{tx.type}</td>
                  <td className="px-2 py-2 align-top">{tx.aidCategory}</td>
                  <td className="px-2 py-2 align-top">{tx.donorName || tx.donorId?.name || tx.donorId || '—'}</td>
                  <td className="px-2 py-2 align-top">{tx.ngoName || tx.ngoId?.name || tx.ngoId || tx.recipientId || '—'}</td>
                  <td className="px-2 py-2 align-top">{tx.amount ?? '—'}</td>
                  <td className="px-2 py-2 align-top">{tx.status}</td>
                  <td className="px-2 py-2 align-top font-mono">{tx._id || tx.txId || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
