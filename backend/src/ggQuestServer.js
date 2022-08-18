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
    await ggQuests.addGame(game.name);
    let games = await ggQuests.getGames();
    game.id = games.findIndex(gameName => gameName === game.name);
    return gamesController.createGame(game);
  },
  /*updateGame: async function(game) {
    gamesController.updateGame(game);
  },*/
  getGame: async function(gameId) {
    return gamesController.find(gameId);
  },
  getGames: async function() {
    return gamesController.findAll();
  },
  /*

  createQuest: async function(quest) {
    // Onchain
    await ggQuests.createQuest(quest.reputationReward, quest.gameId);

    // Offchain
    quest.address = await ggQuests.getQuestAddress(quest.id);
    let condition = stateConditionController.find(quest.condition);
    let stateCondition = stateConditionController.createStateCondition(condition);
    questsController.createQuest(gameId, quest, stateCondition);
  },
  updateQuest: async function(questId, quest) {
    // TODO
  },
  getQuest: async function(questId) {
    let quest = questsController.getQuest(questId);
    let onchainQuest = ggQuestContract.attach(quest.address);
    quest.reputationReward = await onchainQuest.reputationReward();
    quest.isActive = await onchainQuest.isActive();

    return quest;
  },
  getQuests: async function() {
    // Onchain
    let onchainQuestsData = await ggQuests.getQuests();

    // Merge onchain and offchain quest data
    let quests = [];
    let quest;
    for (let i = 0; i < onchainQuestsData.length; index++) {
      quest = Object.assign({}, onchainQuestsData[i], questsController.find(i));
      let onchainQuest = ggQuestContract.attach(quest.address);
      quests.additionalRewards = await onchainQuest.getRewards();
      quests.push(quest);
    }
    return quests;
  },
  getQuests: async function(gameId) {
    let results = [];
    
    // Offchain
    let offChainQuests = questsController.findAllByGame(gameId);
    
    // Onchain
    let onchainQuest;
    offChainQuests.forEach(async offChainQuest => {
      onchainQuest = await ggQuestContract.getQuest(offChainQuest.id);
      results.push(Object.assign({}, offChainQuest, onchainQuest));
    });

    return results;
  },

  addReward: async function(questId, reward) {
    let quest = questsController.getQuest(questId);
    let onchainQuest = ggQuestContract.attach(quest.address);

    onchainQuest.addReward(reward);
  },
  getRewards: async function(questId) {
    let quest = questsController.getQuest(questId);
    let onchainQuest = ggQuestContract.attach(quest.address);

    let result = await onchainQuest.getRewards();
    return result;
  },
  verifyAndSendReward: async function(questId, player) {
    // TODO
  },
  increaseRewardAmount: async function(questId, reward, amount) {
    let quest = questsController.getQuest(questId);
    let onchainQuest = ggQuestContract.attach(quest.address);

    await onchainQuest.increaseRewardAmount(amount, reward);
  }*/
}