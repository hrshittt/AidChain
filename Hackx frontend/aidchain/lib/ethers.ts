// Helper to instantiate provider, signer and contract (client-side)
import { BrowserProvider, Contract } from 'ethers';

// Allow access to window.ethereum in TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Load contract address from env (set NEXT_PUBLIC_CONTRACT_ADDRESS)
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

// Fetch ABI from public folder at runtime
async function loadAbi() {
  const res = await fetch('/aidabi.json');
  return res.json();
}

export async function getProviderAndContract() {
  if (!window.ethereum) throw new Error('No web3 provider found');
  const provider = new BrowserProvider(window.ethereum as any);
  const signer = await provider.getSigner();
  const abi = await loadAbi();
  const contract = new Contract(CONTRACT_ADDRESS, abi, signer);
  return { provider, signer, contract };
}

export async function getProviderOnly() {
  if (!window.ethereum) throw new Error('No web3 provider found');
  const provider = new BrowserProvider(window.ethereum as any);
  return provider;
}

export {};
