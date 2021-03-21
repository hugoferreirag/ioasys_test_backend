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
const pe =[{_id: '6056d8a74c36800017f363a6', name: 'o peixe perdido', description: 'drama de um peixe que se perde', genre: 'drama', director: 'maria dramatica', rating: [], createdAt: '2021-03-21T05:24:55.536Z', updatedAt: '2021-03-21T05:24:55.536Z', __v: 0}]