const express = require("express");
const routers = express.Router();
const userServices = require("../services/user");

routers.post("/list", (req, res) => {
  userServices.getAll(req, res);
});
routers.post("/create", (req, res) => {
  userServices.create(req, res);
});
routers.put("/update/:id", (req, res) => {
  userServices.update(req, res);
});
routers.delete("/delete/:id", (req, res) => {
  userServices.delete(req, res);
});
module.exports = routers;
