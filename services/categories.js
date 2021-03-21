const categories = require("../models/categories");
const methods = require("../methods");

const categoriesService = {
  save: async (req, res) => {
    const { name, description } = req.body;
    try {
      if (!name || !description)
        throw { msg: "Dados inválidos", status: 400 };
      const existsCategory = await categories.findOne({ name });

      if (existsCategory) throw { msg: "Categoria já existe no sistema", status: 400 };
      const data = await categories.create({
        name,
        description,
      });
      res.status(201).json(data);
    } catch (error) {
      if (error.status) res.status(error.status).json(error.msg);
      else res.status(500).json(error);
    }
  },
  getAll: async (req, res) => {
    const { page = 1, perPage = 10 } = req.body;
    try {
      const count = await categories.countDocuments("categories");
      const countPage = page - 1;
      const limit = perPage;
      const skip = limit * countPage - 1 + 1;

      const items = await categories
        .find({ deletedAt: null })
        .skip(skip)
        .limit(limit);

      res.status(200).json({ items, total: count });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  filter: async (req, res) => {
    const { name, director, genre } = req.body;
    try {
      if (name) {
        const data = await categories.find({
          name: { $regex: new RegExp(name), $options: "i" },
        });
        res.status(200).json(data);
        return;
      }
      const data = await categories.find();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      if (!id) throw { msg: "Id não informado", status: 400 };
      const existsCategory = await categories.findOne({ _id: id });
      if (existsCategory.deletedAt) throw { msg: "Categoria não existe", status: 400 };
      await categories.updateOne(
        { _id: id },
        { ...existsCategory._doc, deletedAt: new Date() }
      );
      res.status(200).json({ msg: "Categoria deletado com suceso" });
    } catch (error) {
      if (error.status) res.status(error.status).json(error.msg);
      else res.status(500).json(error);
    }
  },
};

module.exports = categoriesService;
