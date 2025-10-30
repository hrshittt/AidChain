import React from "react";
import { Link } from "react-router-dom";
import MetaMaskConnect from "../components/MetaMaskConnect";

export default function Home() {
  return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center text-center p-8 bg-gradient-to-br from-blue-50 to-white">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 text-blue-900">Aid Distribution Transparency Platform</h1>
      <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl">A blockchain-powered platform to ensure transparent, auditable, and accountable disaster aid distribution.<br/>Choose your role to get started:</p>
      <div className="flex flex-col md:flex-row gap-6 mb-10">
        <Link to="/donor" className="bg-blue-600 hover:bg-blue-800 text-white px-8 py-4 rounded-lg font-semibold shadow-lg transition-all text-lg">Donor</Link>
        <Link to="/ngo" className="bg-green-500 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold shadow-lg transition-all text-lg">NGO</Link>
        <Link to="/public" className="bg-yellow-400 hover:bg-yellow-600 text-gray-900 px-8 py-4 rounded-lg font-semibold shadow-lg transition-all text-lg">Public</Link>
      </div>
      <MetaMaskConnect />
      <div className="mt-6 text-gray-500 text-xs">Built for transparency. Powered by Ethereum &amp; Polygon.</div>
    </div>
  );
}
