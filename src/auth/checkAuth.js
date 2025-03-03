const passport = require("passport");
const User = require("../models/user");

const checkAuth = async (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.myself = req.user;
    return next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect("/login");
};

module.exports = checkAuth;
