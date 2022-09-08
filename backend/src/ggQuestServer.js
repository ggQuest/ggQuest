const hre = require("hardhat");
const db = require("./models");
const questsController = require("./controller/quest.controller.js");
const gamesController = require("./controller/game.controller.js");
const stateConditionController = require("./controller/stateCondition.controller.js");
db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

const fs = require('fs');

let rawdata = fs.readFileSync("./addresses.json");
var addresses = JSON.parse(rawdata);
/*
var ggProfilesContract = await hre.ethers.getContractFactory("ggProfiles");
var ggProfiles = ggProfilesContract.attach(addresses.ggProfiles);

var ggQuestsContract = await hre.ethers.getContractFactory("ggQuests");
var ggQuests = ggQuestsContract.attach(addresses.ggQuests);

var ggQuestContract = await hre.ethers.getContractFactory("ggQuest");
*/
module.exports = {
  getProfile: async function(address) {
    var ggProfilesContract = await hre.ethers.getContractFactory("ggProfiles");
    var ggProfiles = ggProfilesContract.attach(addresses.ggProfiles);

    let rawProfile = await ggProfiles.getProfileData(address);
    let profile = {
      address: address,
      pseudo: rawProfile[0],
      profilePictureURL: rawProfile[1],
      coverPictureURL: rawProfile[2],
      isRegistered: rawProfile[3],
      gainedReputation: Number(rawProfile[4]),
      lostReputation: Number(rawProfile[5]),
      linkedThirdParties: rawProfile[6]
    }
    return profile;
  },
  getProfiles: async function() {
    var ggProfilesContract = await hre.ethers.getContractFactory("ggProfiles");
    var ggProfiles = ggProfilesContract.attach(addresses.ggProfiles);

    let registeredProfiles = await ggProfiles.getRegisteredAddresses();

    var profiles = registeredProfiles.map(async (profileAddress, index) => {
      let rawProfile = await ggProfiles.getProfileData(profileAddress);
      let profile = {
        id: index,
        address: profileAddress,
        pseudo: rawProfile[0],
        profilePictureURL: rawProfile[1],
        coverPictureURL: rawProfile[2],
        isRegistered: rawProfile[3],
        gainedReputation: Number(rawProfile[4]),
        lostReputation: Number(rawProfile[5]),
        linkedThirdParties: rawProfile[6]
      }
      return profile;
    })

    const results = await Promise.all(profiles)
    return results;
  },

  createGame: async function(game) {
    const ggQuestsContract = await hre.ethers.getContractFactory("ggQuests");
    const ggQuests = ggQuestsContract.attach(addresses.ggQuests);
    let addGameTx = await ggQuests.addGame(game.name);
    await hre.ethers.provider.waitForTransaction(addGameTx.hash);
    let games = await ggQuests.getGames();
    game.id = games.findIndex(gameName => gameName === game.name);
    return gamesController.createGame(game);
  },
  updateGame: async function(gameId, game) {
    return gamesController.updateGame(gameId, game);
  },
  getGame: async function(gameId) {
    return gamesController.find(gameId);
  },
  getGames: async function() {
    return gamesController.findAll();
  },

  createQuest: async function(quest) {
    // Create quest on chain
    const ggQuestsContract = await hre.ethers.getContractFactory("ggQuests");
    const ggQuests = ggQuestsContract.attach(addresses.ggQuests);
    //let questCreateTx = await ggQuests.createQuest(quest.reputationReward, quest.gameId);
    //await hre.ethers.provider.waitForTransaction(questCreateTx.hash);

    // Create quest offchain
    let parsedQuest = {
      title: quest.title,
      description: quest.description,
      thumbnailImageURL: quest.thumbnailImageURL,
      imageURL: quest.imageURL,
      gameId: quest.gameId
    }
    let createdQuest = await questsController.createQuest(parsedQuest);
    let questId = createdQuest.id;

    // Fix first auto increment to 1 and not 0
    // TODO

    // Get the created quest contract address onchain
    let questAddress = await ggQuests.getQuestAddress(questId);
    let questUpdate = { address: questAddress }
    questsController.updateQuest(questId, questUpdate);

    // Create the state conditions
    quest.stateConditions.forEach(stateCondition => {
      stateCondition.questId = questId;
      stateConditionController.createStateCondition(stateCondition);
    });

    // Add the stateConditions and address to the response
    let response = questsController.find(questId);
    return response;
  },

  updateQuest: async function(questId, quest) {
    console.log(quest);
    let updatedQuest = questsController.updateQuest(questId, quest);
    return updatedQuest;
  },

  getQuests: async function() {
    return questsController.findAll();
  },

  getQuest: async function(questId) {
    let questMetadata = await questsController.find(questId);

    const questContract = await hre.ethers.getContractFactory("ggQuest");
    const quest = questContract.attach(questMetadata.address);
    // add onchain data (read onchain)
    questMetadata.completedBy = await quest.getPlayers();
    questMetadata.reputationReward = await quest.reputationReward();
    questMetadata.rewards = await quest.getRewards();
  },

  addReward: async function(questId, reward) {
    let address = questsController.find(questId).address;
    const questContract = await hre.ethers.getContractFactory("ggQuest");
    const quest = questContract.attach(address);

    await quest.addReward(reward);
  }

}