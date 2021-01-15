const adminRouters = require("../utils/adminRouters");
const admin = require("../models/admin");

module.exports = async (req, res, next) => {
  const { originalUrl } = req;
  if (!adminRouters.includes(originalUrl)) return next();

  const verifyIsAdmin = await admin.findOne({ _id: req.userId });

  if (!verifyIsAdmin)
    return res
      .status(401)
      .json({ msg: "Ação permitida apenas para administradores" });

  return next();
};
