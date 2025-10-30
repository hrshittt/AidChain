import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getAidDistributionContract } from "../utils/contract";

export default function PublicDashboard() {
  const [aids, setAids] = useState([]);
  useEffect(() => {
    async function load() {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum || undefined);
        const contract = getAidDistributionContract(provider);
        const all = await contract.getAllAids();
        setAids(all.map((aid, id) => ({ ...aid, id })));
      } catch {
        setAids([]);
      }
    }
    load();
  }, []);
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Public Transparency Dashboard</h1>
      <div className="bg-white p-4 rounded shadow">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="p-2">Donor</th>
              <th>NGO</th>
              <th>Beneficiary</th>
              <th>Purpose</th>
              <th>Amount (ETH)</th>
              <th>Delivered</th>
            </tr>
          </thead>
          <tbody>
            {aids.length === 0 ? (
              <tr><td colSpan={6}>No data</td></tr>
            ) : aids.map(aid => (
              <tr key={aid.id} className={aid.delivered ? "bg-green-50" : ""}>
                <td className="p-2">{aid.donor}</td>
                <td>{aid.ngo}</td>
                <td>{aid.beneficiary}</td>
                <td>{aid.purpose}</td>
                <td>{ethers.formatEther ? ethers.formatEther(aid.amount) : aid.amount.toString()}</td>
                <td>{aid.delivered ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
