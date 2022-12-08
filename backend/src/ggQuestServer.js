const hre = require("hardhat");
const db = require("./models");
const fs = require('fs');
const { json } = require("body-parser");

// JWT stuff
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const authMiddleware = require("./middleware.js")
const tokenSecret = authMiddleware.tokenSecret

// Controllers imports
const apiCredentialsController = require("./controller/apiCredentials.controller.js");
const questsController = require("./controller/quest.controller.js");
const playersController = require("./controller/player.controller.js");
const gamesController = require("./controller/game.controller.js");
const stateConditionController = require("./controller/stateCondition.controller.js");

// Sync mysql DB
db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// Get contracts addresses from addresses json file
let rawdata = fs.readFileSync("./addresses.json");
var addresses = JSON.parse(rawdata);

// Function to parse parameters names from a string like 'testFunction(arg1,arg2)' => ['arg1', 'arg2']
var ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(fnStr) {
  var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if (result === null)
    result = [];
  return result;
}

// Function to generate JWT token for API auth
function generateToken(credentials) {
  return jwt.sign({ data: credentials }, tokenSecret, { expiresIn: '24h' })
}


// Helper functions

async function createPlayerOffChain(username, profileData, thirdPartyData) {
  return await server .createPlayer({
    username: username,
    profilePictureURL: profileData.profilePictureURL,
    coverPictureURL: profileData.coverPictureURL,
  }, thirdPartyData);
}

async function getPlayerAddressOnChain(username) {
  const ggProfilesContract = await hre.ethers.getContractFactory("ggProfiles");
  const ggProfiles = ggProfilesContract.attach(addresses.ggProfiles);
  return await ggProfiles.getPlayerAddress(username);
}

function updatePlayerOffChain(playerId, data) {
  playersController.updatePlayer(playerId, data);
}

