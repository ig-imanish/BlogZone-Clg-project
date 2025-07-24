const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },

    banner: {
      type: String,
      required: true,
    },

    desc: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
    likes: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model("blogs", productSchema);

module.exports = { productModel };
