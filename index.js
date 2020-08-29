const express = require("express");
const path = require("path");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const ejs = require("ejs");
const expressLayouts = require("express-ejs-layouts");

//connecting to database
require("./src/db/mongoose");

//initialize passport
const initialize = require("./src/auth/passport");
initialize(passport);

const app = express();

//setting view engine
app.set("layout", "layout");
app.use(expressLayouts);
app.set("view engine", "ejs");

//public static folder
app.use(express.static(path.join(__dirname, "./public")));

//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(flash());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

//passport middlewares
app.use(passport.initialize());
app.use(passport.session());

//declaring global variables for flash
app.use((req, res, next) => {
  res.locals.error_msg = req.flash("error_msg");
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error = req.flash("error");
  next();
});

//routers
app.use(require("./src/routers/user"));
app.use(require("./src/routers/site"));
app.use(require("./src/routers/edit"));
app.use("/yoursite", require("./src/routers/yoursite"));

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("App is up on port " + PORT);
});
