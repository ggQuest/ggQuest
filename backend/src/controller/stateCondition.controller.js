const db = require("../models");
const StateCondition = db.stateConditions;

exports.createStateCondition = (stateCondition) => {  
  return StateCondition.create({
        contract: stateCondition.contract,
        function: stateCondition.function,
        parameters: stateCondition.parameters,
        compareWith: stateCondition.compareWith,
        operator: stateCondition.operator,
        stateConditionId: stateCondition.stateConditionId
    })
      .then((stateCondition) => {
        console.log(">> Created condition: " + JSON.stringify(stateCondition, null, 4));
        return stateCondition;
      })
      .catch((err) => {
        console.log(">> Error while creating condition: ", err);
      });
};

exports.updateStateCondition = (stateConditionId, stateCondition) => {
  StateCondition.update(stateCondition, {
    where: { id: stateConditionId }
  })
    .then(num => {
      return num == 1; // true if successful false is unseccessful
    })
    .catch(err => {
      console.log("Error updating stateCondition with id=" + id);
      return false;
    });
};

exports.findAll = () => {
    return StateCondition.findAll();
  };