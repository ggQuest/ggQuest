const hre = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    /**** Deploy each game demo contracts ****/

    // Babylon Arena (Items NFT)
    const BabylonArenaItems = await hre.ethers.getContractFactory("BabylonArenaItems");
    const babylonArenaItems = await BabylonArenaItems.deploy();
    await babylonArenaItems.deployed();
    console.log("Babylon Arena Items contract deployed to:", babylonArenaItems.address);

    // Fruits Shooter (Scores contract)
    const FruitsShooterScores = await hre.ethers.getContractFactory("FruitsShooterScores");
    const fruitsShooterScores = await FruitsShooterScores.deploy();
    await fruitsShooterScores.deployed();
    console.log("Fruits Shooter Scores contract deployed to:", fruitsShooterScores.address);

    /**** Deploy each game Reputation contract ****/

    // Babylon Arena
    const BabylonArenaReputationContract = await hre.ethers.getContractFactory("ReputationSBT");
    const babylonArenaReputationContract = await BabylonArenaReputationContract.deploy("Babylon Arena", 50);
    await babylonArenaReputationContract.deployed();
    console.log("Babylon Arena Reputation contract deployed to:", babylonArenaReputationContract.address);

    // Fruits Shooter
    const FruitsShooterReputationContract = await hre.ethers.getContractFactory("ReputationSBT");
    const fruitsShooterReputationContract = await FruitsShooterReputationContract.deploy("Fruits Shooter", 30);
    await fruitsShooterReputationContract.deployed();
    console.log("Fruits Shooter Reputation contract deployed to:", fruitsShooterReputationContract.address);

    /**** Deploy Quest contracts ****/

    // Babylon Arena
    const BabylonArenaQuest1 = await hre.ethers.getContractFactory("BabylonArenaQuest1");
    const babylonArenaQuest1 = await BabylonArenaQuest1.deploy(babylonArenaReputationContract.address, babylonArenaItems.address);
    await babylonArenaQuest1.deployed();
    console.log("Babylon Arena Quest 1 contract deployed to:", babylonArenaQuest1.address);

    // Fruits Shooter
    const FruitsShooterQuest1 = await hre.ethers.getContractFactory("FruitsShooterQuest1");
    const fruitsShooterQuest1 = await FruitsShooterQuest1.deploy(fruitsShooterReputationContract.address, fruitsShooterScores.address);
    await fruitsShooterQuest1.deployed();
    console.log("Fruits Shooter Quest 1 contract deployed to:", fruitsShooterQuest1.address);

    // Add quests to Reputation contracts operators
    babylonArenaReputationContract.addOperator(babylonArenaQuest1.address);
    fruitsShooterReputationContract.addOperator(fruitsShooterQuest1.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
