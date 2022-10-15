// Sync mysql DB
const db = require("./models");
db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

const apiCredentialsController = require("./controller/apiCredentials.controller.js");

function generateKey() {
    return "GGQ-" + Array(12).fill("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');
}

function generatePassword() {
    return Array(25).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz=!_-:").map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');
}

let generatedKey = generateKey()
let generatedPassword = generatePassword()
console.log("KEY : " + generatedKey + " | PASSWORD : " + generatedPassword)
apiCredentialsController.createCredentials(generatedKey, generatedPassword)