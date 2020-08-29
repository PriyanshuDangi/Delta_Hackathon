const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      min: 7,
    },
    header: {
      brand: {
        type: String,
      },
      color: {
        type: String,
        default: "#ffffff",
      },
      background: {
        type: String,
        default: "#000000",
      },
    },
    headerLinks: [
      {
        text: {
          type: String,
        },
        link: {
          type: String,
        },
      },
    ],
    pages: [
      {
        page: {
          type: mongoose.SchemaTypes.ObjectId,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;
