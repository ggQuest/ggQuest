const db = require("../models");
const Quest = db.quests;

exports.createQuest = (gameId, stateConditionId, quest) => {
    return Quest.create({
        address: quest.address,
        title: quest.title,
        description: quest.description,
        thumbnailImageURL: quest.thumbnailImageURL,
        imageURL: quest.imageURL,
        gameId: gameId,
        stateConditionId: stateConditionId
    })
      .then((quest) => {
        console.log(">> Created quest: " + JSON.stringify(quest, null, 4));
        return quest;
      })
      .catch((err) => {
        console.log(">> Error while creating quest: ", err);
      });
};

exports.findAll = () => {
  return Quest.findAll({
    include: ["game"],
  }).then((quests) => {
    return quests;
  });
};

exports.find = (questId) => {
  return Quest.findOne({ where: { id: questId }});
};

exports.findAll = (questId) => {
  return Quest.findOne({ where: { id: questId }});
};