const users = require("../models/user");
const admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");

const userService = {
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      let user;
      user = await users.findOne({ email: email }).select("+password");

      if (!user)
        user = await admin.findOne({ email: email }).select("+password");
      if (!user) throw { msg: "Usuário não existe", status: 400 };
      if (!bcrypt.compareSync(password, user.password))
        throw { msg: "Senha inválida", status: 400 };
    
      user.password = undefined;

      res.status(200).json({ token: generateToken({ id: user._id }) });
    } catch (error) {
      if (error.status) res.status(error.status).json(error.msg);
      else res.json(error).status(500);
    }
  },
};

const generateToken = (params) =>
  jwt.sign(params, authConfig.secret, {
    expiresIn: 1200000,
  });

module.exports = userService;
