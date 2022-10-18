const db = require("../models");
const StateCondition = db.stateConditions;

exports.createStateCondition = (stateCondition) => {  
  return StateCondition.create({
        contract: stateCondition.contract,
        function: stateCondition.function,
        parameters: stateCondition.parameters,
        compareWith: stateCondition.compareWith,
        operator: stateCondition.operator,
        stateConditionId: stateCondition.stateConditionId,
        questId: stateCondition.questId
    })
      .then((stateCondition) => {
        console.log("[INFO] Created condition");
        return stateCondition;
      })
};

exports.updateStateCondition = (stateConditionId, stateCondition) => {
  StateCondition.update(stateCondition, {
    where: { id: stateConditionId }
  })
    .then(num => {
      return num == 1; // true if successful false is unseccessful
    })
};

exports.findByQuest = (questId) => {
  return Quest.findOne({ 
    where: { questId: questId },
    include: ["game", "stateConditions"]
  });
};

exports.find = (stateConditionId) => {
  return Quest.findOne({ 
    where: { id: stateConditionId },
    include: ["game", "stateConditions"]
  });
};

exports.findAll = () => {
    return StateCondition.findAll();
  };