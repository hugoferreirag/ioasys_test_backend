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
    genre: {
      type: String,
      required: true,
    },
    actors: [
      {
        name: {
          type: String,
          required: true,
        },
      },
    ],
    director: {
      type: String,
      required: true,
    },
    rating: [
      {
        idUser: {
          type: String,
        },
        vote: {
          type: Number,
        },
      },
    ],
    average: {
      type: Number,
    },
    deletedAt: {
      type: String,
    },
  },
  { timestamps: true }
);
const films = mongoose.model("films", schema);

module.exports = films;
