const admin = require("../models/admin");
const bcrypt = require("bcrypt");

const encryptPassword = async (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const adminService = {
  getAll: async (req, res) => {
    const { page = 1, perPage = 10 } = req.body;
    try {
      const count = await admin.countDocuments("admin");
      const countPage = parseInt(page) - 1;
      const limit = parseInt(perPage);
      const skip = limit * countPage - 1 + 1;

      const items = await admin
        .find({ deletedAt: null })
        .skip(skip)
        .limit(limit);

      res.status(200).json({ items, total: count });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  create: async (req, res) => {
    const { email, name } = req.body;
    try {
      if (!email || !name || !req.body.password)
        throw { msg: "Dados inválidos", status: 400 };

      const newAdmin = {
        name,
        email,
        password: await encryptPassword(req.body.password),
      };

      const existsAdmin = await admin.findOne({ email: newAdmin.email });
      if (existsAdmin)
        throw { msg: "Usuário já existe no sistema", status: 400 };

      const data = await admin.create(newAdmin);
      const { password, ...rest } = data._doc;

      res.status(201).json({ data: rest, msg: "Criado com sucesso" });
    } catch (error) {
      if (error.status) res.status(error.status).json(error.msg);
      else res.status(500).json(error);
    }
  },
  delete: async (req, res) => {
    const { id } = req.params;
    try {
      if (!id) throw { msg: "Id não informado", status: 400 };
      const existsAdmin = await admin.findOne({ _id: id });
      if (existsAdmin.deletedAt)
        throw { msg: "Usuário já desativado", status: 400 };
      await admin.updateOne(
        { _id: id },
        { ...existsAdmin._doc, deletedAt: new Date() }
      );
      res.status(200).json({ msg: "Administrador deletado com sucesso" });
    } catch (error) {
      if (error.status) res.status(error.status).json(error.msg);
      else res.status(500).json(error);
    }
  },
  update: async (req, res) => {
    const { name, email, password } = req.body;
    const { id } = req.params;
    try {
      if (!id) throw { msg: "Dados inválidos", status: 400 };

      const existsAdmin = await admin.find({ _id: id });

      if (!existsAdmin.length)
        throw { msg: "Usuário não encontrado", status: 400 };

      const updatedAdmin = {};
      if (!password && !name && !email)
        throw { status: 400, msg: "Nenhum campo enviado para atualização" };
      if (password) updatedAdmin.password = await encryptPassword(password);
      if (name) updatedAdmin.name = name;
      if (email) updatedAdmin.email = email;

      await admin.updateOne({ _id: id }, { ...existsAdmin, ...updatedAdmin });
      res.status(200).json({
        msg: "Administrador atualizado com sucesso",
        keyUpdated: { name, email },
      });
    } catch (error) {
      if (error.status) res.status(error.status).json(error.msg);
      else res.status(500).json(error);
    }
  },
};

module.exports = adminService;
