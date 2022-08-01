const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProfileSBTs", function () {
  
    before(async function() {
        [deployer,account1,account2, account3,trashAccount] = await ethers.getSigners();
        const ProfilesSBTs = await hre.ethers.getContractFactory("ProfilesSBTs");
        this.profilesSBTs = await ProfilesSBTs.deploy("ggProfiles", "GGP");
        await this.profilesSBTs.deployed();
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
            expect(this.profilesSBTs.connect(account1).addOperator(trashAccount.address)).to.be.revertedWith("Only operators can manage operators")
        });

        it("Non-operator should not remove operator", async function () {
            expect(this.profilesSBTs.connect(account1).removeOperator(deployer.address)).to.be.revertedWith("Only operators can manage operators");
        });
    })

    describe("Minting", function () {
        it("Should register sender by creating profile", async function () {
            await this.profilesSBTs.connect(account1).mint(["account_1", "", ""]);
            expect((await this.profilesSBTs.getProfileData(account1.address)).pseudo).to.be.equal("account_1");
            expect(await this.profilesSBTs.hasProfileData(account1.address)).to.be.true;
            await this.profilesSBTs.connect(account2).mint(["account_2", "", ""]);
        });

        it("Should not register empty pseudo", async function () {
            await expect(this.profilesSBTs.connect(account3).mint(["", "", ""])).to.be.reverted;
        });

        it("Should not register already registered pseudo", async function () {
            await expect(this.profilesSBTs.connect(account3).mint(["account_1", "", ""])).to.be.reverted;
        });

        it("Should not register twice the same address", async function () {
            await expect(this.profilesSBTs.connect(account1).mint(["account_1_bis", "", ""])).to.be.reverted;
        });
    })

    describe("Burning", function () {
        it("Operator should delete user profile", async function () {
            await this.profilesSBTs.burn(account1.address);
            expect(await this.profilesSBTs.hasProfileData(account1.address)).to.be.false;
        });

        it("Non-operator should not delete user profile", async function () {
            await this.profilesSBTs.connect(account1).mint(["account_1", "", ""]);
            await expect(this.profilesSBTs.connect(account1).burn(account1.address)).to.be.reverted;
        });
    })

    describe("Updating", function () {
        it("Should not allow unminted profile update", async function () {
            await expect(this.profilesSBTs.connect(trashAccount).update(["test", "", ""])).to.be.reverted;
        });

        it("Should not allow empty pseudo", async function () {
            await expect(this.profilesSBTs.connect(account1).update(["", "", ""])).to.be.reverted;
        });

        it("Should not allow updates with already taken pseudo", async function () {
            await expect(this.profilesSBTs.connect(account2).update(["account_1", "", ""])).to.be.reverted;
        });

        it("Should update user data", async function () {
            await this.profilesSBTs.connect(account2).update(["account_2_modified", "https://url1/image.png", "https://url2/image.png"]);
            profile = await this.profilesSBTs.getProfileData(account2.address);
            expect(profile[0]).to.be.equal("account_2_modified");
            expect(profile[1]).to.be.equal("https://url1/image.png");
            expect(profile[2]).to.be.equal("https://url2/image.png");
        });
    })

    describe("Reputation", function () {
        it("Only operators should increase or decrease reputation", async function () {
            await expect(this.profilesSBTs.connect(account1).increaseReputation(account1.address, 10)).to.be.reverted;
            await expect(this.profilesSBTs.connect(account1).decreaseReputation(account1.address, 10)).to.be.reverted;
        });

        it("Reputation change should revert if no profile associated with address", async function () {
            await expect(this.profilesSBTs.increaseReputation(account3.address, 10)).to.be.reverted;
            await expect(this.profilesSBTs.decreaseReputation(account3.address, 10)).to.be.reverted;
        });

        it("Should decrease reputation", async function () {
            await this.profilesSBTs.increaseReputation(account1.address, 10);
            expect((await this.profilesSBTs.getReputation(account1.address))[0]).to.be.equal(10);
            expect((await this.profilesSBTs.getReputation(account1.address))[1]).to.be.equal(0);
        });

        it("Should increase reputation", async function () {
            await this.profilesSBTs.decreaseReputation(account1.address, 5);
            expect((await this.profilesSBTs.getReputation(account1.address))[0]).to.be.equal(10);
            expect((await this.profilesSBTs.getReputation(account1.address))[1]).to.be.equal(5);
        });
    })

    describe("Third parties", function () {
        it("Only operators should add a supported third party", async function () {
            await expect(this.profilesSBTs.connect(account1).addThirdParty("DISCORD")).to.be.reverted;
        });

        it("Should add a supported third party", async function () {
            await this.profilesSBTs.addThirdParty("DISCORD");
            await this.profilesSBTs.addThirdParty("TWITCH");
            await this.profilesSBTs.addThirdParty("YOUTUBE");
            await this.profilesSBTs.addThirdParty("STEAM");
            expect((await this.profilesSBTs.getThirdParties())[0]).to.be.equal("DISCORD");
            expect((await this.profilesSBTs.getThirdParties())[1]).to.be.equal("TWITCH");
            expect((await this.profilesSBTs.getThirdParties())[2]).to.be.equal("YOUTUBE");
            expect((await this.profilesSBTs.getThirdParties())[3]).to.be.equal("STEAM");
        });

        it("Only operators should link or unlink a third party to a profile", async function () {
            await expect(this.profilesSBTs.connect(account1).linkThirdPartyToProfile(
                account1.address, 0, "80351110224678912")).to.be.reverted;
            
            await this.profilesSBTs.linkThirdPartyToProfile(account1.address, 0, "80351110224678912");

            await expect(this.profilesSBTs.connect(account1).unlinkThirdPartyFromProfile(
                account1.address, 0)).to.be.reverted;
        });

        it("Should link a third party to a profile", async function () {
            await this.profilesSBTs.linkThirdPartyToProfile(account1.address, 1, 2246789128035111);
            expect((await this.profilesSBTs.getProfileData(account1.address)).linkedThirdParties[1].thirdPartyId.toNumber()).to.be.equal(1);
            expect((await this.profilesSBTs.getProfileData(account1.address)).linkedThirdParties[1].userID.toNumber()).to.be.equal(2246789128035111);

        });

        it("Should unlink a third party to a profile", async function () {
            await this.profilesSBTs.unlinkThirdPartyFromProfile(account1.address, 1);
            expect((await this.profilesSBTs.getProfileData(account1.address)).linkedThirdParties.length).to.be.equal(1);
        });

        it("Should not link a third party twice to the same profile", async function () {
            await expect(this.profilesSBTs.linkThirdPartyToProfile(account1.address, 0, 3346789128035111)).to.be.reverted;
        });
    })

  
});
