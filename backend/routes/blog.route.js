const express = require("express");
const { createBlogController, getProductController } = require("../controllers/blogController");

const productRouter = express.Router();

productRouter.post("/create", createBlogController);
productRouter.get("/get", getProductController);

module.exports = { productRouter };
