import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import DonorDashboard from "./pages/DonorDashboard";
import NGODashboard from "./pages/NGODashboard";
import PublicDashboard from "./pages/PublicDashboard";
import Home from "./pages/Home";
import { MetaMaskProvider } from "./components/MetaMaskContext";
import MetaMaskConnect from "./components/MetaMaskConnect";

function Layout({ children }) {
  // Only show top nav if not home
  const location = useLocation();
  if (location.pathname === "/") return children;
  return (
    <>
      <nav className="bg-blue-700 p-4 text-white flex gap-6 items-center justify-between">
        <div className="flex gap-6">
          <Link to="/donor" className="hover:underline">Donor</Link>
          <Link to="/ngo" className="hover:underline">NGO</Link>
          <Link to="/public" className="hover:underline">Public</Link>
        </div>
        <MetaMaskConnect />
      </nav>
      {children}
    </>
  );
}

function App() {
  return (
    <MetaMaskProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="*"
            element={
              <Layout>
                <Routes>
                  <Route path="/donor" element={<DonorDashboard />} />
                  <Route path="/ngo" element={<NGODashboard />} />
                  <Route path="/public" element={<PublicDashboard />} />
                  <Route path="*" element={<Navigate to="/public" />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
    </MetaMaskProvider>
  );
}

export default App;
