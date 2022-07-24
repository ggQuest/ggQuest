const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ggQuest", function () {
  
  before(async function() {
    [deployer, account1, account2] = await ethers.getSigners();

    /**** Deploy each game demo contracts ****/

    // Babylon Arena (Items NFT)
    BabylonArenaItems = await hre.ethers.getContractFactory("BabylonArenaItems");
    this.babylonArenaItems = await BabylonArenaItems.deploy();
    await this.babylonArenaItems.deployed();
    

    // Fruits Shooter (Scores contract)
    FruitsShooterScores = await hre.ethers.getContractFactory("FruitsShooterScores");
    this.fruitsShooterScores = await FruitsShooterScores.deploy();
    await this.fruitsShooterScores.deployed();
    

    /**** Deploy each game Reputation contract ****/

    // Babylon Arena
    BabylonArenaReputationContract = await hre.ethers.getContractFactory("ReputationSBT");
    this.babylonArenaReputationContract = await BabylonArenaReputationContract.deploy("Babylon Arena", 50);
    await this.babylonArenaReputationContract.deployed();
    

    // Fruits Shooter
    FruitsShooterReputationContract = await hre.ethers.getContractFactory("ReputationSBT");
    this.fruitsShooterReputationContract = await FruitsShooterReputationContract.deploy("Fruits Shooter", 30);
    await this.fruitsShooterReputationContract.deployed();
    

    /**** Deploy Quest contracts ****/

    // Babylon Arena
    BabylonArenaQuest1 = await hre.ethers.getContractFactory("BabylonArenaQuest1");
    this.babylonArenaQuest1 = await BabylonArenaQuest1.deploy(
      this.babylonArenaReputationContract.address, "http://13.38.8.173:8080/api/quests/1", this.babylonArenaItems.address);
    await this.babylonArenaQuest1.deployed();
    

    // Fruits Shooter
    FruitsShooterQuest1 = await hre.ethers.getContractFactory("FruitsShooterQuest1");
    this.fruitsShooterQuest1 = await FruitsShooterQuest1.deploy(
      this.fruitsShooterReputationContract.address, "http://13.38.8.173:8080/api/quests/2", this.fruitsShooterScores.address);
    await this.fruitsShooterQuest1.deployed();
    

    // Add quests to Reputation contracts operators
    this.babylonArenaReputationContract.addOperator(this.babylonArenaQuest1.address);
    this.fruitsShooterReputationContract.addOperator(this.fruitsShooterQuest1.address);
  });

  it("Should successfuly claim and increase score", async function () {
    // Player makes a score > 30 on Fruits Shooter
    await this.fruitsShooterScores.gameEnded(40, account1.address);

    // He claims the quest reward
    await this.fruitsShooterQuest1.connect(account1).claimReward()

    // He receives 10 reputation points
    expect(await this.fruitsShooterReputationContract.getReputationScore(account1.address)).to.be.equals(10);
  });

  it("Should revert claim call", async function () {
    // He claims the quest reward
    await expect(this.fruitsShooterQuest1.connect(account2).claimReward()).to.be.reverted;

    // He did not receive 10 reputation points
    expect(await this.fruitsShooterReputationContract.getReputationScore(account2.address)).to.be.equals(0);
  });
});
