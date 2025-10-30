require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    goerli: {
      url: process.env.GOERLI_RPC_URL || "https://goerli.infura.io/v3/<your-infura-key>",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : []
    },
    mumbai: {
      url: process.env.MUMBAI_RPC_URL || "https://rpc-mumbai.maticvigil.com",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : []
    }
  },
  paths: {
    contracts: "./contracts"
  }
};
// --> IMPORTANT: set up .env file in blockchain-main with your keys:
// GOERLI_RPC_URL=https://goerli.infura.io/v3/<your-infura-key>
// MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com (or use another Mumbai endpoint)
// PRIVATE_KEY=0x<your-testnet-private-key>
