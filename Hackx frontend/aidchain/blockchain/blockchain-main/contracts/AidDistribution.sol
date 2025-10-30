// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AidDistribution {
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
    }
    struct Milestone {
        string description;
        bool completed;
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
    event AidAllocated(uint milestoneId, uint totalAmount);
    event DistributionLogged(uint donationId, uint milestoneId, string logisticsDetails);
    event MilestoneVerified(uint milestoneId, uint timestamp);
    event DeliveryConfirmed(address indexed recipient, uint milestoneId, string proofURI);

    function addDonation(uint milestoneId) public payable {
        require(msg.value > 0, "Must send funds");
        donations.push(Donation(msg.sender, msg.value, block.timestamp, false, milestoneId));
        donors[msg.sender].donorAddress = msg.sender;
        donors[msg.sender].totalContributed += msg.value;
        emit DonationLogged(msg.sender, msg.value, donations.length - 1);
    }

    // Allocate pooled aid to milestone (admin/NGO trigger)
    function allocateAid(uint milestoneId) public {
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
    function logDistribution(uint donationId, uint milestoneId, string calldata logisticsDetails) public {
        distributions.push(DistributionRecord(donationId, milestoneId, logisticsDetails, block.timestamp, false));
        emit DistributionLogged(donationId, milestoneId, logisticsDetails);
    }

    // Mark milestone as completed/released (admin/gov/IoT)
    function verifyMilestone(uint milestoneId) public {
        require(milestoneId < milestones.length, "Invalid milestone ID");
        milestones[milestoneId].completed = true;
        milestones[milestoneId].completedAt = block.timestamp;
        emit MilestoneVerified(milestoneId, block.timestamp);
    }

    // Recipient confirms delivery, providing proof
    function confirmDelivery(uint milestoneId, string calldata proofURI) public {
        deliveryConfirmations.push(
            DeliveryConfirmation(msg.sender, milestoneId, true, block.timestamp, proofURI)
        );
        emit DeliveryConfirmed(msg.sender, milestoneId, proofURI);
    }

    // Add a new milestone (admin)
    function addMilestone(string memory description) public {
        milestones.push(Milestone(description, false, 0, 0));
    }

    function getDeliveryConfirmation(uint idx) public view returns (address, uint, bool, uint, string memory) {
        DeliveryConfirmation memory d = deliveryConfirmations[idx];
        return (d.recipient, d.milestoneId, d.deliveryConfirmed, d.confirmationAt, d.deliveryProofURI);
    }
}
