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
    price: {
      type: Number,
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
const products = mongoose.model("products", schema);

module.exports = products;
