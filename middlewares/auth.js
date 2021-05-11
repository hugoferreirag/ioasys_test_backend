const jwt = require("jsonwebtoken");
const notAuthRouters = require("../utils/notAuthRouters");
const authConfig = require("../config/auth.json");
const user = require("../models/user");

module.exports = (req, res, next) => {
  const { originalUrl } = req;
  if (notAuthRouters.includes(originalUrl)) return next();
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ msg: "Token não informado" });
  const parts = authHeader.split(" ");
  console.log(parts.length)
  if (parts.length !== 2)
    return res.status(401).json({ msg: "Token faltando partes" });

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme))
    return res.status(401).json({ msg: "Token mal formatado" });

  jwt.verify(token, authConfig.secret, async (error, decoded) => {
    if (error) return res.status(401).json({ msg: "Token inválido" });
    req.userId = decoded.id;
    const verifyIsAdmin = await user.findOne({ _id: req.userId  });
    if (!verifyIsAdmin) {
      return res
        .status(401)
        .json({ msg: "Ação permitida apenas para administradores" });
    }
    return next();
  });
};
