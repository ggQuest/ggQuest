const db = require("../models");
const Game = db.games;
const Quest = db.quests;

exports.createGame = (game) => {
    return Game.create({
      id: game.id,
      name: game.name,
      description: game.description,
      websiteURL: game.websiteURL,
      thumbnailImageURL: game.thumbnailImageURL,
      imageURL: game.imageURL,
      coverImageURL: game.coverImageURL
    })
      .then((comment) => {
        console.log(">> Created game: " + JSON.stringify(comment, null, 4));
        return game;
      })
      .catch((err) => {
        console.log(">> Error while creating game: ", err);
      });
  };

  exports.updateGame = (gameId, game) => {
    Game.update(game, { where: { id: gameId } });
    return game;
  }

  exports.find = (gameId) => {
    return Game.findOne({ where: { id: gameId }});
  };

  exports.findAll = () => {
    return Game.findAll();
  };