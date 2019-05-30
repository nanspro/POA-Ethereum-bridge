# POA-Ethereum-bridge

**Prerequisites**
- Parity client

First let's build parity-bridge locally.
See [more](https://github.com/paritytech/parity-bridge)
```
git clone git@github.com:paritytech/parity-bridge.git
cd parity-bridge
git checkout jm-dependency-updates
// to fetch contracts in arbitrary
git submodule init
git submodule update
// build
cargo build -p parity-bridge -p parity-bridge-deploy --release
// copy target/release/parity-bridge((bridge script)) and target/release/parity-bridge-deploy(deployment script) into a folder that's in your $PATH
```

## Deploy a POA chain locally
Following this [tutorial](https://wiki.parity.io/Demo-PoA-tutorial) but using only node which is authority itself.

```
parity --config node0.toml
// In another terminal use curl requests to create authority account
curl --data '{"jsonrpc":"2.0","method":"parity_newAccountFromPhrase","params":["node0", "node0"],"id":0}' -H "Content-Type: application/json" -X POST localhost:8540

// user account
curl --data '{"jsonrpc":"2.0","method":"parity_newAccountFromPhrase","params":["user", "user"],"id":0}' -H "Content-Type: application/json" -X POST localhost:8540
```

Now stop the server and change node0.toml and demo.json to include new changes, uncomment everything in node0.toml, add authority address into validators list and user account in accounts to start with some initial balance in demo.json like this:
```
"validators" : {
    "list": [
        "0x00Bd138aBD70e2F00903268F3Db08f2D25677C9e"
    ]
}

"accounts": {
        ...
        "0x004ec07d2329997267Ec62b4166639513386F32E": { "balance": "10000000000000000000000" }
    }
```

Start the chain again and now interact/deploy contracts using different rpc methods like [these](https://wiki.parity.io/JSONRPC-eth-module)

## Connecting to ropsten
We want to have same authority address as an account on ropsten too. To see/change the node rpc/websockets endpoint, change node1.toml.
`parity --config node1.toml`

_Note: We are running node in light mode_

On another terminal create a account similar to how we did for POA chain.

`curl --data '{"jsonrpc":"2.0","method":"parity_newAccountFromPhrase","params":["node0", "node0"],"id":0}' -H "Content-Type: application/json" -X POST localhost:8541`

**Note: Stop the network and uncomment everything in `node1.toml` so that we can run the chain by unlocking our authority address and restart again**

This account already has some balance on ropsten, to check run `curl --data '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0x00Bd138aBD70e2F00903268F3Db08f2D25677C9e", "latest"],"id":1}' -H "Content-Type: application/json" -X POST localhost:8541 `

## Deploying bridge to main and side
Following this [guide](https://github.com/paritytech/parity-bridge/blob/master/deployment_guide.md) let's try to deploy bridge contract to both chains.<br/>
Both chains should be running on two separate terminals with authority address unlocked.

### Using script
Check `bridge_config.toml` and see if the configuration parameters are set correctly or not.<br/>
Run `env RUST_LOG=info parity-bridge-deploy --config bridge_config.toml --database bridge.db` to deploy the contract to both chains.<br/>
Most probably will fail and throw weird errors(probably deploy to main chain successfully but definitely won't to side)

### Manually
Bridge contract is present `parity-bridge/arbitrary/contracts` and it's compiled bytecode is present in `parity-bridge/compiled-contracts/Main.bin` and Side.bin.<br/>
Manually do curl requests like this
```
curl --data '{"method":"eth_sendTransaction","params":[{"from":"0x00Bd138aBD70e2F00903268F3Db08f2D25677C9e", "gas":"0xFA730","data":"0x{Side.bin}"}], "id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST localhost:8540

curl --data '{"method":"eth_sendTransaction","params":[{"from":"0x00Bd138aBD70e2F00903268F3Db08f2D25677C9e", "gas":"0xFA730","data":"0x{Main.bin}"}], "id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST localhost:8541
```
You'll be able to successfully deploy to ropsten and side chain both.
Get the deployed-contract addresses on both chain and change `bridge.db` accordingly
```
main_contract_address = ""
side_contract_address = ""
main_deployed_at_block = 5697832
side_deployed_at_block = 62
```

## Connect both bridges
Run `env RUST_LOG=info ./parity-bridge --config bridge_config.toml --database bridge.db` to connect both bridges together<br/>
_Note: It will not be able to fetch side chain contract bytecode_
