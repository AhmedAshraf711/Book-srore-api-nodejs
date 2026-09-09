const jwt = require("jsonwebtoken");

// Verify Token
function verifyToken(req, res, next) {
  const token = req.headers.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "invalid token" });
    }
  } else {
    res.status(401).json({ message: "no token provided" });
  }
}
//verify token and authorization
function verifyTokenAndAuthorization(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    }
    else{
        return res
        .status(403)
        .json({ message: "You are not allowed to update this user" });
    }
  });
}

//verify token and admin
function verifyTokenAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    }
    else{
        return res
        .status(403)
        .json({ message: "You are not allowed to update this user" });
    }
  });
}
module.exports = {verifyToken , verifyTokenAndAuthorization ,verifyTokenAdmin };
