const db = require("../models");
const StateCondition = db.stateCondition;

exports.createStateCondition = (stateCondition) => {  
  return StateCondition.create({
        from: stateCondition.from,
        to: stateCondition.to,
        data: stateCondition.data,
        compareWith: stateCondition.compareWith,
        operator: stateCondition.operator
    })
      .then((stateCondition) => {
        console.log(">> Created condition: " + JSON.stringify(quest, null, 4));
        return stateCondition;
      })
      .catch((err) => {
        console.log(">> Error while creating condition: ", err);
      });
};

exports.findAll = () => {
    return StateCondition.findAll();
  };