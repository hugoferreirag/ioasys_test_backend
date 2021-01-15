const filmsRouters = require("./films");
const userRouters = require("./user");
const adminRouters = require("./admin");
const authRouter = require("./auth");
const express = require("express");
const routers = express.Router();
const authMiddleware = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

routers.use("/login", authRouter);
routers.use("/user", authMiddleware, isAdmin, userRouters);
routers.use("/admin", authMiddleware, isAdmin, adminRouters);
routers.use("/auth", authMiddleware, isAdmin, authRouter);
routers.use("/films", authMiddleware, isAdmin, filmsRouters);

module.exports = routers;
