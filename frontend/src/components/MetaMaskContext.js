import React, { createContext, useContext, useState, useEffect } from "react";

const MetaMaskContext = createContext();

export function MetaMaskProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      setAccount(window.ethereum.selectedAddress);
      setIsConnected(true);
    }
    // Listen for account change
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0] || null);
        setIsConnected(accounts.length > 0);
      });
    }
  }, []);

  const connect = async () => {
    if (!window.ethereum) return alert("MetaMask not detected");
    setIsLoading(true);
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      setIsConnected(true);
    } catch (err) {
      setIsConnected(false);
    }
    setIsLoading(false);
  };

  const disconnect = () => {
    setAccount(null);
    setIsConnected(false);
  };

  return (
    <MetaMaskContext.Provider value={{ account, isConnected, isLoading, connect, disconnect }}>
      {children}
    </MetaMaskContext.Provider>
  );
}

export const useMetaMask = () => useContext(MetaMaskContext);
