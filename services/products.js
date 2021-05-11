const products = require("../models/products");
const methods = require("../methods");

const productsService = {
  save: async (req, res) => {
    const { name, description, image , category, highlights = false} = req.body;
    try {
      if (!name || !description  || !image || !category )
        throw { msg: "Dados inválidos", status: 400 };

      const existsProduct = await products.findOne({ name });

      if (existsProduct) throw { msg: "Produto já existe no sistema", status: 400 };
      const data = await products.create({
        name,
        description,
        category,
        image,
        highlights
      });
      res.status(201).json(data);
    } catch (error) {
      if (error.status) res.status(error.status).json(error.msg);
      else res.status(500).json(error);
    }
  },
  update: async (req, res) => {
    const { name, description, image , category, highlights = false, deletedAt} = req.body;
    const { id } = req.params;
   
    try {
      if (!name || !description  || !image || !category || !id )
        throw { msg: "Dados inválidos", status: 400 };

      const existsProduct = await products.findOne({ _id: id });

      if (!existsProduct) throw { msg: "Produto não existe no sistema", status: 400 };
      delete existsProduct._id;
      console.log(deletedAt);
      const data = await products.updateOne({_id: id},{
       
        name,
        description,
        category,
        image,
        deletedAt,
        highlights
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
    const count =  await products
        .find();
       const totalItems = count.length;
      const countPage = page - 1;
      const limit = perPage;
      const skip = limit * countPage - 1 + 1;

      const items = await products
        .find()
        .skip(skip)
        .limit(limit);
        console.log(perPage)
     console.log(Math.ceil(totalItems / perPage))
      
      res.status(200).json({ items, total: Math.ceil(totalItems / perPage) });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  filter: async (req, res) => {
    const { name,category, id } = req.body;
   
    try {
      if (name) {
        const items = await products.find({
          name: { $regex: new RegExp(name), $options: "i" },
        });
        res.status(200).json({ items });
        return;
      }
      if (category) {
        const items = await products.find({
          category: { $regex: new RegExp(category), $options: "i" },
        });
        res.status(200).json({ items });

        return;
      }
      if (id) {
        const data = await products.findOne({
          _id: id,
        });
        res.status(200).json(data);
        return;
      }

      const data = await products.find();
      res.status(200).json(data);
    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;
    try {
      if (!id) throw { msg: "Id não informado", status: 400 };
      const existsProduct = await products.findOne({ _id: id });
      if (existsProduct.deletedAt) throw { msg: "Produto não existe", status: 400 };
      await products.updateOne(
        { _id: id },
        { ...existsProduct._doc, deletedAt: true }
      );
      res.status(200).json({ msg: "Produto deletado com suceso" });
    } catch (error) {
      if (error.status) res.status(error.status).json(error.msg);
      else res.status(500).json(error);
    }
  },

};

module.exports = productsService;
