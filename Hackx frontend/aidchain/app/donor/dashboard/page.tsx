"use client";
import React, { useState } from "react";
import { FaStar, FaMapMarkerAlt, FaCheckCircle, FaWallet, FaUsers, FaUserTie, FaGlobeAsia } from "react-icons/fa";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);
// Make sure to install react-icons: npm install react-icons
import { FaExclamationTriangle, FaUser, FaCertificate, FaArrowRight, FaTruck, FaCampground, FaBox } from "react-icons/fa";

type Milestone = {
  name: string;
  desc: string;
  amount: number;
  status: string;
  proof: string;
  verification: string;
};

type NGO = {
  id: string;
  name: string;
  logo: string;
  location: string;
  cause: string;
  goal: number;
  raised: number;
  verified: boolean;
  risk: string;
  transparency: number;
  contract: string;
  aiTrust: number;
  milestones: Milestone[];
  impact: string[];
  alerts: string[];
  peopleHelped: number;
};

// Mock NGO data
const ngos: NGO[] = [
  {
    id: "ngo1",
    name: "Tsunami Relief Trust",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/UNICEF_Logo.png/320px-UNICEF_Logo.png",
    location: "Chennai, India",
    cause: "Tsunami Relief",
    goal: 200000,
    raised: 120000,
    verified: true,
    risk: "Low",
    transparency: 98,
    contract: "0xA1B2...C3D4",
    aiTrust: 92,
    milestones: [
      { name: "Transport", desc: "Relief trucks to coastal villages", amount: 25000, status: "✅", proof: "GPS + Invoice", verification: "View Proof" },
      { name: "Food", desc: "Emergency food supplies", amount: 30000, status: "✅", proof: "Drone Photo", verification: "View Proof" },
      { name: "Water", desc: "Clean water distribution", amount: 20000, status: "✅", proof: "IoT Sensor", verification: "View Proof" },
      { name: "Medical", desc: "First aid and medicines", amount: 25000, status: "⏳", proof: "Invoice", verification: "Pending" },
      { name: "Shelter", desc: "Temporary camps", amount: 30000, status: "❌", proof: "Photo", verification: "-" },
      { name: "Sanitation", desc: "Portable toilets", amount: 20000, status: "❌", proof: "Vendor Bill", verification: "-" },
      { name: "Education", desc: "School kits for children", amount: 25000, status: "❌", proof: "NGO Report", verification: "-" },
      { name: "Livelihood", desc: "Job support", amount: 25000, status: "❌", proof: "Beneficiary List", verification: "-" },
    ],
    impact: ["Donor", "NGO", "Transport", "Food", "Water", "Medical", "Shelter", "Sanitation", "Education", "Livelihood", "Beneficiaries"],
    alerts: ["2 delayed verifications detected."],
    peopleHelped: 1200,
  },
  {
    id: "ngo2",
    name: "Green Hope Foundation",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Logo_of_Red_Cross.svg/320px-Logo_of_Red_Cross.svg.png",
    location: "Kerala, India",
    cause: "Flood Relief",
    goal: 150000,
    raised: 90000,
    verified: true,
    risk: "Medium",
    transparency: 90,
    contract: "0xE5F6...G7H8",
    aiTrust: 78,
    milestones: [
      { name: "Shelter", desc: "Temporary camps", amount: 20000, status: "✅", proof: "Photo", verification: "View Proof" },
      { name: "Medical", desc: "First aid kits", amount: 15000, status: "✅", proof: "Invoice", verification: "View Proof" },
      { name: "Food", desc: "Dry rations", amount: 15000, status: "✅", proof: "Drone Photo", verification: "View Proof" },
      { name: "Water", desc: "Water purification units", amount: 10000, status: "⏳", proof: "IoT Sensor", verification: "Pending" },
      { name: "Sanitation", desc: "Portable toilets", amount: 10000, status: "❌", proof: "Vendor Bill", verification: "-" },
      { name: "Rescue", desc: "Boats and volunteers", amount: 10000, status: "❌", proof: "GPS", verification: "-" },
      { name: "Education", desc: "School kits", amount: 10000, status: "❌", proof: "NGO Report", verification: "-" },
    ],
    impact: ["Donor", "NGO", "Shelter", "Medical", "Food", "Water", "Sanitation", "Rescue", "Education", "Beneficiaries"],
    alerts: [],
    peopleHelped: 800,
  },
  {
    id: "ngo3",
    name: "Earthquake Aid Network",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Doctors_Without_Borders_logo.svg/320px-Doctors_Without_Borders_logo.svg.png",
    location: "Nepal",
    cause: "Earthquake Relief",
    goal: 250000,
    raised: 180000,
    verified: true,
    risk: "Low",
    transparency: 95,
    contract: "0xB3C4...D5E6",
    aiTrust: 88,
    milestones: [
      { name: "Rescue", desc: "Search and rescue ops", amount: 30000, status: "✅", proof: "Drone Footage", verification: "View Proof" },
      { name: "Medical", desc: "Emergency medical camps", amount: 40000, status: "✅", proof: "Invoice", verification: "View Proof" },
      { name: "Food", desc: "Food packets", amount: 25000, status: "✅", proof: "Photo", verification: "View Proof" },
      { name: "Water", desc: "Water tanks", amount: 20000, status: "⏳", proof: "IoT Sensor", verification: "Pending" },
      { name: "Shelter", desc: "Tents and tarpaulins", amount: 25000, status: "❌", proof: "Vendor Bill", verification: "-" },
      { name: "Sanitation", desc: "Portable toilets", amount: 15000, status: "❌", proof: "Vendor Bill", verification: "-" },
      { name: "Education", desc: "School kits", amount: 15000, status: "❌", proof: "NGO Report", verification: "-" },
      { name: "Livelihood", desc: "Job support", amount: 10000, status: "❌", proof: "Beneficiary List", verification: "-" },
    ],
    impact: ["Donor", "NGO", "Rescue", "Medical", "Food", "Water", "Shelter", "Sanitation", "Education", "Livelihood", "Beneficiaries"],
    alerts: ["1 IoT checkpoint offline."],
    peopleHelped: 1500,
  },
  {
    id: "ngo4",
    name: "Fire Relief Society",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Save_the_Children_logo.svg/320px-Save_the_Children_logo.svg.png",
    location: "Mumbai, India",
    cause: "Fire Disaster Relief",
    goal: 120000,
    raised: 70000,
    verified: false,
    risk: "High",
    transparency: 80,
    contract: "0xF7G8...H9I0",
    aiTrust: 65,
    milestones: [
      { name: "Rescue", desc: "Fire brigade ops", amount: 20000, status: "✅", proof: "Drone Footage", verification: "View Proof" },
      { name: "Medical", desc: "Burn treatment", amount: 15000, status: "✅", proof: "Invoice", verification: "View Proof" },
      { name: "Food", desc: "Food packets", amount: 10000, status: "⏳", proof: "Photo", verification: "Pending" },
      { name: "Water", desc: "Water bottles", amount: 10000, status: "❌", proof: "IoT Sensor", verification: "-" },
      { name: "Shelter", desc: "Temporary housing", amount: 15000, status: "❌", proof: "Vendor Bill", verification: "-" },
      { name: "Sanitation", desc: "Portable toilets", amount: 10000, status: "❌", proof: "Vendor Bill", verification: "-" },
      { name: "Education", desc: "School kits", amount: 10000, status: "❌", proof: "NGO Report", verification: "-" },
    ],
    impact: ["Donor", "NGO", "Rescue", "Medical", "Food", "Water", "Shelter", "Sanitation", "Education", "Beneficiaries"],
    alerts: ["Drone feed interrupted."],
    peopleHelped: 600,
  },
  {
    id: "ngo5",
    name: "Cyclone Care Collective",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Oxfam_logo.svg/320px-Oxfam_logo.svg.png",
    location: "Odisha, India",
    cause: "Cyclone Relief",
    goal: 180000,
    raised: 95000,
    verified: true,
    risk: "Medium",
    transparency: 85,
    contract: "0xJ1K2...L3M4",
    aiTrust: 80,
    milestones: [
      { name: "Transport", desc: "Relief trucks", amount: 25000, status: "✅", proof: "GPS + Invoice", verification: "View Proof" },
      { name: "Food", desc: "Emergency food supplies", amount: 25000, status: "✅", proof: "Drone Photo", verification: "View Proof" },
      { name: "Water", desc: "Clean water distribution", amount: 20000, status: "⏳", proof: "IoT Sensor", verification: "Pending" },
      { name: "Medical", desc: "First aid and medicines", amount: 20000, status: "❌", proof: "Invoice", verification: "-" },
      { name: "Shelter", desc: "Temporary camps", amount: 20000, status: "❌", proof: "Photo", verification: "-" },
      { name: "Sanitation", desc: "Portable toilets", amount: 20000, status: "❌", proof: "Vendor Bill", verification: "-" },
      { name: "Education", desc: "School kits for children", amount: 20000, status: "❌", proof: "NGO Report", verification: "-" },
      { name: "Livelihood", desc: "Job support", amount: 20000, status: "❌", proof: "Beneficiary List", verification: "-" },
    ],
    impact: ["Donor", "NGO", "Transport", "Food", "Water", "Medical", "Shelter", "Sanitation", "Education", "Livelihood", "Beneficiaries"],
    alerts: ["IoT checkpoint offline."],
    peopleHelped: 1000,
  },
  {
    id: "ngo6",
    name: "Drought Relief Mission",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/CARE_International_logo.svg/320px-CARE_International_logo.svg.png",
    location: "Rajasthan, India",
    cause: "Drought Relief",
    goal: 160000,
    raised: 80000,
    verified: false,
    risk: "High",
    transparency: 75,
    contract: "0xN5O6...P7Q8",
    aiTrust: 70,
    milestones: [
      { name: "Water", desc: "Water tankers", amount: 30000, status: "✅", proof: "GPS + Invoice", verification: "View Proof" },
      { name: "Food", desc: "Dry rations", amount: 20000, status: "✅", proof: "Drone Photo", verification: "View Proof" },
      { name: "Medical", desc: "First aid kits", amount: 15000, status: "⏳", proof: "Invoice", verification: "Pending" },
      { name: "Shelter", desc: "Temporary camps", amount: 15000, status: "❌", proof: "Photo", verification: "-" },
      { name: "Sanitation", desc: "Portable toilets", amount: 15000, status: "❌", proof: "Vendor Bill", verification: "-" },
      { name: "Education", desc: "School kits", amount: 15000, status: "❌", proof: "NGO Report", verification: "-" },
      { name: "Livelihood", desc: "Job support", amount: 15000, status: "❌", proof: "Beneficiary List", verification: "-" },
      { name: "Irrigation", desc: "Drip irrigation setup", amount: 15000, status: "❌", proof: "Vendor Bill", verification: "-" },
    ],
    impact: ["Donor", "NGO", "Water", "Food", "Medical", "Shelter", "Sanitation", "Education", "Livelihood", "Irrigation", "Beneficiaries"],
    alerts: ["Water supply delayed."],
    peopleHelped: 700,
  },
];

