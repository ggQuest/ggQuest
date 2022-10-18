const db = require("../models");
const bcrypt = require('bcrypt')
const ApiCredentials = db.apiCredentials;

exports.createCredentials = (key, password) => {
  bcrypt.hash(password, 10, (error, hash) => {
    if (error) {throw error}
    else {
      return ApiCredentials.create({
        key: key,
        password: hash,
        active: 1
      })
      .then((creds) => {
        console.log("[INFO] Credentials created.");
      })
    }
  })
};

exports.deactivateCredentials = (key) => {
  ApiCredentials.update({ active: 0 }, {
    where: { key: key }
  })
    .then(num => {
      return num == 1; // true if successful false is unseccessful
    })
};

exports.find = (key) => {
  return ApiCredentials.findOne({ where: { key: key }});
};