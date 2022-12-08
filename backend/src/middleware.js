const jwt = require('jsonwebtoken')
const dotenv = require("dotenv").config();

if (!process.env.TOKEN_SECRET) {
  return res.status(500).json({ error: "Token secret not defined" });
}
const tokenSecret = process.env.TOKEN_SECRET

exports.verify = (req, res, next) => {
  const token = req.headers.authorization
  if (!token) res.status(403).json({error: "Please provide a API token to use this endpoint."})
  else {
      jwt.verify(token.split(" ")[1], tokenSecret, (err, value) => {
          if (err) res.status(500).json({error: 'Failed to authenticate token'})
          req.user = value.data
          next()
      })
  }
}