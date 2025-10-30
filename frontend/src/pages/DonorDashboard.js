import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useMetaMask } from "../components/MetaMaskContext";
import { getAidDistributionContract } from "../utils/contract";

export default function DonorDashboard() {
  const { account, isConnected } = useMetaMask();
  const [ngo, setNgo] = useState("");
  const [purpose, setPurpose] = useState("");
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [fetching, setFetching] = useState(false);

  // Fetch donations by this account
  useEffect(() => {
    if (!isConnected || !account) return;
    setFetching(true);
    async function fetchHistory() {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = getAidDistributionContract(provider);
      // getAllAids() returns array; filter by donor
      const aids = await contract.getAllAids();
      const userAids = aids
        .map((aid, idx) => ({...aid, id: idx}))
        .filter(aid => aid.donor.toLowerCase() === account.toLowerCase());
      setHistory(userAids);
      setFetching(false);
    }
    fetchHistory();
  }, [account, isConnected]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (!ngo || !amount || !purpose) return setMsg("All fields required");
    if (!isConnected) return setMsg("Connect MetaMask");
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getAidDistributionContract(signer);
      const tx = await contract.donate(ngo, purpose, { value: ethers.parseEther(amount) });
      await tx.wait();
      setMsg("Donation successful!");
      setNgo(""); setPurpose(""); setAmount("");
      // Refresh history
      const aids = await contract.getAllAids();
      const userAids = aids.map((aid, idx) => ({...aid, id: idx})).filter(aid => aid.donor.toLowerCase() === account.toLowerCase());
      setHistory(userAids);
    } catch (err) {
      setMsg(err.reason || err.message || "Transaction failed");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Donor Dashboard</h1>
      {msg && <div className="mb-2 p-2 bg-yellow-100 border rounded text-sm">{msg}</div>}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <div className="mb-2">
          <label className="block font-semibold">NGO Address</label>
          <input type="text" value={ngo} onChange={e => setNgo(e.target.value)} disabled={loading} className="w-full border rounded p-2" />
        </div>
        <div className="mb-2">
          <label className="block font-semibold">Purpose</label>
          <input type="text" value={purpose} onChange={e => setPurpose(e.target.value)} disabled={loading} className="w-full border rounded p-2" />
        </div>
        <div className="mb-2">
          <label className="block font-semibold">Amount (ETH)</label>
          <input type="number" min="0.0001" step="0.0001" value={amount} onChange={e => setAmount(e.target.value)} disabled={loading} className="w-full border rounded p-2" />
        </div>
        <button type="submit" disabled={loading} className="bg-blue-600 text-white py-2 px-4 rounded mt-2">{loading ? "Donating..." : "Donate"}</button>
      </form>
      <div className="bg-gray-50 p-4 rounded shadow">
        <h2 className="font-semibold mb-2">My Donations</h2>
        {fetching ? (<div>Loading donations...</div>) : history.length === 0 ? (<div>No donation history</div>) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-gray-100">
                <th className="p-2">NGO</th><th>Purpose</th><th>Amount (ETH)</th><th>Delivered</th>
              </tr>
            </thead>
            <tbody>
              {history.map((aid, idx) => (
                <tr key={idx} className={aid.delivered ? "bg-green-100" : ""}>
                  <td className="p-2">{aid.ngo}</td>
                  <td>{aid.purpose}</td>
                  <td>{ethers.formatEther ? ethers.formatEther(aid.amount) : aid.amount.toString()}</td>
                  <td>{aid.delivered ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
