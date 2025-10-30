const express = require('express');
const router = express.Router();

// Demo in-memory store for donations (used when backend runs in DEMO mode)
const donations = [
  // sample donation for demo
  {
    _id: '1',
    txHash: '0xDEMO_TX_1',
    donorAddr: '0xDonorDemo',
    purpose: 'Emergency food and shelter',
    amount: '0.01',
    assignedTo: null,
    createdAt: new Date().toISOString(),
  },
];

// POST /api/donation
// Body: { txHash, donorAddr, purpose, amount }
router.post('/', (req, res) => {
  try {
    const { txHash, donorAddr, purpose, amount } = req.body;
    if (!txHash || !donorAddr || !purpose || !amount) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    const existing = donations.find((d) => d.txHash === txHash);
    if (existing) return res.status(200).json({ success: true, id: existing._id, message: 'Already recorded' });
    const doc = {
      _id: String(donations.length + 1),
      txHash,
      donorAddr,
      purpose,
      amount,
      assignedTo: null,
      createdAt: new Date().toISOString(),
    };
    donations.unshift(doc);
    return res.json({ success: true, id: doc._id });
  } catch (err) {
    console.error('Error saving donation', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/donation - list recent donations
router.get('/', (req, res) => {
  try {
    const assignedTo = req.query.assignedTo;
    const docs = assignedTo ? donations.filter((d) => d.assignedTo === assignedTo) : donations;
    return res.json({ success: true, donations: docs });
  } catch (err) {
    console.error('Error listing donations', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/donation/:txHash - get donation by txHash
router.get('/:txHash', (req, res) => {
  try {
    const txHash = req.params.txHash;
    const doc = donations.find((d) => d.txHash === txHash);
    if (!doc) return res.status(404).json({ success: false, error: 'Not found' });
    return res.json({ success: true, donation: doc });
  } catch (err) {
    console.error('Error fetching donation', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/donation/assign
// Body: { txHash, assignedTo }
router.post('/assign', (req, res) => {
  try {
    const { txHash, assignedTo } = req.body;
    if (!txHash || !assignedTo) return res.status(400).json({ success: false, error: 'Missing txHash or assignedTo' });
    const idx = donations.findIndex((d) => d.txHash === txHash);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Donation not found' });
    donations[idx].assignedTo = assignedTo;
    return res.json({ success: true, donation: donations[idx] });
  } catch (err) {
    console.error('Error assigning donation', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
