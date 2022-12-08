const jwt = require('jsonwebtoken')
const dotenv = require("dotenv").config();

if (!process.env.TOKEN_SECRET) {
  return res.status(500).json({ error: "Token secret not defined" });
}
const tokenSecret = process.env.TOKEN_SECRET

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token.split(" ")[1], tokenSecret);
    return decoded.data;
  } catch (err) {
    return res.status(500).json({ error: "Failed to authenticate token" });
  }
};

exports.verify = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({
      error: "Please provide a API token to use this endpoint.",
    });
  }

  if (!token.startsWith("Bearer ") || token.length <= "Bearer ".length) {
    return res.status(400).json({ error: "Invalid token format" });
  }

  const user = verifyToken(token);
  if (user) {
    req.user = user;
    return next();
  }
};
