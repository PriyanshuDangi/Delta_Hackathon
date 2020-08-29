const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema(
  {
    link: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
      default: "Welcome",
    },
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "user",
    },
    collab: [
      {
        type: mongoose.SchemaTypes.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// userSchema.pre("save", async function (next) {
//   const user = this;
//   if (user.isModified("password")) {
//     user.password = await bcrypt.hash(user.password, 8);
//   }
//   next();
// });

const Site = mongoose.model("site", siteSchema);

module.exports = Site;
