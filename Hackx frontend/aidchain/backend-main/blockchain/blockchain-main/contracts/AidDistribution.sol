// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AidDistribution {
    // --- Roles ---
    address public owner;
    mapping(address => bool) public isAdmin;     // platform admins/government
    mapping(address => bool) public isNGO;       // authorized NGOs
    mapping(address => bool) public isRecipient; // known recipients

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    modifier onlyAdminOrOwner() {
        require(msg.sender == owner || isAdmin[msg.sender], "Only admin/owner");
        _;
    }
    modifier onlyNGOOrAdmin() {
        require(isNGO[msg.sender] || isAdmin[msg.sender] || msg.sender == owner, "Only NGO/admin");
        _;
    }
    modifier onlyRecipient() {
        require(isRecipient[msg.sender], "Only recipient");
        _;
    }
    struct Donor {
        address donorAddress;
        uint totalContributed;
    }
    struct Donation {
        address donor;
        uint amount;
        uint timestamp;
        bool allocated;
        uint milestoneId;
        string cause;         // e.g., Food, Shelter, Medical
        bytes32 paymentHash;  // off-chain/reference hash (tx/payment id)
    }
    enum MilestoneStatus { Pending, Verified, Completed }
    struct Milestone {
        string description;
        MilestoneStatus status;
        uint completedAt;
        uint allocatedAmount;
    }
    struct DistributionRecord {
        uint donationId;
        uint milestoneId;
        string logisticsDetails;
        uint timestamp;
        bool aidReleased;
    }
    struct DeliveryConfirmation {
        address recipient;
        uint milestoneId;
        bool deliveryConfirmed;
        uint confirmationAt;
        string deliveryProofURI;
    }

    mapping(address => Donor) public donors;
    Donation[] public donations;
    Milestone[] public milestones;
    DistributionRecord[] public distributions;
    DeliveryConfirmation[] public deliveryConfirmations;

    event DonationLogged(address indexed donor, uint amount, uint donationId);
    event DonationLoggedMeta(uint indexed donationId, string cause, bytes32 paymentHash);
    event AidAllocated(uint milestoneId, uint totalAmount);
    event DistributionLogged(uint donationId, uint milestoneId, string logisticsDetails);
    event MilestoneVerified(uint milestoneId, uint timestamp);
    event MilestoneCompleted(uint milestoneId, uint timestamp);
    event DeliveryConfirmed(address indexed recipient, uint milestoneId, string proofURI);

    function addDonation(uint milestoneId) public payable {
        require(msg.value > 0, "Must send funds");
        donations.push(Donation(msg.sender, msg.value, block.timestamp, false, milestoneId, "", bytes32(0)));
        donors[msg.sender].donorAddress = msg.sender;
        donors[msg.sender].totalContributed += msg.value;
        emit DonationLogged(msg.sender, msg.value, donations.length - 1);
    }

    // Backwards-compatible method with metadata
    function addDonationWithMeta(uint milestoneId, string calldata cause, bytes32 paymentHash) public payable {
        require(msg.value > 0, "Must send funds");
        donations.push(Donation(msg.sender, msg.value, block.timestamp, false, milestoneId, cause, paymentHash));
        donors[msg.sender].donorAddress = msg.sender;
        donors[msg.sender].totalContributed += msg.value;
        uint id = donations.length - 1;
        emit DonationLogged(msg.sender, msg.value, id);
        emit DonationLoggedMeta(id, cause, paymentHash);
    }

    // Allocate pooled aid to milestone (admin/NGO trigger)
    function allocateAid(uint milestoneId) public onlyNGOOrAdmin {
        uint total = 0;
        for (uint i = 0; i < donations.length; i++) {
            if (!donations[i].allocated && donations[i].milestoneId == milestoneId) {
                donations[i].allocated = true;
                total += donations[i].amount;
            }
        }
        if (milestoneId < milestones.length) {
            milestones[milestoneId].allocatedAmount += total;
        }
        emit AidAllocated(milestoneId, total);
    }

    // Log delivery logistics (admin/NGO)
    function logDistribution(uint donationId, uint milestoneId, string calldata logisticsDetails) public onlyNGOOrAdmin {
        distributions.push(DistributionRecord(donationId, milestoneId, logisticsDetails, block.timestamp, false));
        emit DistributionLogged(donationId, milestoneId, logisticsDetails);
    }

    // Mark milestone as completed/released (admin/gov/IoT)
    function verifyMilestone(uint milestoneId) public onlyAdminOrOwner {
        require(milestoneId < milestones.length, "Invalid milestone ID");
        require(milestones[milestoneId].status == MilestoneStatus.Pending, "Not pending");
        milestones[milestoneId].status = MilestoneStatus.Verified;
        emit MilestoneVerified(milestoneId, block.timestamp);
    }

    // Finalize milestone after aid delivered and confirmations gathered
    function completeMilestone(uint milestoneId) public onlyAdminOrOwner {
        require(milestoneId < milestones.length, "Invalid milestone ID");
        require(milestones[milestoneId].status == MilestoneStatus.Verified, "Not verified");
        milestones[milestoneId].status = MilestoneStatus.Completed;
        milestones[milestoneId].completedAt = block.timestamp;
        emit MilestoneCompleted(milestoneId, block.timestamp);
    }

    // Recipient confirms delivery, providing proof
    function confirmDelivery(uint milestoneId, string calldata proofURI) public onlyRecipient {
        deliveryConfirmations.push(
            DeliveryConfirmation(msg.sender, milestoneId, true, block.timestamp, proofURI)
        );
        emit DeliveryConfirmed(msg.sender, milestoneId, proofURI);
    }

    // Add a new milestone (admin)
    function addMilestone(string memory description) public onlyAdminOrOwner {
        milestones.push(Milestone(description, MilestoneStatus.Pending, 0, 0));
    }

    // --- Role management (owner only) ---
    constructor() {
        owner = msg.sender;
    }
    function setAdmin(address account, bool allowed) external onlyOwner {
        isAdmin[account] = allowed;
    }
    function setNGO(address account, bool allowed) external onlyOwner {
        isNGO[account] = allowed;
    }
    function setRecipient(address account, bool allowed) external onlyOwner {
        isRecipient[account] = allowed;
    }

    function getDeliveryConfirmation(uint idx) public view returns (address, uint, bool, uint, string memory) {
        DeliveryConfirmation memory d = deliveryConfirmations[idx];
        return (d.recipient, d.milestoneId, d.deliveryConfirmed, d.confirmationAt, d.deliveryProofURI);
    }
}
