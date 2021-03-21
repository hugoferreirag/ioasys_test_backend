const mongoose = require("mongoose");
require("../config/mongodb");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    deletedAt: {
      type: String,
    },
  },
  { timestamps: true }
);
const categories = mongoose.model("categories", schema);

module.exports = categories;
