import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export function getContract() {
  try {
    const abiFile = JSON.parse(fs.readFileSync(
      path.join(process.cwd(), "blockchain", "AidContractABI.json"), "utf8"
    ));
    const ABI = abiFile.abi || abiFile;
    const contractAddress = JSON.parse(fs.readFileSync(
      path.join(process.cwd(), "blockchain", "address.json"), "utf8"
    )).address;
    // Only attempt RPC connection if an explicit RPC_URL is provided.
    // Defaulting to localhost caused ECONNREFUSED when no local node was running.
    const rpcUrl = process.env.RPC_URL;
    if (!rpcUrl) {
      return null;
    }
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    return new ethers.Contract(contractAddress, ABI, provider);
  } catch (err) {
    return null;
  }
}
