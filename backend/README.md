# ggQuest - Backend

Backend allowing quests creation and decentralized gaming profile management.

## Files

`./contracts/`: smart-contracts files
`./src/models/*`: models (offchain database schemas)
`./src/controller/*`: controllers (db operations on models)
`./test/*`: test files (contracts only for now)

`./src/scripts/deploy.js`: deployment script
`./src/config/db.config.js`: database configuration

`./src/addresses.json`: addresses of the deployed smart-contracts
`./src/app.js`: entry point of the express REST API (routes)
`./src/generateToken.js`: script to create a rw access to the backend (use with CAUTION)
`./src/ggQuestServer.js`: all server functions called by app.js
`./src/middleware.js`: authentication middleware

## Deploy

A step by step guide that will tell you how to get the development environment up and running:

**1 - Install mysql and create a dedicated database named _ggquest_.**

**2 - Clone this repository and go to the backend folder**
```
git clone git@github.com:ggQuest/ggQuest.git && cd ggQuest/backend
```

**3 - Install dependencies**
```
npm install
```

**4 - Create a .env file:**
```
vim .env
```

```
PRIVATE_KEY = <private key of the backend polygon account>
ALCHEMY_PROJECT_ID = <alchemy account identifier>
ETHERSCAN_KEY = <POLYGONSCAN account api key>
MYSQL_DATABASE = ggquest
MYSQL_USERNAME = <username of mysql db>
MYSQL_PASSWORD = <password of mysql db>
```

**4 - Deploy the contracts:**
```
cd src/
npx hardhat run ../scripts/deploy.js --network mumbai
```
_ignore errores saying that the contract is already verified_
Contracts will be deployed and the backend address will be automatically set as operator.

**5 - Update the contract addresses in the backend:**
Using the output of the previous command, complete the `./src/addresses.json` file with the correct addresses.

**6 - Create an API token:**
```
npx hardhat run generateToken.js
```

**7 - Launch server:**
```
npx hardhat run app.js --network mumbai
```

## Next steps

- [ ] Divide reputation per game instead of one unique reputation score per user
- [ ] Make quests conditions cross-chain
- [ ] Add other kind of quest conditions