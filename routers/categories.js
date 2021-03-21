const express = require("express");
const routers = express.Router();
const categoriesService = require("../services/categories");

routers.post("/list", (req, res) => {
  categoriesService.getAll(req, res);
});
routers.post("/filter", (req, res) => {
  categoriesService.filter(req, res);
});

routers.post("/create", (req, res) => {
  categoriesService.save(req, res);
});

routers.delete("/delete/:id", (req, res) => {
  categoriesService.delete(req, res);
});

module.exports = routers;