const donorProfile = {
  name: "Krish",
  address: "0x1234...abcd",
  totalDonated: 2.5,
  ngosSupported: 3,
  txIds: ["0xA1B2...C3D4", "0xE5F6...G7H8"],
  certificate: "https://dummyimage.com/600x400/4caf50/fff&text=Certificate+of+Impact",
};

export default function DonorDashboard() {
  const [selectedNGo, setSelectedNGo] = useState<NGO | null>(null);
  const [showDonateModal, setShowDonateModal] = useState(false);

  // Donor Home Page UI
  const stats = [
    { label: 'Total Donations Raised', value: '₹2.3 Crores', icon: '💰' },
    { label: 'Families Impacted', value: '4,200', icon: '👨‍👩‍👧‍👦' },
    { label: 'Active NGOs', value: '12', icon: '🏢' },
    { label: 'Resources Delivered', value: '8,500', icon: '📦' },
    { label: 'Verified Locations', value: '23+', icon: '📍' },
  ];
  const featuredNGOs = [
    { name: 'HopeAid', cause: 'Flood Relief', required: '₹10L', raised: '₹7L', verified: true, urgent: true },
    { name: 'ReliefNow', cause: 'Earthquake', required: '₹15L', raised: '₹12L', verified: true, urgent: false },
    { name: 'Food4All', cause: 'Food Kits', required: '₹5L', raised: '₹3.5L', verified: false, urgent: true },
    { name: 'ShelterSafe', cause: 'Shelter', required: '₹8L', raised: '₹6L', verified: true, urgent: false },
  ];
  const logs = [
    { msg: '₹50,000 released to HopeAid for transport', verified: true, icon: '✅' },
    { msg: '100 food kits delivered in Chennai flood zone', verified: false, icon: '🚚' },
    { msg: 'ShelterSafe provided tents in Assam', verified: true, icon: '✅' },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-72 flex items-center justify-center bg-gradient-to-r from-teal-100 to-green-100 mb-8">
        <img src="/blockchain/public/file.svg" alt="Disaster Relief" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute top-4 left-4">
          <button className="bg-white border border-gray-300 px-4 py-2 rounded shadow text-black font-semibold hover:bg-gray-100" onClick={() => window.history.back()}>
            ← Back
          </button>
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">Empower Relief. Track Impact. Build Trust.</h1>
          <p className="text-lg text-black mb-6">Transparent disaster aid powered by blockchain. Your donations make a real difference.</p>
          <div className="flex justify-center gap-4 mb-4">
            <a href="/donate" className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold shadow hover:bg-green-700 transition">Donate Now</a>
            <a href="/donor/dashboard" className="bg-white border border-green-600 text-green-600 px-6 py-3 rounded-xl font-bold shadow hover:bg-green-50 transition">My Dashboard</a>
          </div>
          <div className="flex justify-center gap-2 mt-2">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Verified Platform</span>
            <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-semibold">Trusted by 12 NGOs</span>
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">Live Transparency</span>
          </div>
        </div>
      </section>

      {/* Quick Stats / Impact Highlights */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-10 px-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow flex flex-col items-center py-6 px-2">
            <span className="text-3xl mb-2">{stat.icon}</span>
            <span className="text-2xl font-bold text-teal-700">{stat.value}</span>
            <span className="text-xs text-black mt-1">{stat.label}</span>
          </div>
        ))}
      </section>

      {/* Interactive Charts & Graphs */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 px-4">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <h3 className="font-bold text-black mb-2">Donation Breakdown</h3>
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-green-400 to-green-200 flex items-center justify-center text-black font-bold">Pie</div>
          <div className="flex gap-2 mt-2 text-xs text-black">
            <span>Food</span>
            <span>Shelter</span>
            <span>Medical</span>
            <span>Logistics</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <h3 className="font-bold text-black mb-2">Donations Over Time</h3>
          <div className="w-full h-32 bg-gray-100 rounded flex items-end gap-2">
            <div className="bg-green-600 w-8" style={{height:'60%'}}></div>
            <div className="bg-green-400 w-8" style={{height:'80%'}}></div>
            <div className="bg-green-300 w-8" style={{height:'40%'}}></div>
            <div className="bg-green-200 w-8" style={{height:'90%'}}></div>
          </div>
          <div className="flex justify-between text-xs text-black mt-2 w-full">
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <h3 className="font-bold text-black mb-2">Aid Map</h3>
          <div className="w-full h-32 bg-green-100 rounded flex items-center justify-center text-black font-bold">Map</div>
          <div className="flex gap-2 mt-2 text-xs text-black">
            <span>23+ Verified Zones</span>
          </div>
        </div>
      </section>

      {/* Featured NGOs Section */}
      <section className="mb-10 px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-teal-700">Featured NGOs</h2>
          <button className="bg-white border border-gray-300 px-4 py-2 rounded shadow text-black font-semibold hover:bg-gray-100" onClick={() => window.history.back()}>
            ← Back
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredNGOs.map((ngo, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-black text-lg">{ngo.name}</span>
                {ngo.verified && <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">Verified</span>}
                {ngo.urgent && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">Urgent Need</span>}
              </div>
              <span className="text-black text-sm">{ngo.cause}</span>
              <div className="flex gap-2 text-xs text-black">
                <span>Required: {ngo.required}</span>
                <span>Raised: {ngo.raised}</span>
              </div>
              <div className="w-full bg-gray-100 rounded h-2 mt-2">
                <div className="bg-green-600 h-2 rounded" style={{width: `${parseInt(ngo.raised.replace(/[^\d]/g,'')||'0')/parseInt(ngo.required.replace(/[^\d]/g,'')||'1')*100}%`}}></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Transparency Logs */}
      <section className="mb-10 px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-teal-700">Recent Transparency Logs</h2>
          <button className="bg-white border border-gray-300 px-4 py-2 rounded shadow text-black font-semibold hover:bg-gray-100" onClick={() => window.history.back()}>
            ← Back
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {logs.map((log, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-4 flex items-center gap-2">
              <span className="text-2xl">{log.icon}</span>
              <span className="text-black text-sm">{log.msg}</span>
              {log.verified && <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">Verified</span>}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
