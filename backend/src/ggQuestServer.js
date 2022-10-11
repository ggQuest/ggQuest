const hre = require("hardhat");
const db = require("./models");
const Web3 = require('web3');

//Web3 init
const walletPrivateKey = process.env.walletPrivateKey;
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const myAcc = web3.eth.accounts.wallet.add(walletPrivateKey);

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

// extract params from func
var ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(fnStr) {
  var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if(result === null)
     result = [];
  return result;
}

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
    let questCreateTx = await ggQuests.createQuest(quest.reputationReward, quest.gameId);
    await hre.ethers.provider.waitForTransaction(questCreateTx.hash);

    let questOnchainId = (await ggQuests.getQuests()).length-1;

    // Get the created quest contract address onchain
    let questAddress = await ggQuests.getQuestAddress(questOnchainId);

    // Create quest offchain
    let parsedQuest = {
      address: questAddress,
      onchainId: questOnchainId,
      title: quest.title,
      description: quest.description,
      thumbnailImageURL: quest.thumbnailImageURL,
      imageURL: quest.imageURL,
      gameId: quest.gameId
    }
    let createdQuest = await questsController.createQuest(parsedQuest);

    // Create the state conditions
    quest.stateConditions.forEach(stateCondition => {
      stateCondition.questId = createdQuest.id;
      stateConditionController.createStateCondition(stateCondition);
    });

    // Add the stateConditions and address to the response
    return questsController.find(createdQuest.id);
  },

  updateQuest: async function(questId, quest) {
    let dbQuest = questsController.find(questId)
    if(quest.gameId != null && quest.gameId != dbQuest.gameId) {
      throw 'Game ID cannot be changed.' 
    }
    quest.stateConditions.forEach(stateCondition => {
      stateConditionController.updateStateCondition(stateCondition.id, stateCondition);
    });
    let updatedQuest = questsController.updateQuest(questId, quest);
    return updatedQuest;
  },

  updateQuestByOnchainId: async function(questId, quest) {
    let dbQuest = await questsController.findByOnchainId(questId)
    if(quest.gameId != null && quest.gameId != dbQuest.gameId) {
      throw 'Game ID cannot be changed.' 
    }
    quest.stateConditions.forEach(stateCondition => {
      stateConditionController.updateStateCondition(stateCondition.id, stateCondition);
    });
    let updatedQuest = questsController.updateQuestByOnchainId(questId, quest);
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
    let rawRewards = await quest.getRewards();
    rawRewards.forEach(rawReward => {
      switch (rawReward[0]) {
        case 0:
          questMetadata.rewardType = "ERC20";
          break;
        case 1:
          questMetadata.rewardType = "ERC721";
          break;
        case 2:
          questMetadata.rewardType = "ERC1155";
        break;
      }
      questMetadata.rewardContract = rawReward[1];
      questMetadata.tokenAmount = rawReward[2];
      questMetadata.amount = rawReward[3];
      questMetadata.tokenId = rawReward[4];
    });

    return questMetadata;
  },

  getQuestByOnchainId: async function(questId) {
    let questMetadata = await questsController.findByOnchainId(questId);

    const questContract = await hre.ethers.getContractFactory("ggQuest");
    const quest = questContract.attach(questMetadata.address);
    // add onchain data (read onchain)
    questMetadata.completedBy = await quest.getPlayers();
    questMetadata.reputationReward = await quest.reputationReward();

    let rawRewards = await quest.getRewards();
    rawRewards.forEach(rawReward => {
      switch (rawReward[0]) {
        case 0:
          questMetadata.rewardType = "ERC20";
          break;
        case 1:
          questMetadata.rewardType = "ERC721";
          break;
        case 2:
          questMetadata.rewardType = "ERC1155";
        break;
      }
      questMetadata.rewardContract = rawReward[1];
      questMetadata.tokenAmount = rawReward[2];
      questMetadata.amount = rawReward[3];
      questMetadata.tokenId = rawReward[4];
    });
    

    return questMetadata;
  },

  addReward: async function(questOnchainId, reward) {
    let questById = await questsController.findByOnchainId(questOnchainId);
    let address = questById.address;
    const questContract = await hre.ethers.getContractFactory("ggQuest");
    const quest = questContract.attach(address);
    
    let rewardType;
    switch (reward.rewardType) {
      case "ERC20":
        rewardType = 0;
        break;
      case "ERC721":
        rewardType = 1;
        break;
      case "ERC1155":
        rewardType = 2;
      break;
    }
    let rawReward = [
      rewardType,
      reward.rewardContract,
      reward.tokenAmount,
      reward.amount,
      reward.id == undefined ? 0 : reward.id
    ]
    await quest.addReward(reward);
  },

  verifyReward: async function(questId, userParams) {
    // Fetch all requirements that must be met for quest id
    // Check for each of them if userAddress pass the requirement
    // get all conditions stored off chain

    const conditions = await stateConditionController.findAll();
    // keep only the ones tied to the questId asked
    const filteredCond = conditions.filter(obj=> obj.questId === questId);

    filteredCond.forEach(async (condition) => {

      const contractAddress = condition.questId;
      const functionToCall = condition.function;
      const params = condition.parameters;
      const valueToBeCompared = condition.compareWith;
      const operand = condition.operator;
      
      // replace $arg$ by arg provided in body of api call
      const finalParams = [];
      params.forEach((param)=> {
        if (param.substring(0, 1) === '$') {
          // remove last and first chars
          const prop = param.substring(1,param.length-1);
          // we pull the right param from user params input
          const value = userParams[prop];
          finalParams.push(value);
        }else{
          finalParams.push(param);
        }
      })
      
      // ISSUE : it returns a receipt not the value
      // workaround : add events for getters/view functions inside sol contracts

      const typesArray = getParamNames(functionToCall);
      const paramsEncoded = await web3.eth.abi.encodeParameters(typesArray, finalParams);
      const functionEncoded = await web3.eth.abi.encodeFunctionSignature(functionToCall);
      const data = functionEncoded + paramsEncoded;
      const dataFinal = data.replace('0x', '');

      // for each condition we must check that functionToCall(params) is [gt gte lt lte eq neq (operand)] than valueToBeCompared)
      const receipt = await web3.eth.sendTransaction({
        from: myAcc,
        to: contractAddress,
        data: dataFinal
      });
      const eventReceipt = await web3.eth.getTransactionReceipt(receipt);
      // logs contains events emitted by the transaction
      // we assume all vars are indexed in solidity contracts
      const topics = eventReceipt.logs[0].topics;
      const hexString = eventReceipt.logs[0].data;

      // TODO : get inputs ABI 
      const values = web3.eth.abi.decodeLog(inputs, hexString, topics);
      
      // get the first arg which is the value we want
      const res = Object.values(values)[0];

      switch (operand) {
        case gt:
          if(!(res > valueToBeCompared))
            return false;
          break;

        case gte:
          if(!(res >= valueToBeCompared))
            return false;
          break;

        case lte:
          if(!(res <= valueToBeCompared))
            return false;
          break;

        case lt:
          if(!(res < valueToBeCompared))
            return false;
          break;

        case neq:
          if(!(res !== valueToBeCompared))
            return false;
          break;

        case eq:
          if(!(res === valueToBeCompared))
            return false;
          break;

        default:
          break;
      }
    });
    // everything has been checked for potential discrepancies but if we here its all good
    return true;
  }
}