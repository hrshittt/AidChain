Donate UI - Integration & Verification Logic

This document describes the server / smart-contract / UX logic needed to turn the mocked "NGO marketplace" UI into a production, blockchain-powered transparency flow.

1) Data model (backend)
- NGO profile
  - id, name, description, location, category, rating, trustScore
  - contractAddress (smart contract), geoVerified boolean
  - statistics: familiesHelped, volunteers, lastVerifiedAt
  - milestones: ordered array of { id, name, requested (ETH), proofUrl?, status: locked|pending|funded|verified }

- AidTransaction (existing)
  - donorId, ngoId, milestoneId (optional), amount, txHash, status (initiated|onchain|confirmed|reverted)

2) API endpoints (examples)
- GET /api/ngos
  - returns list of NGO profiles (public fields) for the marketplace cards

- GET /api/ngos/:id
  - returns full NGO profile including milestones and proofs (public view)

- POST /api/ngos/:id/milestones/:mid/verify
  - admin or verifier role only
  - accepts proof review result (approve/reject) and proof metadata
  - marks milestone as verified -> triggers unlocking next milestone

- POST /api/donate
  - donor must sign (auth) and can select an NGO and milestone (or general fund)
  - server prepares on-chain transaction or the client calls contract directly (wallet)
  - server records AidTransaction and returns tx details

- GET /api/transactions/public
  - returns recent donations and on-chain merge/status (already implemented)

3) Smart-contract responsibilities
- Per-NGO contract (or a registry managing NGOs + milestones)
- Store milestones with requested amounts and release conditions
- Only allow release of funds for milestone i if milestone i-1 has been verified (off-chain proof verification) OR an on-chain oracle/event confirms it
- Emit events: MilestoneFunded(milestoneId, amount, donor), MilestoneVerified(milestoneId)

4) Verification workflow (recommended)
- Donor funds milestone i via smart contract call -> contract locks the funds but does not release them until verification (or releases directly to escrow address)
- NGOs upload proof (invoice/photo/GPS link) to backend (S3 or IPFS) and attach to milestone record
- A trusted verifier (admin/local officer) reviews proof and calls POST /api/ngos/:id/milestones/:mid/verify
  - Backend records verification and emits event or calls smart contract to mark milestone as verified
- Once milestone is verified on-chain, contract releases funds to NGO wallet (or to sub-accounts)

5) UI logic notes (what we implemented in mock)
- Only one milestone may be in the "funded but not yet verified" state at a time.
  - UI shows Fund button enabled only when milestone.status is 'pending' and no other milestone has status 'funded'.
  - After funding, backend / contract should set milestone.status -> 'funded' (and UI will reflect this by polling the NGO endpoint or listening to events).

- Milestone unlocking
  - When milestone[i] is verified, backend marks milestone[i] status -> 'verified' and updates milestone[i+1] status -> 'pending'
  - UI automatically enables Fund on the next 'pending' milestone

- Proofs
  - Proof files (images, invoices) should be stored in a tamper-evident storage (IPFS or S3 with integrity hashes) and the proof URL + hash stored on the milestone record and optionally in the contract.

6) Security & roles
- Verification endpoints MUST be restricted to verifier roles (admin, auditor) and authenticated
- Donor donation endpoint requires authentication and ideally wallet signature when interacting with smart contracts
- Proof upload should sanitize and validate content and store metadata (uploader id, timestamp)

7) Events & reactivity
- For best UX, the frontend should subscribe to contract events (MilestoneFunded, MilestoneVerified) via web3/ethers and update the card UI in realtime.
- Alternatively, backend can poll and surface status via REST endpoints and websockets.

8) Next implementation steps (suggested)
- Add GET /api/ngos and GET /api/ngos/:id endpoints to backend, backed by a new NGO model
- Update frontend marketplace to fetch real NGO data
- Integrate contract functions (or registry) for per-NGO funding
- Create verifier dashboard for proof review and on-chain verification
- Add IPFS/S3 proof storage and display proofs in the UI modal

If you'd like, I can:
- Implement the GET /api/ngos endpoints and wire the frontend cards to backend data (step-by-step)
- Add a small seed route to create test NGOs and milestones in MongoDB to test the end-to-end flow
- Wire the Fund button to prepare an on-chain transaction and return the transaction payload for wallet signing

Tell me which next step to implement and I will proceed.
