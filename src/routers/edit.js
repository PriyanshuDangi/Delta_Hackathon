const express = require("express");
const User = require("../models/user");
const checkAuth = require("../auth/checkAuth");
const Page = require("../models/pages");
const router = require("./user");

// for seeing the edit list
router.get("/editList/:pid", checkAuth, async (req, res) => {
  try {
    const page = await Page.findOne({
      _id: req.params.pid,
      owner: req.user._id,
    });
    if (!page) {
      throw new Error();
    }
    res.render("editlist", {
      page,
    });
  } catch (err) {
    req.flash("error_msg", "Unable to get the requested page");
    res.redirect("/dashboard");
    console.log(err);
  }
});

//for  adding mail to the list
router.post("/addEditList/:pid", checkAuth, async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) {
      throw new Error();
    }
    const page = await Page.findOne({
      _id: req.params.pid,
      owner: req.user._id,
    });
    if (!page) {
      throw new Error();
    }
    page.canEdit.push(email);
    await page.save();
    res.redirect("/editList/" + req.params.pid);
  } catch (err) {
    req.flash("error_msg", "Unable to add");
    res.redirect("/dashboard");
    console.log(err);
  }
});

module.exports = router;
