const mongoose = require("mongoose");
require("../config/mongodb");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);
const admin = mongoose.model("admin", schema);

module.exports = admin;
