const jwt = require('jsonwebtoken')
const tokenSecret = "afp:pcvq3rZ=swvwhdwh!pcigyj"

exports.tokenSecret = tokenSecret
exports.verify = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(403).json({
        error: "Please provide a API token to use this endpoint.",
      });
    }
  
    try {
      const decoded = jwt.verify(token.split(" ")[1], tokenSecret);
      req.user = decoded.data;
      return next();
    } catch (err) {
      return res.status(500).json({ error: "Failed to authenticate token" });
    }
  };





  