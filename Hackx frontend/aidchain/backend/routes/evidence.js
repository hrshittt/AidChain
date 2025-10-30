const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Demo in-memory store for evidence
const evidenceStore = [
  // sample evidence
  {
    _id: 'e1',
    batchId: '0xDEMO_TX_1',
    cid: 'bafkqdemocid1',
    filename: 'demo.jpg',
    lat: 12.34,
    lon: 56.78,
    timestamp: new Date().toISOString(),
    agentAddr: '0xAgentDemo',
    createdAt: new Date().toISOString(),
  },
];

// Multer disk storage (temporary)
const upload = multer({ dest: path.join(__dirname, '..', 'uploads/') });

// POST /api/evidence/upload (demo)
// Accept multipart/form-data but do NOT call external web3.storage in demo mode.
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { batchId, lat, lon, timestamp, agentAddr } = req.body;
    if (!req.file || !batchId) {
      return res.status(400).json({ success: false, error: 'Missing file or batchId' });
    }

    // Create a mock CID using timestamp + filename (this is a demo placeholder)
    const cid = 'demo-' + Date.now() + '-' + (req.file.originalname || 'file');

    const record = {
      _id: 'e' + (evidenceStore.length + 1),
      batchId,
      cid,
      filename: req.file.originalname,
      lat: lat ? parseFloat(lat) : undefined,
      lon: lon ? parseFloat(lon) : undefined,
      timestamp: timestamp ? new Date(timestamp).toISOString() : new Date().toISOString(),
      agentAddr,
      createdAt: new Date().toISOString(),
    };
    evidenceStore.unshift(record);

    // Cleanup temp file (optional)
    try { fs.unlinkSync(req.file.path); } catch (e) { /* ignore */ }

    return res.json({ success: true, cid: record.cid });
  } catch (err) {
    console.error('Evidence upload error', err);
    return res.status(500).json({ success: false, error: 'Upload failed' });
  }
});

// GET /api/evidence/batch/:batchId - list evidence for a batch
router.get('/batch/:batchId', (req, res) => {
  try {
    const batchId = req.params.batchId;
    const docs = evidenceStore.filter((d) => d.batchId === batchId);
    const gateway = process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs/';
    const out = docs.map((d) => ({
      _id: d._id,
      batchId: d.batchId,
      cid: d.cid,
      ipfs: `${gateway}${d.cid}`,
      filename: d.filename,
      lat: d.lat,
      lon: d.lon,
      timestamp: d.timestamp,
      agentAddr: d.agentAddr,
      createdAt: d.createdAt,
    }));
    return res.json({ success: true, evidence: out });
  } catch (err) {
    console.error('Error listing evidence', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;

// GET /api/evidence/batch/:batchId - list evidence for a batch
router.get('/batch/:batchId', async (req, res) => {
  try {
    const batchId = req.params.batchId;
    const docs = await Evidence.find({ batchId }).sort({ createdAt: -1 }).lean();
    // Add IPFS gateway link for convenience
    const gateway = process.env.IPFS_GATEWAY || 'https://ipfs.io/ipfs/';
    const out = docs.map((d) => ({
      _id: d._id,
      batchId: d.batchId,
      cid: d.cid,
      ipfs: `${gateway}${d.cid}`,
      filename: d.filename,
      lat: d.lat,
      lon: d.lon,
      timestamp: d.timestamp,
      agentAddr: d.agentAddr,
      createdAt: d.createdAt,
    }));
    return res.json({ success: true, evidence: out });
  } catch (err) {
    console.error('Error listing evidence', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});
