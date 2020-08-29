const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", () => {
  console.log("connected to database");
});
