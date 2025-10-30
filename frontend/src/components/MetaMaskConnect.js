import React from "react";
import { useMetaMask } from "./MetaMaskContext";

export default function MetaMaskConnect() {
  const { account, isConnected, connect, disconnect, isLoading } = useMetaMask();

  return (
    <div className="flex items-center gap-3">
      {isConnected ? (
        <>
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">{account.slice(0,6)}...{account.slice(-4)}</span>
          <button onClick={disconnect} className="border px-2 py-1 rounded bg-gray-200 hover:bg-red-400 hover:text-white">Disconnect</button>
        </>
      ) : (
        <button disabled={isLoading} onClick={connect} className="bg-yellow-400 px-4 py-1 rounded hover:bg-yellow-600 text-gray-900 font-bold border">
          {isLoading ? "Connecting..." : "Connect MetaMask"}
        </button>
      )}
    </div>
  );
}
