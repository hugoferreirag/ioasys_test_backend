const mongoose = require("mongoose");
require("../config/mongodb");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true,
    },
    deletedAt: {
      type: Boolean,
    },
    highlights: {
      type: Boolean,
    }
  },
  { timestamps: true }
);
const products = mongoose.model("products", schema);

module.exports = products;
