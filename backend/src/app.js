const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })
 
const version = "v1"

app.use(cors());

const server = require("./ggQuestServer.js");

const port = 8080

app.get('/api/' + version + '/profiles', async (req, res) => {
  res.status(200).json(await server.getProfiles());
})

app.get('/api/' + version + '/profiles/:address', async (req, res) => {
  res.status(200).json(await server.getProfile(req.params.address));
})

app.get('/api/' + version + '/quests', async (req, res) => {
  res.status(200).json(await server.getQuests());
})

app.post('/api/' + version + '/games/', jsonParser, async (req, res) => {
  res.status(200).json(await server.createGame(req.body));
})

app.get('/api/' + version + '/games', async (req, res) => {
  res.status(200).json(await server.getGames());
})

app.get('/api/' + version + '/games/:id', async (req, res) => {
  res.status(200).json(await server.getGame(req.params.id));
})

app.put('/api/' + version + '/games/:id', jsonParser, async (req, res) => {
  res.status(200).json(await server.updateGame(req.params.id, game));
})

app.post('/api/' + version + '/quests/', jsonParser, async (req, res) => {
  res.status(200).json(await server.createQuest(req.body));
})

app.get('/api/' + version + '/quests', async (req, res) => {
  res.status(200).json(await server.getQuests());
})

app.get('/api/' + version + '/quests/:id', async (req, res) => {
  res.status(200).json(await server.getQuest(req.params.id));
})

app.put('/api/' + version + '/quests/:id', jsonParser, async (req, res) => {
  res.status(200).json(await server.updateQuest(req.params.id, req.body));
})

app.post('/api/' + version + '/quests/:questId/rewards', async (req, res) => {
  res.status(200).json(await server.addRewardToQuest(req.params.questId, req.body));
})

// TODO : VERIFY IF USER METS ALL REQUIREMENTS TO GET REWARD
app.post('/api/' + version + '/quests/:questId/verify', async (req, res) => {
  res.status(200).json(await server.verifyReward(req.params.questId, req.body));
})

app.listen(port, () => {
  console.log(`ggQuest Server now listening on port ${port}`)
})