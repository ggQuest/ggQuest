// Mock db
const quests = require('./db/quests.json')
const reputation = require('./db/reputation.json')
const games = require('./db/games.json')

function getQuests() {
    return quests;
}

function getQuestsById(id) {
    const quest = quests.find(quests => quests.id === id)
    return(quest)
}

function getReputationScoresByAddress(request_address) {
    let scores = []
    reputation.forEach(function(game){
        scorePerGame = game.reputation_scores.find(score => score.address == request_address)
        scorePerGame.game_name = game.name
        delete scorePerGame.address
        scores.push(scorePerGame)
    })
    return scores
}
 
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
