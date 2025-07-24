const { productModel } = require("../models/blogModel");
const { userModel } = require("../models/userModel");

const createBlogController = async (req, res) => {
  const { email, title, desc, banner, content, tags } = req.body;
  console.log(req.body);

  try {
    // Check if all required fields are provided
    if (!title || !content || !tags) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await userModel.findOne({ email });

    console.log(existingUser);
    console.log("Creating blog for user:", existingUser.name);

    // Create new blog post
    const newBlog = new productModel({
      title,
      avatar:
        "https://imgs.search.brave.com/voRxaoQsNb5lgOljgV3xwl6OhsoCufsjwYnuZSNKhVw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi9iL2I2L0lt/YWdlX2NyZWF0ZWRf/d2l0aF9hX21vYmls/ZV9waG9uZS5wbmcv/OTYwcHgtSW1hZ2Vf/Y3JlYXRlZF93aXRo/X2FfbW9iaWxlX3Bo/b25lLnBuZw", // Optional field
      fullname: existingUser.name || "",
      isVerified: false,
      username: existingUser.email || "",
      banner: banner || "",
      desc: desc || "",
      content: content || "",
      tags: Array.isArray(tags) ? tags : [tags], // Ensure tags is an array
    });

    await newBlog.save();
    res
      .status(201)
      .json({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProductController = async (req, res) => {
  try {
    const products = await productModel.find();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  createBlogController,
  getProductController,
};
