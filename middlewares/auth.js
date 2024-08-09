const User = require("../models/User");
let auth = (req, res, next) => {
  // Extract the token from the request headers
  let token = req.headers.authorization;

  // Check if the token is provided
  if (!token) {
    return res.status(401).json({
      error: true,
      message: "Unauthorized: Token not provided",
    });
  }

  token = token.replace("Bearer ", "");

  User.findByToken(token, (err, user) => {
    if (err) {
      return res.status(401).json({
        error: true,
        message: `Unauthorized: ${err}`,
      });
    }
    if (!user) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized: Invalid token",
      });
    }
    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
