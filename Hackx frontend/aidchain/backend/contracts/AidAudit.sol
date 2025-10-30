// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AidAudit {
    struct Donation {
        uint256 id;
        address donor;
        string purpose;
        uint256 amount;
        uint256 timestamp;
    }

    struct Beneficiary {
        address wallet;
        string name;
        bool verified;
    }

    mapping(uint256 => Donation) public donations;
    mapping(address => Beneficiary) public beneficiaries;

    uint256 public donationCount;
    address public owner;

    event DonationMade(uint256 indexed id, address indexed donor, string purpose, uint256 amount, uint256 timestamp);
    event BeneficiaryRegistered(address indexed wallet, string name);
    event FundsTransferred(address indexed to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Register a verified NGO or beneficiary
    function registerBeneficiary(address _wallet, string memory _name) public onlyOwner {
        beneficiaries[_wallet] = Beneficiary(_wallet, _name, true);
        emit BeneficiaryRegistered(_wallet, _name);
    }

    // Donors can send ETH and specify the purpose
    function makeDonation(string memory _purpose) public payable {
        require(msg.value > 0, "Donation must be greater than 0");

        donationCount++;
        donations[donationCount] = Donation(
            donationCount,
            msg.sender,
            _purpose,
            msg.value,
            block.timestamp
        );

        emit DonationMade(donationCount, msg.sender, _purpose, msg.value, block.timestamp);
    }

    // Owner can transfer collected funds to verified beneficiaries
    function transferFunds(address payable _to, uint256 _amount) public onlyOwner {
        require(beneficiaries[_to].verified, "Beneficiary not verified");
        require(address(this).balance >= _amount, "Insufficient contract balance");

        _to.transfer(_amount);
        emit FundsTransferred(_to, _amount);
    }

    // Get the total balance in the contract
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
