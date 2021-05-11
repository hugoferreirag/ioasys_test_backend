const express = require("express");
const routers = express.Router();
const statesService = require("../services/products");
const authMiddleware = require("../middlewares/auth");

routers.post("/list", (req, res) => {
  statesService.getAll(req, res);
});
routers.post("/filter", (req, res) => {
  statesService.filter(req, res);
});
routers.put("/edit/:id", authMiddleware, (req, res) => {
  statesService.update(req, res);
});

routers.post("/create",authMiddleware, (req, res) => {
  statesService.save(req, res);
});
routers.delete("/delete/:id",authMiddleware, (req, res) => {
  statesService.delete(req, res);
});

module.exports = routers;