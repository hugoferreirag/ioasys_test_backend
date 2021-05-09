const categoriesRouters = require("./categories");
const productsRouters = require("./products");
const userRouters = require("./user");
const adminRouters = require("./admin");
const authRouter = require("./auth");
const express = require("express");
const routers = express.Router();
const authMiddleware = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

routers.use("/login", authRouter);
routers.use("/user", userRouters);
routers.use("/admin", adminRouters);
routers.use("/auth", authRouter);
routers.use("/categories", categoriesRouters);
routers.use("/products", productsRouters);

module.exports = routers;
