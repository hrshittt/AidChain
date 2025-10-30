const express = require('express');
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());

// Simple AI/rule placeholder service
// POST /ai/check
// body: { batchId, evidenceList: [{ cid, lat, lon, timestamp, hash }] }
app.post('/ai/check', (req, res) => {
  const { batchId, evidenceList } = req.body || {};
  const flags = [];
  let score = 0;

  if (!evidenceList || !Array.isArray(evidenceList)) {
    return res.json({ flags: [{ rule: 'no_evidence', reason: 'No evidence provided' }], score: 0 });
  }

  // Rule 1: GPS out-of-range (example bounding box)
  const bbox = { minLat: -90, maxLat: 90, minLon: -180, maxLon: 180 };
  // For demo purposes, set a tighter box (replace with real target later)
  const demoBox = { minLat: -40, maxLat: 40, minLon: -80, maxLon: 80 };
  evidenceList.forEach((e, idx) => {
    if (e.lat == null || e.lon == null) {
      flags.push({ rule: 'missing_gps', reason: `Evidence ${idx} missing GPS` });
      score += 5;
    } else if (e.lat < demoBox.minLat || e.lat > demoBox.maxLat || e.lon < demoBox.minLon || e.lon > demoBox.maxLon) {
      flags.push({ rule: 'gps_out_of_range', reason: `Evidence ${idx} GPS out of expected range`, lat: e.lat, lon: e.lon });
      score += 10;
    }
  });

  // Rule 2: duplicate photo hashes
  const hashCounts = {};
  evidenceList.forEach((e) => {
    if (e.hash) hashCounts[e.hash] = (hashCounts[e.hash] || 0) + 1;
  });
  Object.entries(hashCounts).forEach(([hash, count]) => {
    if (count > 1) {
      flags.push({ rule: 'duplicate_photo', reason: `Photo hash ${hash} appears ${count} times` });
      score += 15;
    }
  });

  // Basic scoring cap
  if (score > 100) score = 100;

  return res.json({ flags, score });
});

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`AI service running on port ${PORT}`));