module.exports = {
  /*
   * API auth (JWT)
  */
  login: async function (key, password) {
    let credentials = await apiCredentialsController.find(key);
    if (credentials.password == undefined) throw Error('Invalid key or password');
    const validPassword = await bcrypt.compare(password, credentials.password);
    if (!validPassword) throw Error('Invalid key or password')
    else return generateToken(credentials)
  },

  /*
   * QuestID functions
  */
  getProfile: async function (address) {
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
  getProfiles: async function () {
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

  /*
   * Games functions
  */
  createGame: async function (game) {
    const ggQuestsContract = await hre.ethers.getContractFactory("ggQuests");
    const ggQuests = ggQuestsContract.attach(addresses.ggQuests);
    let addGameTx = await ggQuests.addGame(game.name);
    await hre.ethers.provider.waitForTransaction(addGameTx.hash);
    let games = await ggQuests.getGames();
    game.id = games.findIndex(gameName => gameName === game.name);
    return gamesController.createGame(game);
  },
  updateGame: async function (gameId, game) {
    return gamesController.updateGame(gameId, game);
  },
  getGame: async function (gameId) {
    return gamesController.find(gameId);
  },
  getGames: async function () {
    return gamesController.findAll();
  },

  /*
   * Quests functions
  */
  createQuest: async function (quest) {
    // Create quest offchain
    let parsedQuest = {
      address: null,
      onchainId: null,
      title: quest.title,
      description: quest.description,
      thumbnailImageURL: quest.thumbnailImageURL,
      imageURL: quest.imageURL,
      gameId: quest.gameId
    }
    await questsController.createQuest(parsedQuest)
      .then(async (createdQuest) => {
        // Create the state conditions
        quest.stateConditions.forEach(stateCondition => {
          stateCondition.questId = createdQuest.id;
          stateConditionController.createStateCondition(stateCondition);
        });

        // Create quest on chain
        console.log("[INFO] Sending createQuest transaction...")
        const ggQuestsContract = await hre.ethers.getContractFactory("ggQuests");
        const ggQuests = ggQuestsContract.attach(addresses.ggQuests);
        try {
          let questCreateTx = await ggQuests.createQuest(quest.reputationReward, quest.gameId);
          await hre.ethers.provider.waitForTransaction(questCreateTx.hash);
        } catch (error) {
          // If transaction fails, delete created offchain quest and throw error
          console.log(error)
          questsController.delete(createdQuest.id)
          throw Error("Transaction reverted. Check parameters.")
        }
        console.log("[INFO] CreateQuest transaction completed")

        // Update quest address with onchain data (quest address and quest onchain ID)
        let questOnchainId = (await ggQuests.getQuests()).length - 1;
        let questAddress = await ggQuests.getQuestAddress(questOnchainId);
        questsController.updateQuest(createdQuest.id,
          {
            address: questAddress,
            onchainId: questOnchainId
          });

        // Add the stateConditions and address to the response
        return questsController.find(createdQuest.id);
      })

  },

  /*
   * Player Functions version 0.0.2
   */

  updatePlayer: async function (playerId, username, profileData, thirdPartyData) {
    // Update player offchain
    try {
      let updatedPlayer = await playersController.updatePlayer(playerId, {
        username: username,
        profilePictureURL: profileData.profilePictureURL,
        coverPictureURL: profileData.coverPictureURL,
      }, thirdPartyData);

      // Update player on chain
      console.log("[INFO] Sending updatePlayer transaction...");
      const ggProfilesContract = await hre.ethers.getContractFactory("ggProfiles");
      const ggProfiles = ggProfilesContract.attach(addresses.ggProfiles);
      let updatableByUserData = {
        pseudo: profileData.pseudo,
        profilePictureURL: profileData.profilePictureURL,
        coverPictureURL: profileData.coverPictureURL,
      };
      await ggProfiles.update(updatableByUserData);
      console.log("[INFO] UpdatePlayer transaction completed");

      // Add the address to the response
      return playersController.findPlayer(updatedPlayer.id);
    } catch (error) {
      // If an error occurs, throw it
      throw error;
    }

  },


  createPlayer: async function (username, profileData, thirdPartyData) {
    try {
      // Create player off-chain
      let createdPlayer = await createPlayerOffChain(username, profileData, thirdPartyData);
  
      // Check if player already exists on-chain
      let playerAddress = await getPlayerAddressOnChain(username);
      if (playerAddress) {
        // If player already exists, update player off-chain data and return player
        updatePlayerOffChain(createdPlayer.id, {
          address: playerAddress,
          pseudo: profileData.pseudo,
          profilePictureURL: profileData.profilePictureURL,
          coverPictureURL: profileData.coverPictureURL,
        });
        return playersController.findPlayer(createdPlayer.id);
      }
  
      // Create player on-chain
      try {
        let playerCreateTx = await ggProfiles.createPlayer(username);
        await hre.ethers.provider.waitForTransaction(playerCreateTx.hash);
      } catch (error) {
        // If transaction fails, delete created off-chain player and throw error
        console.log(error);
        playersController.deletePlayer(createdPlayer.id);
        throw Error("Transaction reverted. Check parameters.");
      }
      console.log("[INFO] CreatePlayer transaction completed");
  
      // Update player with on-chain address and user data
      playerAddress = await ggProfiles.getPlayerAddress(username);
      let updatableByUserData = {
        pseudo: profileData.pseudo,
        profilePictureURL: profileData.profilePictureURL,
        coverPictureURL: profileData.coverPictureURL,
      };
      await ggProfiles.mint(updatableByUserData);
      playersController.updatePlayer(createdPlayer.id, {
        address: playerAddress,
        pseudo: profileData.pseudo,
        profilePictureURL: profileData.profilePictureURL,
        coverPictureURL: profileData.coverPictureURL,
      });
  
      // Add the address to the response
      return playersController.findPlayer(createdPlayer.id);
    } catch (error) {
      // If an error occurs, throw it
      throw error;
    }
  },
  
  
  updateQuest: async function (questId, quest) {
    let dbQuest = questsController.find(questId)
    if (quest.gameId != null && quest.gameId != dbQuest.gameId) {
      throw 'Game ID cannot be changed.'
    }
    quest.stateConditions.forEach(stateCondition => {
      stateConditionController.updateStateCondition(stateCondition.id, stateCondition);
    });
    let updatedQuest = questsController.updateQuest(questId, quest);
    return updatedQuest;
  },

  updateQuestByOnchainId: async function (questId, quest) {
    let dbQuest = await questsController.findByOnchainId(questId)
    if (quest.gameId != null && quest.gameId != dbQuest.gameId) {
      throw 'Game ID cannot be changed.'
    }
    quest.stateConditions.forEach(stateCondition => {
      stateConditionController.updateStateCondition(stateCondition.id, stateCondition);
    });
    let updatedQuest = questsController.updateQuestByOnchainId(questId, quest);
    return updatedQuest;
  },

  getQuests: async function () {
    return questsController.findAll();
  },

  getQuest: async function (questId) {
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

  getQuestByOnchainId: async function (questId) {
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

  /*
   * Quests rewards and validation functions
  */
  addReward: async function (questOnchainId, reward) {
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
  verifyReward: async function (questId, userParams) {
    // Fetch all requirements that must be met for quest id
    // Check for each of them if userAddress pass the requirement
    // get all conditions stored off chain

    const filteredCond = await stateConditionController.findByQuest(questId);

    filteredCond.forEach(async (condition) => {

      const contractAddress = condition.questId;
      const functionToCall = condition.function;
      const params = condition.parameters;
      const valueToBeCompared = condition.compareWith;
      const operand = condition.operator;

      // replace $arg$ by arg provided in body of api call
      const finalParams = [];
      params.forEach((param) => {
        if (param.substring(0, 1) === '$') {
          // remove last and first chars
          const prop = param.substring(1, param.length - 1);
          // we pull the right param from user params input
          const value = userParams[prop];
          finalParams.push(value);
        } else {
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
      let result = await hre.ethers.provider.call({
        to: contractAddress,
        data: dataFinal
      });

      switch (operand) {
        case gt:
          if (!(result > valueToBeCompared))
            return false;
          break;

        case gte:
          if (!(result >= valueToBeCompared))
            return false;
          break;

        case lte:
          if (!(result <= valueToBeCompared))
            return false;
          break;

        case lt:
          if (!(result < valueToBeCompared))
            return false;
          break;

        case neq:
          if (!(result !== valueToBeCompared))
            return false;
          break;

        case eq:
          if (!(result === valueToBeCompared))
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