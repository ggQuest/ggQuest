const hre = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    /**** Deploy main contracts ****/

    // ggProfiles
    const ggProfilesContract = await hre.ethers.getContractFactory("ggProfiles");
    this.ggProfiles = await ggProfilesContract.deploy("ggProfiles", "GGP");
    await this.ggProfiles.deployed();
    console.log("ggProfiles contract deployed to:", ggProfiles.address);

    // ggQuests
    const ggQuestsContract = await hre.ethers.getContractFactory("ggQuests");
    this.ggQuests = await ggQuestsContract.deploy(this.ggProfiles.address, "https://gg.quest/api/quests/", "https://gg.quest/api/games/");
    await this.ggQuests.deployed();
    await this.ggProfiles.addOperator(this.ggQuests.address);
    console.log("ggQuests contract deployed to:", ggQuests.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
