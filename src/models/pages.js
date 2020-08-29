const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    link: {
      type: String,
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
    canEdit: [{ type: String }],
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

const Site = mongoose.model("page", siteSchema);

module.exports = Site;
