const jwt = require("jsonwebtoken");
const {
  UnauthenticatedError,
  generateUnauthenticatedError,
} = require("./../errors");
const User = require("./../models/User");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw generateUnauthenticatedError("Request Denied !");
  }

  try {
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    /*--> Less: created local user object: only userId & name*/
    // req.user = { userId: payload.userId, name: payload.name };

    /* --> Better: register in "req" a complete Mongoose user object*/
    //             with all possible associations.
    const user = await User.findById(payload.userId).select("-password");
    req.user = user;
    next();
  } catch (error) {
    throw generateUnauthenticatedError("Request Denied !");
  }
};

module.exports = auth;
