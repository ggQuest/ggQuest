const jwt = require('jsonwebtoken')
const dotenv = require("dotenv")
dotenv.config(); 

console.log(process.env.TOKEN_SECRET)

if (!process.env.TOKEN_SECRET) {
  return res.status(500).json({ error: "Token secret not defined" });
}
const tokenSecret = process.env.TOKEN_SECRET;


exports.verify = (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({ error: "Please provide a API token to use this endpoint." });
  }

  try {
    const decodedToken = jwt.verify(token.split(" ")[1], tokenSecret);
    req.user = decodedToken.data;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }
    return res.status(500).json({ error: error.message });
  }
}
