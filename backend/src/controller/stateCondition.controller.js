const db = require("../models");
const StateCondition = db.stateCondition;

exports.createStateCondition = (stateCondition, operatorId) => {  
  return StateCondition.create({
        from: stateCondition.from,
        to: stateCondition.to,
        data: stateCondition.data,
        compareWith: stateCondition.compareWith,
        operatorId: operatorId
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
    return StateCondition.findAll({
      include: ["operator"],
    }).then((quests) => {
      return quests;
    });
  };