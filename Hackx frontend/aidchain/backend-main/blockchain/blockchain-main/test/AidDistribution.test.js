const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AidDistribution", function () {
  let contract;
  let owner, donor, recipient;

  beforeEach(async function () {
    [owner, donor, recipient] = await ethers.getSigners();
    const AidDistribution = await ethers.getContractFactory("AidDistribution", owner);
    contract = await AidDistribution.deploy();
    await contract.deployed();
    // Add milestone for use in all tests
    await contract.addMilestone("Milestone1");
  });

  it("should log a donation", async function () {
    await expect(contract.connect(donor).addDonation(0, { value: 100 }))
      .to.emit(contract, "DonationLogged");
    const d = await contract.donations(0);
    expect(d.donor).to.eq(donor.address);
    expect(d.amount).to.eq(100);
  });

  it("should allow pooling of donations to milestone", async function () {
    await contract.connect(donor).addDonation(0, { value: 200 });
    await expect(contract.allocateAid(0)).to.emit(contract, "AidAllocated");
    const donation = await contract.donations(0);
    expect(donation.allocated).to.equal(true);
  });

  it("should log delivery and confirm delivery", async function () {
    await contract.connect(donor).addDonation(0, { value: 100 });
    await contract.allocateAid(0);
    await expect(contract.logDistribution(0, 0, "Truck sent from A to B"))
      .to.emit(contract, "DistributionLogged");
    await expect(contract.connect(recipient).confirmDelivery(0, "ipfs://somedeliveryproof"))
      .to.emit(contract, "DeliveryConfirmed");
    const [rcpt, milestoneId, deliveryConfirmed, confirmationAt, proofURI] = await contract.getDeliveryConfirmation(0);
    expect(rcpt).to.eq(recipient.address);
    expect(deliveryConfirmed).to.eq(true);
    expect(proofURI).to.eq("ipfs://somedeliveryproof");
  });

  it("should mark milestone as completed", async function () {
    await contract.verifyMilestone(0);
    const m = await contract.milestones(0);
    expect(m.completed).to.equal(true);
  });
});
