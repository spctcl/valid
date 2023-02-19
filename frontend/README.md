# 🥩 Awesome SSV Staking Frontend 🥩

🚀 By staking their ETH to a staking contract, users receive a liquid staked derivative token called ssvETH. This allows them to earn compound interest on their staked ETH, while also being able to use the ssvETH tokens in other DeFi protocols without having to unstake their original ETH.

# Demo 

You can find our live demo [Here](https://awesome-ssv-staking.surge.sh)

# Quick Start 🎈

Prerequisites: [Node (v18 LTS)](https://nodejs.org/en/download/) plus [Yarn (v1.x)](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)


> 1️⃣ clone/fork  awesome SSV Staking repo:

```bash
git clone https://github.com/bloxapp/awesome-ssv
```
> 2️⃣ make sure you're connected to the Goerli network (5)

> 3️⃣ install and start the frontend:

```bash
cd frontend
yarn install
yarn react-app:start
```

🚨 if you want to deploy the contracts locally, you will need to update the default network in `App.jsx` to match your default network in `hardhat-config.js`.

```bash
yarn deploy
```

🚨 same thing if you want to deploy on the Goerli testnet, just use this instead `.

```bash
yarn deploy-goerli
```
📜 then update your Goerli contracts addresses and ABIs ` in `packages/react-app/src/contracts/external_contracts`

> 4️⃣ in a third terminal window, 🛰 deploy your contract:

🚨 if you are not deploying to localhost, you will need to run `yarn generate` (using node v16.x) first and then fund the deployer account. To view account balances, run `yarn account`. You will aslo need to update `hardhat-config.js` with the correct default network.

```bash
yarn generate
yarn account
```

🔏 Edit the smart contracts in `packages/hardhat/contracts`

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

💼 Add/Edit your deployment scripts in `packages/hardhat/deploy`

📱 Open http://localhost:3000 to see the app

🚨📡 To deploy to a public domain, use `yarn surge`. You will need to have a surge account and have the surge CLI installed. There is also the option to deploy to IPFS using `yarn ipfs` and `yarn s3` to deploy to an AWS bucket 🪣 There are scripts in the `packages/react-app/src/scripts` folder to help with this.`


🌍 You need an RPC key for testnets and production deployments, create an [Alchemy](https://www.alchemy.com/) account and replace the value of `ALCHEMY_KEY = xxx` in `packages/react-app/src/constants.js` with your new key.

📣 Make sure you update the `InfuraID` before you go to production. Huge thanks to [Infura](https://infura.io/) for our special account that fields 7m req/day!


---

🙏 Built on top of the amazing [scaffold-eth](https://github.com/scaffold-eth/scaffold-eth) !


