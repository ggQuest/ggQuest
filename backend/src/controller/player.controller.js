const db = require('../models');
const Player = db.player;
const ThirdParty = db.thirdParty;

exports.createPlayer = (playerData, thirdPartyData) => {
  return Player.create(playerData)
    .then((player) => {
      if (thirdPartyData && thirdPartyData.length > 0) {
        thirdPartyData = thirdPartyData.map((data) => ({
          ...data,
          userId: player.id,
        }));
        return ThirdParty.bulkCreate(thirdPartyData)
          .then(() => player);
      }
      return player;
    })
    .then((player) => {
      console.log('[INFO] Created player');
      return player;
    });
};

exports.updatePlayer = (playerId, playerData, thirdPartyData) => {
  return Player.update(playerData, {
    where: {
      id: playerId,
    },
  })
    .then(([updated]) => {
      if (updated && thirdPartyData && thirdPartyData.length > 0) {
        return ThirdParty.destroy({
          where: {
            userId: playerId,
          },
        })
          .then(() => {
            thirdPartyData = thirdPartyData.map((data) => ({
              ...data,
              userId: playerId,
            }));
            return ThirdParty.bulkCreate(thirdPartyData);
          });
      }
      return updated;
    })
    .then((updated) => {
      console.log('[INFO] Updated player');
      return updated;
    });
};

exports.findPlayer = (playerId) => {
  return Player.findOne({
    where: {
      id: playerId,
    },
    include: [{
      model: ThirdParty,
      as: 'linkedThirdParties',
    }],
  });
};

exports.findAllPlayers = () => {
  return Player.findAll({
    include: [{
      model: ThirdParty,
      as: 'linkedThirdParties',
    }],
  });
};