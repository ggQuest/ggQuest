const db = require("../models");
const Quest = db.quests;

exports.createQuest = (quest) => {
    return Quest.create({
        title: quest.title,
        description: quest.description,
        thumbnailImageURL: quest.thumbnailImageURL,
        imageURL: quest.imageURL,
        gameId: quest.gameId
    })
      .then((quest) => {
        console.log(">> Created quest: " + JSON.stringify(quest, null, 4));
        return quest;
      })
      .catch((err) => {
        console.log(">> Error while creating quest: ", err);
      });
};

exports.updateQuest = (questId, quest) => {
  Quest.update(quest, {
    where: { id: questId }
  })
    .then(num => {
      return num == 1; // true if successful false is unseccessful
    })
    .catch(err => {
      console.log("Error updating Quest with id=" + id);
      return false;
    });
};

exports.findAll = () => {
  return Quest.findAll({
    include: ["game", "stateConditions"]
  }).then((quests) => {
    return quests;
  });
};

exports.find = (questId) => {
  return Quest.findOne({ 
    where: { id: questId },
    include: ["game", "stateConditions"]
  });
};