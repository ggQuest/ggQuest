const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ggQuests", function () {
  
    before(async function() {
        [deployer,account1,account2, account3,trashAccount] = await ethers.getSigners();
        const ggProfilesContract = await hre.ethers.getContractFactory("ggProfiles");
        this.ggProfiles = await ggProfilesContract.deploy("ggProfiles", "GGP");
        await this.ggProfiles.deployed();

        const ggQuestsContract = await hre.ethers.getContractFactory("ggQuests");
        this.ggQuests = await ggQuestsContract.deploy(this.ggProfiles.address, "https://gg.quest/api/quests/", "https://gg.quest/api/games/");
        await this.ggQuests.deployed();
        await this.ggProfiles.addOperator(this.ggQuests.address);

        const FooToken = await hre.ethers.getContractFactory("ERC20Token");
        this.fooToken = await FooToken.deploy("FooToken", "FTK", 1000);
        await this.fooToken.deployed();

        const BarToken = await hre.ethers.getContractFactory("ERC20Token");
        this.barToken = await BarToken.deploy("BarToken", "BTK", 1000);
        await this.fooToken.deployed();

        await this.ggProfiles.mint(["deployer", "", ""]);
        await this.ggProfiles.connect(account1).mint(["account1", "", ""]);
        await this.ggProfiles.connect(account2).mint(["account2", "", ""]);
    });

    describe("Operators", function () {
        it("Operator should add operator", async function () {
            await this.ggProfiles.addOperator(trashAccount.address);
            expect(await this.ggProfiles.isOperator(trashAccount.address)).to.be.true;
        });

        it("Operator should remove operator", async function () {
            await this.ggProfiles.removeOperator(trashAccount.address);
            expect(await this.ggProfiles.isOperator(trashAccount.address)).to.be.false;
        });

        it("Non-operator should not add operator", async function () {
            expect(this.ggProfiles.connect(account1).addOperator(trashAccount.address)).to.be.revertedWith("Only operators can call this function")
        });

        it("Non-operator should not remove operator", async function () {
            expect(this.ggProfiles.connect(account1).removeOperator(deployer.address)).to.be.revertedWith("Only operators can call this function");
        });
    })

    describe("Games", function () {
        it("Non-operator shouldn't add game", async function () {
            await expect(this.ggQuests.connect(account1).addGame("Axie Infinity")).to.be.revertedWith("Only operators can call this function");
        });

        it("Should add game", async function () {
            await this.ggQuests.addGame("Axie Infinity");
            await this.ggQuests.addGame("Eve.io");
            expect((await this.ggQuests.getGames()).length).to.be.equal(2);
            expect((await this.ggQuests.getGames())[0]).to.be.equal("Axie Infinity");
            expect((await this.ggQuests.getGames())[1]).to.be.equal("Eve.io");
        });

        it("Should return the correct URL", async function () {
            expect(await this.ggQuests.getUrlMetadata(0)).to.be.equal("https://gg.quest/api/games/0");
            expect(await this.ggQuests.getUrlMetadata(1)).to.be.equal("https://gg.quest/api/games/1");
            await expect(this.ggQuests.getUrlMetadata(2)).to.be.revertedWith("GameId does not exist");
        });
    })

    describe("Quests", function () {

        it("Should create quests", async function () {
            this.ggQuests.createQuest(15, 0);
            this.ggQuests.createQuest(20, 0);
            this.ggQuests.createQuest(10, 1);

            expect((await this.ggQuests.getQuests()).length).to.be.equal(3);
        });

        it("Should return the right URI", async function () {
            expect(await this.ggQuests.getQuestURI(0)).to.be.equal("https://gg.quest/api/quests/0");
            expect(await this.ggQuests.getQuestURI(1)).to.be.equal("https://gg.quest/api/quests/1");
            expect(await this.ggQuests.getQuestURI(2)).to.be.equal("https://gg.quest/api/quests/2");
            await expect(this.ggQuests.getUrlMetadata(3)).to.be.revertedWith("GameId does not exist");
        });

        it("Should add operator to quest", async function () {
            await this.ggQuests.addQuestOperator(0, deployer.address);

            const Quest = await hre.ethers.getContractFactory("ggQuest");
            this.quest0 = await Quest.attach((await this.ggQuests.getQuests())[0]);

            expect(await this.quest0.isOperator(deployer.address)).to.be.true;
        });

        it("Should not add not owned reward", async function () {
            await expect(this.quest0.addReward([0, this.fooToken.address, 20, 10, 0])).to.be.revertedWith("ggQuest contract doesn't own enough tokens");
            await this.fooToken.transfer(this.quest0.address, 20);
            await expect(this.quest0.addReward([0, this.fooToken.address, 20, 10, 0])).to.be.revertedWith("ggQuest contract doesn't own enough tokens");
        });

        it("Should add reward", async function () {
            await expect(this.quest0.addReward([0, this.fooToken.address, 20, 1, 0])).to.not.reverted;

            expect((await this.quest0.getRewards()).length).to.be.equal(1);
        });

        it("Should not add reward with same token as existing reward", async function () {
            await this.fooToken.transfer(this.quest0.address, 1);
            await expect(this.quest0.addReward([0, this.fooToken.address, 1, 1, 0])).to.be.revertedWith("Token contract already used in another reward of the quest");
        });        
        
        it("Should not add rewards after activation", async function () {
            await this.quest0.activateQuest();
            this.barToken.transfer(this.quest0.address, 20);
            await expect(this.quest0.addReward([0, this.barToken.address, 20, 1, 0])).to.revertedWith("Rewards cannot be added after quest activation");
        });

        it("Should send reward and reputation when completed", async function () {
            await this.quest0.sendReward(account1.address);
            expect(await this.fooToken.balanceOf(account1.address)).to.be.equal(20);
            expect((await this.ggProfiles.getReputation(account1.address))[0]).to.be.equal(15);
        });

        it("Should revert if no more reward available", async function () {
            await expect(this.quest0.sendReward(account2.address)).to.be.revertedWith("All rewards have been distributed");
            expect(await this.fooToken.balanceOf(account2.address)).to.be.equal(0);
            expect((await this.ggProfiles.getReputation(account2.address))[0]).to.be.equal(0);
        });

        it("Should not update quest reward if not enough tokens", async function () {
            await expect(this.quest0.increaseRewardAmount(5, [0, this.fooToken.address, 0, 0, 0])).to.be.revertedWith("ggQuest contract doesn't own enough tokens");
        });

        it("Should update quest reward", async function () {
            await this.fooToken.transfer(this.quest0.address, 100);
            await this.quest0.increaseRewardAmount(5, [0, this.fooToken.address, 0, 0, 0]);
        });

        it("Should not send reward and reputation if already completed", async function () {
            await expect(this.quest0.sendReward(account1.address)).to.be.revertedWith("Quest already completed by this player");
        });
        
        it("Should update reputation reward", async function () {
            await this.quest0.updateReputationReward(30);
            expect(await this.quest0.reputationReward()).to.been.equal(30);
        });

        it("Should withdraw all remaining rewards after deactivation", async function () {
            const initialBalance = await this.fooToken.balanceOf(this.quest0.address);
            await this.quest0.deactivateQuest(account2.address);
            expect(await this.fooToken.balanceOf(this.quest0.address)).to.be.equal(0);
            expect(await this.fooToken.balanceOf(account2.address)).to.be.equal(initialBalance);
        });
    })
});
