const db = require("../models");
const StateCondition = db.stateConditions;

exports.createStateCondition = (stateCondition) => {  
  return StateCondition.create({
        contract: stateCondition.contract,
        function: stateCondition.function,
        parameters: stateCondition.parameters,
        compareWith: stateCondition.compareWith,
        operator: stateCondition.operator,
        questId: stateCondition.questId
    })
      .then((stateCondition) => {
        console.log(">> Created condition: " + JSON.stringify(stateCondition, null, 4));
        return stateCondition;
      })
      .catch((err) => {
        console.log(">> Error while creating condition: ", err);
      });
};

exports.findAll = () => {
    return StateCondition.findAll();
  };