const db = require("../models");
const Quest = db.quests;

exports.createQuest = (quest) => {
    return Quest.create({
        id: quest.id,
        onchainId: quest.onchainId,
        address: quest.address,
        title: quest.title,
        description: quest.description,
        thumbnailImageURL: quest.thumbnailImageURL,
        imageURL: quest.imageURL,
        gameId: quest.gameId
    })
      .then((quest) => {
        console.log("[INFO] Created quest");
        return quest;
      })
};

exports.updateQuest = (questId, quest) => {
  Quest.update(quest, {
    where: { id: questId }
  })
    .then(num => {
      return num == 1; // true if successful false is unseccessful
    })
};

exports.updateQuestByOnchainId = (onChainQuestId, quest) => {
  Quest.update(quest, {
    where: { onchainId: onChainQuestId }
  })
    .then(num => {
      return num == 1; // true if successful false is unseccessful
    })
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

exports.findByOnchainId = (onChainQuestId) => {
  return Quest.findOne({ 
    where: { onchainId: onChainQuestId },
    include: ["game", "stateConditions"]
  });
};

exports.delete = (questId) => {
  Quest.destroy({
    where: { id: questId }
  })
    .then(num => {
      if (num == 1) {
        console.log("[INFO] Deleted quest");
      }
    })
};