const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors());

const db = require("./models");
const questsController = require("./controller/quest.controller.js");
const gamesController = require("./controller/game.controller.js");
db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

const port = 8080

app.get('/', (req, res) => {
  res.send('ggQuest API')
})

app.get('/api/quests', async (req, res) => {
  res.status(200).json(await questsController.findAll());
})

app.listen(port, () => {
  console.log(`ggQuest Server now listening on port ${port}`)
})