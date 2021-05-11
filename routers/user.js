const express = require("express");
const routers = express.Router();
const userServices = require("../services/user");


routers.post("/create", (req, res) => {
  userServices.create(req, res);
});

module.exports = routers;
