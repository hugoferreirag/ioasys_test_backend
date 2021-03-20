const express = require("express");
const routers = express.Router();
const authService = require("../services/auth");

routers.post("/", (req, res) => {
  console.log('aki')

  authService.login(req, res);
});

module.exports = routers;
