const express = require("express");
const User = require("../models/user");
const checkAuth = require("../auth/checkAuth");
const Page = require("../models/pages");

const router = new express.Router();

router.get("/editHeader", checkAuth, async (req, res) => {
  res.render("editHeader", {
    header: req.user.header,
    links: req.user.headerLinks,
  });
});

router.post("/editHeader", checkAuth, async (req, res) => {
  try {
    console.log(req.body);
    let header = {
      brand: req.body.headerBrand,
      color: req.body.color,
      background: req.body.background,
    };
    req.user.header = header;
    let pages = [
      { text: req.body.text1, link: req.body.link1 },
      { text: req.body.text2, link: req.body.link2 },
      { text: req.body.text3, link: req.body.link3 },
    ];
    if (req.body.text4) {
      pages.push({ text: req.body.text4, link: req.body.link4 });
      if (req.body.text5) {
        pages.push({ text: req.body.text5, link: req.body.link5 });
      }
    }
    req.user.headerLinks = pages;
    await req.user.save();
    console.log(req.user);
    req.flash("success_msg", "your changes are saved");
    res.redirect("/dashboard");
  } catch (err) {
    req.flash("error_msg", "Unable to edit header");
    res.redirect("/dashboard");
    console.log(err);
  }
});

router.get("/addPage", checkAuth, async (req, res) => {
  try {
    const page = new Page({ owner: req.user._id });
    await page.save();
    res.render("editPage", {
      pageId: page._id,
      page,
    });
    console.log(page);
  } catch (err) {
    req.flash("error_msg", "Unable to get the requested page");
    res.redirect("/dashboard");
    console.log(err);
  }
});

router.get("/editPage/:pid", checkAuth, async (req, res) => {
  try {
    const page = await Page.findOne({
      _id: req.params.pid,
    });
    if (!page) {
      throw new Error();
    }
    if (String(page.owner) !== String(req.user._id)) {
      if (page.canEdit.indexOf(req.user.email) === -1) {
        throw new Error();
      }
    }
    res.render("editPage", {
      pageId: page._id,
      page,
    });
  } catch (err) {
    req.flash("error_msg", "Unable to get the requested page");
    res.redirect("/dashboard");
    console.log(err);
  }
});

router.post("/editPage/:pid", checkAuth, async (req, res) => {
  try {
    let page = await Page.findOne({
      _id: req.params.pid,
    });
    if (!page) {
      throw new Error();
    }
    if (String(page.owner) !== String(req.user._id)) {
      if (page.canEdit.indexOf(req.user.email) === -1) {
        throw new Error();
      }
    }
    page.title = req.body.title;
    page.link = req.body.link;
    page.content = req.body.content;
    // res.render("editPage", {
    //   pageId: page._id,
    // });
    await page.save();
    res.status(200).send();
  } catch (err) {
    req.flash("error_msg", "Unable to get the requested page");
    res.redirect("/dashboard");
    console.log(err);
  }
});

router.get("/deletePage/:pid", checkAuth, async (req, res) => {
  try {
    let page = await Page.findOne({
      _id: req.params.pid,
      owner: req.user._id,
    });
    if (!page) {
      throw new Error();
    }
    if (page.link == "/") {
      req.flash("error_msg", "Cannot remove home page");
      return res.redirect("/pages");
    }
    await page.remove();
    req.flash("success_msg", "Page deleted");
    res.redirect("/pages");
  } catch (err) {
    req.flash("error_msg", "Unable to get the requested page");
    res.redirect("/pages");
    console.log(err);
  }
});

router.get("/header", checkAuth, async (req, res) => {
  try {
    res.render("myheader", {
      owner: req.user,
    });
  } catch (err) {
    req.flash("error_msg", "Unable to get the requested page");
    res.redirect("/dashboard");
    console.log(err);
  }
});

module.exports = router;
