const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ggQuests", function () {
  
    before(async function() {
        [deployer,account1,account2, account3,trashAccount] = await ethers.getSigners();
        const ProfilesSBTs = await hre.ethers.getContractFactory("ggProfiles");
        this.profilesSBTs = await ProfilesSBTs.deploy("ggProfiles", "GGP");
        await this.profilesSBTs.deployed();

        const ggQuestsContract = await hre.ethers.getContractFactory("ggQuests");
        this.ggQuests = await ggQuestsContract.deploy(this.profilesSBTs.address, "https://gg.quest/api/quests/", "https://gg.quest/api/games/");
        await this.ggQuests.deployed();

        const FooToken = await hre.ethers.getContractFactory("ERC20Token");
        this.fooToken = await FooToken.deploy("FooToken", "FTK", 1000);
        await this.fooToken.deployed();
    });

    describe("Operators", function () {
        it("Operator should add operator", async function () {
            await this.profilesSBTs.addOperator(trashAccount.address);
            expect(await this.profilesSBTs.isOperator(trashAccount.address)).to.be.true;
        });

        it("Operator should remove operator", async function () {
            await this.profilesSBTs.removeOperator(trashAccount.address);
            expect(await this.profilesSBTs.isOperator(trashAccount.address)).to.be.false;
        });

        it("Non-operator should not add operator", async function () {
            expect(this.profilesSBTs.connect(account1).addOperator(trashAccount.address)).to.be.revertedWith("Only operators can call this function")
        });

        it("Non-operator should not remove operator", async function () {
            expect(this.profilesSBTs.connect(account1).removeOperator(deployer.address)).to.be.revertedWith("Only operators can call this function");
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
            await this.fooToken.transfer(this.quest0.address, 200);
            await expect(this.quest0.addReward([0, this.fooToken.address, 20, 10, 0])).to.not.reverted;

            expect((await this.quest0.getRewards()).length).to.be.equal(1);
        });

        it("Should not add reward with same token as existing reward", async function () {
            await this.fooToken.transfer(this.quest0.address, 400);
            await expect(this.quest0.addReward([0, this.fooToken.address, 40, 10, 0])).to.be.revertedWith("Token contract already used in another reward of the quest");
        });

        it("Should remove reward", async function () {
            // TODO
        });

        it("Should send reward and reputation when completed", async function () {
            // TODO
        });
        
        it("Should update reputation reward", async function () {
            // TODO
        });

        it("Should send reward when completed", async function () {
            // TODO
        });

        it("Should not add or remove rewards after activation", async function () {
            // TODO
        });

        it("Should withdraw all remaining rewards after deactivation", async function () {
            // TODO
        });

        it("Should correctly log addresses who completed the quest", async function () {
            // TODO
        });

        it("Should only allow operators on quests functions", async function () {
            // TODO
        });
    })
});
