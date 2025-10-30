async function main() {
  const AidDistribution = await ethers.getContractFactory("AidDistribution");
  const contract = await AidDistribution.deploy();
  await contract.deployed();
  console.log("AidDistribution deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
