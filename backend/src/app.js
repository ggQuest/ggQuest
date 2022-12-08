const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const jsonParser = bodyParser.json()

const authMiddleware = require("./middleware.js")

const version = "v0.0.1"

app.use(cors());

const server = require("./ggQuestServer.js");

const port = 8080


/*
 * Status Api Check
*/

app.get('/api/' + version + '/status', async (req, res) => {
  try {
    res.status(200).json({ status: "ggQuest OK" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

/*
 * Authentication
*/

app.post('/api/' + version + '/auth/login', jsonParser, async (req, res) => {
  try {
    token = await server.login(req.body.key, req.body.password)
    res.status(200).json({ token: token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
})

/*
 * Profiles endpoints
*/

// Get all profiles
app.get('/api/' + version + '/profiles', async (req, res) => {
  res.status(200).json(await server.getProfiles());
})
// Get a specific profile
app.get('/api/' + version + '/profiles/:address', async (req, res) => {
  try {
    res.status(200).json(await server.getProfile(req.params.address));
  } catch (error) {
    switch (error.code) {
      case "INVALID_ARGUMENT":
        res.status(400).json({ error: error })
        break;

      default:
        res.status(500).json({ error: error })
        break;
    }
  }
})

/*
 * Quests endpoints
*/

// Get all quests
app.get('/api/' + version + '/quests', async (req, res) => {
  try {
    res.status(200).json(await server.getQuests());
  } catch (error) {
    res.status(500).json({ error: error })
  }

})
// Get a specific quest
app.get('/api/' + version + '/quests/:id', async (req, res) => {
  try {
    if (req.query.onchainId == null || !req.query.onchainId) {
      res.status(200).json(await server.getQuest(req.params.id));
    } else {
      res.status(200).json(await server.getQuestByOnchainId(req.params.id));
    }
  } catch (error) {
    res.status(404).json({ error: error })
  }
})
// Create a quest
app.post('/api/' + version + '/quests', authMiddleware.verify, jsonParser, async (req, res) => {
  try {
    res.status(200).json(await server.createQuest(req.body));
  } catch (error) {
    switch (error.code) {
      case "UNPREDICTABLE_GAS_LIMIT":
        res.status(500).json({ error: "Transaction reverted." })

      default:
        console.log(error)
        res.status(500).json({ error: "An error occured. Check parameters." })
        break;
    }
  }
})
// Modify a quest
app.put('/api/' + version + '/quests/:id', authMiddleware.verify, jsonParser, async (req, res) => {
  try {
    if (req.query.onchainId == null || !req.query.onchainId) {
      res.status(200).json(await server.updateQuest(req.params.id, req.body));
    } else {
      res.status(200).json(await server.updateQuestByOnchainId(req.params.id, req.body));
    }
  } catch (error) {
    switch (error.code) {
      case "UNPREDICTABLE_GAS_LIMIT":
        res.status(500).json({ error: { "reason": "Transaction reverted" } })
        break;

      default:
        res.status(500).json({ error: error })
        break;
    }
  }
})
// Add a reward
app.post('/api/' + version + '/quests/:questId/rewards', authMiddleware.verify, jsonParser, async (req, res) => {
  try {
    let questId;
    if (req.query.onchainId == null || !req.query.onchainId) {
      questId = req.params.questId
    } else {
      let quest = await server.getQuestByOnchainId(req.params.questId)
      questId = quest.onchainId
    }
    res.status(200).json(await server.addReward(questId, req.body));
  } catch (error) {
    switch (error.code) {
      case "UNPREDICTABLE_GAS_LIMIT":
        res.status(500).json({ error: { "reason": "Transaction reverted" } })
        break;

      default:
        res.status(500).json({ error: error })
        break;
    }
  }
})
// Remove a reward (TODO)
app.delete('/api/' + version + '/quests/:questId/rewards', authMiddleware.verify, async (req, res) => {
  res.status(501).json("501 Not implemented");
})
// Get rewards of specific quest (TODO)
app.get('/api/' + version + '/quests/:questId/rewards', async (req, res) => {
  res.status(501).json("501 Not implemented");
})

/*
 * Quests endpoints
*/

// Create a game
app.post('/api/' + version + '/games/', authMiddleware.verify, jsonParser, async (req, res) => {
  try {
    res.status(200).json(await server.createGame(req.body));
  } catch (error) {
    switch (error.code) {
      case "UNPREDICTABLE_GAS_LIMIT":
        res.status(500).json({ error: { "reason": "Transaction reverted" } })
        break;

      default:
        res.status(500).json({ error: error })
        break;
    }
  }
})
// Get all games
app.get('/api/' + version + '/games', async (req, res) => {
  try {
    res.status(200).json(await server.getGames());
  } catch (error) {
    res.status(500).json({ error: error })
  }
})
// Get a specific game
app.get('/api/' + version + '/games/:id', async (req, res) => {
  try {
    res.status(200).json(await server.getGame(req.params.id));
  } catch (error) {
    res.status(404).json({ error: error })
  }
})
// Modify a game
app.put('/api/' + version + '/games/:id', authMiddleware.verify, jsonParser, async (req, res) => {
  try {
    res.status(200).json(await server.updateGame(req.params.id, game));
  } catch (error) {
    // Trata erros
    console.error(error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      // The request was made but no response was received
      // error.request is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      res.status(404).json({ error: error.request });
    } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).json({ error: error.message });
    }
  }
})

/*
 * Player endpoints 
*/

// Create player endpoint
app.post('/api/' + version + '/players', authMiddleware.verify, async (req, res) => {
  try {
    let username = req.body.username;
    let profileData = req.body.profileData;
    let thirdPartyData = req.body.thirdPartyData;
    let createdPlayer = await server.createPlayer(
      username,
      profileData,
      thirdPartyData
    );
    res.send(createdPlayer);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Update player endpoint
app.put('/api/' + version + '/players/:playerId', authMiddleware.verify, async (req, res) => {
  try {
    let playerId = req.params.playerId;
    let username = req.body.username;
    let profileData = req.body.profileData;
    let thirdPartyData = req.body.thirdPartyData;
    let updatedPlayer = await server.updatePlayer(
      playerId,
      username,
      profileData,
      thirdPartyData
    );
    res.send(updatedPlayer);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get player by ID endpoint
app.get('/api/' + version + '/players/:playerId', async (req, res) => {
  try {
    let playerId = req.params.playerId;
    let player = await server.findPlayer(playerId);
    res.send(player);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get all players endpoint
app.get("/players", async (req, res) => {
  try {
    let players = await server.findAllPlayers();
    res.send(players);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/*
 * Server
*/

// TODO : VERIFY IF USER MEETS ALL REQUIREMENTS TO GET REWARD
app.post('/api/' + version + '/quests/:questId/verify', authMiddleware.verify, async (req, res) => {
  res.status(200).json(await server.verifyReward(req.params.questId, req.body));
})

app.listen(port, () => {
  console.log(`ggQuest Server now listening on port ${port}`)
})


