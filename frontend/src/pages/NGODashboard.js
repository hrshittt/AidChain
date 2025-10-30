import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useMetaMask } from "../components/MetaMaskContext";
import { getAidDistributionContract } from "../utils/contract";

export default function NGODashboard() {
  const { account, isConnected } = useMetaMask();
  const [aids, setAids] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchAids() {
    if (!isConnected || !account) return setAids([]);
    setMsg("");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = getAidDistributionContract(provider);
    const all = await contract.getAllAids();
    setAids(all.map((aid, id) => ({ ...aid, id })).filter(aid => aid.ngo.toLowerCase() === account.toLowerCase()));
  }

  useEffect(() => { fetchAids(); }, [account, isConnected]);

  const handleConfirm = async (aid) => {
    setMsg("");
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getAidDistributionContract(signer);
      // For MVP, let NGO specify a beneficiary address (prompt)
      const beneficiary = prompt("Enter beneficiary address who received the aid:");
      if (!beneficiary) throw new Error("Beneficiary required");
      const tx = await contract.confirmDelivery(aid.id, beneficiary);
      await tx.wait();
      setMsg("Delivery confirmed on-chain. Funds released.");
      await fetchAids();
    } catch (err) {
      setMsg(err.reason || err.message || "Transaction failed");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">NGO Dashboard</h1>
      {msg && <div className="mb-2 p-2 bg-green-50 border rounded text-sm">{msg}</div>}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">Donations Addressed to This NGO</h2>
        {aids.length === 0 ? (
          <div>No donations for your account.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-gray-100">
                <th className="p-2">Donor</th><th>Purpose</th><th>Amount (ETH)</th><th>Delivered</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {aids.map(aid => (
                <tr key={aid.id} className={aid.delivered ? "bg-green-100" : ""}>
                  <td className="p-2">{aid.donor}</td>
                  <td>{aid.purpose}</td>
                  <td>{ethers.formatEther ? ethers.formatEther(aid.amount) : aid.amount.toString()}</td>
                  <td>{aid.delivered ? "Yes" : "No"}</td>
                  <td>
                    {!aid.delivered ? (
                      <button onClick={() => handleConfirm(aid)} disabled={loading} className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs">{loading ? "Processing..." : "Confirm Delivery"}</button>
                    ) : (
                      <span className="text-green-700">Released</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
