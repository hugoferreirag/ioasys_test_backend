const jwt = require("jsonwebtoken");
const notAuthRouters = require("../utils/notAuthRouters");
const authConfig = require("../config/auth.json");

module.exports = (req, res, next) => {
  const { originalUrl } = req;
  if (notAuthRouters.includes(originalUrl)) return next();
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ msg: "Token não informado" });
  const parts = authHeader.split(" ");
  if (parts.length !== 2)
    return res.status(401).json({ msg: "Token inválido" });

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme))
    return res.status(401).json({ msg: "Token mal formatado" });

  jwt.verify(token, authConfig.secret, async (error, decoded) => {
    if (error) return res.status(401).json({ msg: "Token inválido" });
    req.userId = decoded.id;
    return next();
  });
};
