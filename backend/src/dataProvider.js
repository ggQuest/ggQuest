// Mock db
const quests = require('./db/quests.json')
const reputation = require('./db/reputation.json')
const games = require('./db/games.json')

// Onchain data
const hre = require("hardhat");

const axios = require('axios');

// Off chain for demo
function getQuests() {
    return quests;
}

// On chain DISABLED FOR DEMO 
/*async function getQuests() {

    var metadata_urls = games.map(async game => {
        for (let i = 0; i < game.quests.length; i++) {
            const metadata_url= await getQuestContractMetadataURL(game.quests[i])
            return metadata_url
        }  
    })

    const urls = await Promise.all(metadata_urls)

    var quests_promises = urls.map(url => {
        return axios
        .get(url)
        .then(res => {
            return res.data;
        })
        .catch(error => {
            console.error(error);
        });
    })

    const quests = await Promise.all(quests_promises)
    return quests
}*/

async function getQuestContractMetadataURL(address) {
    let quest = await hre.ethers.getContractAt("Quest", address)
    let metadataURL = await quest.getMetadata()
    return metadataURL
}

// On chain
async function getReputationScoresByAddress(address) {
    const promises = games.map(async game => {
        let reputationContract = await hre.ethers.getContractAt("ReputationSBT", game.reputation_contract)
        return {
            "game_name": game.name,
            "reputation_score": (await reputationContract.getReputationScore(address)).toNumber(),
        }
    })

    const results = await Promise.all(promises)
    console.log(results)
    return results;
}

// Mock-up off chain
function getQuestsById(id) {
    const quest = quests.find(quests => quests.id === id)
    return(quest)
}
/*
function getReputationScoresByAddress(request_address) {
    let scores = []
    reputation.forEach(function(game){
        scorePerGame = game.reputation_scores.find(score => score.address == request_address)
        scorePerGame.game_name = game.name
        scores.push(scorePerGame)
    })
    return scores
}*/
 
// Mock-up off-chain
function getReputationScores() {
    let scores = []

    // Gather all scores per address
    reputation.forEach(function(game) {
        game.reputation_scores.forEach(function(score){
            if(scores[score.address] == undefined) {
                scores[score.address] = []
            }
            scores[score.address].push(score.reputation_score)
        })
    })

    // Sum all scores
    let sum;
    let result = [];
    for (var address in scores){
        if (scores.hasOwnProperty(address)) {
            sum = 0
            for (let i = 0; i < scores[address].length; i++) {
                sum += scores[address][i];
            }
            result.push(
                {
                    "address": address,
                    "score": sum
                }
            )
        }
    }

    return result;
}

module.exports = { getQuests, getQuestsById, getReputationScoresByAddress, getReputationScores };
