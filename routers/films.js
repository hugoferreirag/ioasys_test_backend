const express = require("express");
const routers = express.Router();
const statesService = require("../services/films");

routers.post("/list", (req, res) => {
  statesService.getAll(req, res);
});
routers.post("/filter", (req, res) => {
  statesService.filter(req, res);
});
routers.put("/vote/:id", (req, res) => {
  statesService.vote(req, res);
});

routers.post("/create", (req, res) => {
  statesService.save(req, res);
});
routers.delete("/delete/:id", (req, res) => {
  statesService.delete(req, res);
});

module.exports = routers;
