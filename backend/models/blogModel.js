const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title: {
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
      default: 0,
    },
    likedBy: {
      type: [String], // Array of user IDs who liked this blog
      default: [],
    },
    comments: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    readTime: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const blogModel = mongoose.model("blogs", blogSchema);

module.exports = { blogModel };
