const express = require("express");
const User = require("../models/user");
const checkAuth = require("../auth/checkAuth");
const Page = require("../models/pages");

const router = new express.Router();

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new Error();
    }
    const page = await Page.findOne({ link: "/", owner: user._id });
    res.render("siteviewpage", {
      layout: "siteviewlayout",
      owner: user,
      page,
    });
  } catch (err) {
    res.status(400).send();
    console.log(err);
  }
});

router.get("/:id/:link", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new Error();
    }
    const page = await Page.findOne({ link: req.params.link, owner: user._id });
    if (!page) {
      throw new Error("no page found");
    }
    res.render("siteviewpage", {
      layout: "siteviewlayout",
      owner: user,
      page: page,
    });
  } catch (err) {
    req.flash("error_msg", "unable to find the requested page");
    res.redirect("/yoursite/" + req.params.id);
    console.log(err);
  }
});

module.exports = router;
