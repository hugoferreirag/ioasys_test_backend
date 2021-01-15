const user = require("../models/user");
const bcrypt = require("bcrypt");

const encryptPassword = async (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const userService = {
  getAll: async (req, res) => {
    const { page = 1, perPage = 10 } = req.body;
    try {
      const count = await user.countDocuments("user");
      const countPage = page - 1;
      const limit = perPage;
      const skip = limit * countPage - 1 + 1;

      const items = await user
        .find({ deletedAt: null })
        .skip(skip)
        .limit(limit);

      res.status(200).json({ items, total: count });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  create: async (req, res) => {
    const { name, email } = req.body;
    try {
      if (!email || !req.body.password || !name)
        throw { msg: "Dados inválidos", status: 400 };

      const newUser = {
        name,
        email,
        password: await encryptPassword(req.body.password),
      };

      const existsUser = await user.findOne({ email: newUser.email });

      if (existsUser)
        throw { msg: "Usuário já existe no sistema", status: 400 };

      const data = await user.create(newUser);
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
      const existsUser = await user.findOne({ _id: id });
      if (existsUser.deletedAt)
        throw { msg: "Usuário já desativado", status: 400 };
      const data = await user.updateOne(
        { _id: id },
        { ...existsUser._doc, deletedAt: new Date() }
      );
      res.status(200).json({ msg: "Usuário deletado com sucesso" });
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

      const existsUser = await user.find({ _id: id });

      if (!existsUser.length)
        throw { msg: "Usuário não encontrado", status: 400 };

      const updatedUser = {};
      if (!password && !name && !email)
        throw { status: 400, msg: "Nenhum campo enviado para atualização" };
      if (password) updatedUser.password = await encryptPassword(password);
      if (name) updatedUser.name = name;
      if (email) updatedUser.email = email;

      await user.updateOne({ _id: id }, { ...existsUser, ...updatedUser });
      res.status(200).json({
        msg: "Usuário atualizado com sucesso",
        keyUpdated: { name, email },
      });
    } catch (error) {
      if (error.status) res.status(error.status).json(error.msg);
      else res.status(500).json(error);
    }
  },
};

module.exports = userService;
