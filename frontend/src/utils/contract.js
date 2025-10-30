import { ethers } from "ethers";
import AidDistributionABI from "../../contracts/AidDistributionABI.json";
import deployed from "../../contracts/deployedAddress.json";

export const CONTRACT_ADDRESS = deployed.address;
export const ABI = AidDistributionABI;

export function getAidDistributionContract(signerOrProvider) {
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signerOrProvider);
}
