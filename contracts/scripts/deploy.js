const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const AidDistribution = await hre.ethers.getContractFactory("AidDistribution");
  const contract = await AidDistribution.deploy();
  await contract.deployed();
  console.log("Contract deployed to:", contract.address);

  // Write address to file for frontend/backend
  fs.writeFileSync("../deployedAddress.json", JSON.stringify({ address: contract.address }, null, 2));

  // Write ABI to file for frontend/backend
  fs.writeFileSync("../AidDistributionABI.json", JSON.stringify(AidDistribution.interface.format("json"), null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
