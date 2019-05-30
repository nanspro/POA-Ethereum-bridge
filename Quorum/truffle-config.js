const HDWalletProvider = require('truffle-hdwallet-provider');
// const web3 = new Web3(new Web3.providers.HttpProvider("http://13.126.7.165:23000/"));
const key = "8E4E96A917DF1E82E84B26D7F0CB3BC36DAF03FAC60D81591EED0382F905E2E4";
// 0x41a06892815a450c8bB7297C65290a0864871677

module.exports = {
 networks: {
    main: {
        provider: new HDWalletProvider(key, "http://13.232.66.43:22000"),
        network_id: "*",
        gas: 4500000,
        gasPrice: 0,
        type:"quorum"
    },
    side: {
        // host: "127.0.0.1",
        // port: 8540,
        provider: new HDWalletProvider(key, "http://127.0.0.1:8540"),
        network_id: "*",
        // from: "0x41a06892815a450c8bB7297C65290a0864871677",
        gas: 4517590,
        gasPrice: 25e9
    }
   },
   compilers: {
    solc: {
      version: "0.5.2"
    }
   }
};