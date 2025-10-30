// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AidDistribution {
    struct Aid {
        address donor;
        address ngo;
        address beneficiary;
        uint256 amount;
        string purpose;
        bool delivered;
    }

    Aid[] public aids;
    address public owner;

    event Donated(uint indexed id, address indexed donor, address indexed ngo, uint256 amount, string purpose);
    event Delivered(uint indexed id, address beneficiary);

    constructor() { owner = msg.sender; }

    function donate(address ngo, string calldata purpose) external payable {
        require(msg.value > 0, "No donation sent");
        aids.push(Aid({
            donor: msg.sender,
            ngo: ngo,
            beneficiary: address(0),
            amount: msg.value,
            purpose: purpose,
            delivered: false
        }));
        emit Donated(aids.length - 1, msg.sender, ngo, msg.value, purpose);
    }

    function confirmDelivery(uint id, address beneficiary) external {
        require(id < aids.length, "Invalid Aid ID");
        Aid storage d = aids[id];
        require(!d.delivered, "Already delivered");
        require(msg.sender == d.ngo, "Only assigned NGO");
        d.delivered = true;
        d.beneficiary = beneficiary;
        payable(d.ngo).transfer(d.amount);
        emit Delivered(id, beneficiary);
    }

    function getAllAids() external view returns (Aid[] memory) {
        return aids;
    }
}
