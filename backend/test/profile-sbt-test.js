const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProfileSBTs", function () {
  
    before(async function() {
        [deployer,account1,account2,trashAccount] = await ethers.getSigners();
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
        it("Sould register sender by creating profile", async function () {
            await this.profilesSBTs.connect(account1).mint(["account_1", "", ""]);
            expect((await this.profilesSBTs.getProfileData(account1.address)).pseudo).to.be.equal("account_1");
            expect((await this.profilesSBTs.hasProfileData(account1.address))).to.be.true;
        });

        it("Sould not register empty pseudo", async function () {
            await expect(this.profilesSBTs.connect(account2).mint(["", "", ""])).to.be.reverted;
        });

        it("Sould not register already registered pseudo", async function () {
            // TODO
        });

        it("Sould not register twice the same address", async function () {
            // TODO
        });
    })

    describe("Burning", function () {
        it("Non-operator should not delete user profile", async function () {
            // TODO
        });

        it("Operator should delete user profile", async function () {
            // TODO
        });

        it("Sould not register already registered pseudo", async function () {
            // TODO
        });
    })

    describe("Updating", function () {
        it("Only profile owner should update its profile", async function () {
            // TODO
        });

        it("Sould not allow empty pseudo", async function () {
            // TODO
        });

        it("Sould not allow already taken pseudo", async function () {
            // TODO
        });

        it("Sould update user data", async function () {
            // TODO
        });
    })

    describe("Reputation", function () {
        it("Only operators should increase or decrease reputation", async function () {
            // TODO
        });

        it("Should decrease reputation", async function () {
            // TODO
        });

        it("Should increase reputation", async function () {
            // TODO
        });
    })

    describe("Third parties", function () {
        it("Only operators should add a supported third party", async function () {
            // TODO
        });

        it("Only operators should link a third party to a profile", async function () {
            // TODO
        });

        it("Only operators should unlink a third party to a profile", async function () {
            // TODO
        });

        it("Should link a third party to a profile", async function () {
            // TODO
        });

        it("Should unlink a third party to a profile", async function () {
            // TODO
        });
    })

  
});
