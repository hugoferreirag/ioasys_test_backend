const express = require("express");
const routers = express.Router();
const adminServices = require("../services/admin");

routers.post("/list", (req, res) => {
  adminServices.getAll(req, res);
});
routers.post("/create", (req, res) => {
  adminServices.create(req, res);
});
routers.put("/update/:id", (req, res) => {
  adminServices.update(req, res);
});
routers.delete("/delete/:id", (req, res) => {
  adminServices.delete(req, res);
});

module.exports = routers;
