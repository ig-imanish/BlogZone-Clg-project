const express = require("express");
const {
  createBlogController,
  getProductController,
  getBlogByIdController,
  toggleBookmarkController,
  getBookmarkedBlogsController,
  toggleLikeController,
  deleteBlogController,
} = require("../controllers/blogController");

const productRouter = express.Router();

productRouter.post("/create", createBlogController);
productRouter.get("/get", getProductController);
productRouter.get("/get/:id", getBlogByIdController);
productRouter.post("/bookmark", toggleBookmarkController);
productRouter.get("/bookmarks/:email", getBookmarkedBlogsController);
productRouter.post("/like", toggleLikeController);
productRouter.delete("/delete/:id", deleteBlogController);

module.exports = { productRouter };
