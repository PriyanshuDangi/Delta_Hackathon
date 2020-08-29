const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const checkAuth = require("../auth/checkAuth");

const router = new express.Router();

router.get("/", (req, res) => {
  res.redirect("/login");
});

router.get("/signup", (req, res) => {
  res.render("signup", { layout: "withoutLayout" });
});

router.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    req.flash("success_msg", "you are now registered and can login");
    res.redirect("/login");
  } catch (err) {
    console.log(err);
    if (err.keyValue.email) {
      req.flash("error_msg", "Email is already in use");
    } else if (err.keyValue.name) {
      req.flash("error_msg", "Name is already in use");
    } else {
      req.flash("error_msg", "Sorry! Unable to register");
    }
    res.redirect("/signup");
  }
});

router.get("/login", (req, res) => {
  res.render("login", { layout: "withoutLayout" });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    res.redirect(req.session.returnTo || "/dashboard");
    delete req.session.returnTo;
  }
);

router.get("/dashboard", checkAuth, async (req, res) => {
  res.render("dashboard");
});

router.get("/logout", checkAuth, async (req, res) => {
  try {
    delete req.session.returnTo;
    req.logout();
    res.redirect("/login");
  } catch (err) {
    req.flash("error_msg", "Unable to logout");
    res.redirect("/dashboard");
  }
});

module.exports = router;
