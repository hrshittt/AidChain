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
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || "http://127.0.0.1:8545");
    return new ethers.Contract(contractAddress, ABI, provider);
  } catch (err) {
    return null;
  }
}
