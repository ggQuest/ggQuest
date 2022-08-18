const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const jsonParser = bodyParser.json()
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(cors());

const server = require("./ggQuestServer.js");

const port = 8080

app.get('/api/profiles', async (req, res) => {
  res.status(200).json(await server.getProfiles());
})

app.get('/api/profiles/:address', async (req, res) => {
  res.status(200).json(await server.getProfile(req.params.address));
})

/*
app.post('/api/profiles/create', async (req, res) => {
  res.status(200).json("yeet");
})

app.get('/api/quests', async (req, res) => {
  res.status(200).json(await questsController.findAll());
})*/

app.post('/api/games/create', jsonParser, async (req, res) => {
  res.status(200).json(await server.createGame(req.body));
})

app.get('/api/games', async (req, res) => {
  res.status(200).json(await server.getGames());
})

app.get('/api/games/:id', async (req, res) => {
  res.status(200).json(await server.getGame(req.params.id));
})

app.listen(port, () => {
  console.log(`ggQuest Server now listening on port ${port}`)
})