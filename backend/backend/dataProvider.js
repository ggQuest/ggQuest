// Mock db
const quests = require('./db/quests.json')
const reputation = require('./db/quests.json')
const games = require('./db/games.json')

function getQuests() {
    return quests;
}

function getQuestsById(id) {
    const quest = quests.find(quests => quests.id === id)
    return(quest)
}

function getReputationScores(address) {
    const id = parseInt(req.params.id)
    const parking = parkings.find(parking => parking.id === id)
    res.status(200).json(parking)
}
/*
function getReputationScores() {
    const id = parseInt(req.params.id)
    const parking = parkings.find(parking => parking.id === id)
    res.status(200).json(parking)
}*/

module.exports = { getQuests, getQuestsById };
