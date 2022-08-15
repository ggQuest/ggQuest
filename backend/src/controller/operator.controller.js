const db = require("../models");
const Operator = db.operator;

exports.createOperator = (operator) => {  
  return Operator.create({
        value: operator.value
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
    return Operator.findAll().then((operator) => {
      return quests;
    });
  };