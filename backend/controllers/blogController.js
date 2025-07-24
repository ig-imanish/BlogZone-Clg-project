const { blogModel } = require("../models/blogModel");
const { userModel } = require("../models/userModel");

// Utility function to drop old avatar index and any problematic indexes
const dropOldAvatarIndex = async () => {
  try {
    const indexes = await blogModel.collection.listIndexes().toArray();
    console.log(
      "Current indexes:",
      indexes.map((idx) => idx.name)
    );

    // Drop any problematic indexes that contain avatar field
    for (const index of indexes) {
      if (index.name.includes("avatar") && index.name !== "_id_") {
        try {
          await blogModel.collection.dropIndex(index.name);
          console.log(`Dropped problematic index: ${index.name}`);
        } catch (dropError) {
          console.log(`Could not drop index ${index.name}:`, dropError.message);
        }
      }
    }

    // Remove avatar field from any existing documents
    try {
      const result = await blogModel.collection.updateMany(
        { avatar: { $exists: true } },
        { $unset: { avatar: 1 } }
      );
      if (result.modifiedCount > 0) {
        console.log(
          `Removed avatar field from ${result.modifiedCount} documents`
        );
      }
    } catch (updateError) {
      console.log("Error removing avatar fields:", updateError.message);
    }
  } catch (error) {
    console.log("Error checking/dropping indexes:", error.message);
  }
};

const createBlogController = async (req, res) => {
  const { email, title, desc, banner, content, tags, readTime } = req.body;

  console.log(req.body);

  try {
    // Drop old avatar index if it exists (only needed once)
    await dropOldAvatarIndex();

    // Check if all required fields are provided
    if (!title || !content || !tags || !email) {
      return res
        .status(400)
        .json({ message: "Title, content, tags, and email are required" });
    }

    // Find the user by email
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Creating blog for user:", existingUser.name);

    // Create new blog post
    const newBlog = new blogModel({
      title,
      banner:
        banner ||
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
      desc: desc || title.substring(0, 150) + "...",
      content: content,
      tags: Array.isArray(tags) ? tags : [tags],
      author: existingUser._id,
      readTime: readTime || "1 min read",
    });

    // Save the blog with better error handling
    try {
      await newBlog.save();
    } catch (saveError) {
      console.error("Error saving blog:", saveError);

      // If it's still a duplicate key error, try to fix it
      if (saveError.code === 11000 && saveError.message.includes("avatar")) {
        console.log("Retrying after additional index cleanup...");
        await dropOldAvatarIndex();

        // Try saving again
        try {
          await newBlog.save();
        } catch (retryError) {
          console.error("Retry failed:", retryError);
          return res.status(500).json({
            message:
              "Failed to save blog due to database index conflict. Please contact support.",
          });
        }
      } else {
        throw saveError; // Re-throw if it's a different error
      }
    }

    // Populate author info before sending response
    await newBlog.populate("author", "name email avatar isVerified");

    res.status(201).json({
      message: "Blog created successfully",
      blog: newBlog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProductController = async (req, res) => {
  try {
    const blogs = await blogModel
      .find()
      .populate("author", "name email avatar isVerified")
      .sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getBlogByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await blogModel
      .findById(id)
      .populate("author", "name email avatar isVerified");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add/Remove bookmark
const toggleBookmarkController = async (req, res) => {
  try {
    const { blogId, email } = req.body;

    if (!blogId || !email) {
      return res
        .status(400)
        .json({ message: "Blog ID and email are required" });
    }

    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if blog exists
    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if already bookmarked
    const isBookmarked = user.bookmarks.includes(blogId);

    if (isBookmarked) {
      // Remove bookmark
      user.bookmarks = user.bookmarks.filter((id) => id.toString() !== blogId);
      await user.save();
      res.status(200).json({ message: "Bookmark removed", bookmarked: false });
    } else {
      // Add bookmark
      user.bookmarks.push(blogId);
      await user.save();
      res.status(200).json({ message: "Blog bookmarked", bookmarked: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get user's bookmarked blogs
const getBookmarkedBlogsController = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user with populated bookmarks
    const user = await userModel.findOne({ email }).populate({
      path: "bookmarks",
      populate: {
        path: "author",
        select: "name email avatar isVerified",
      },
      options: { sort: { createdAt: -1 } },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.bookmarks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Toggle like on blog
const toggleLikeController = async (req, res) => {
  try {
    const { blogId, email } = req.body;

    if (!blogId || !email) {
      return res
        .status(400)
        .json({ message: "Blog ID and email are required" });
    }

    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find blog
    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Initialize likedBy array if it doesn't exist
    if (!blog.likedBy) {
      blog.likedBy = [];
    }

    // Check if user has already liked this blog
    const userIndex = blog.likedBy.indexOf(user._id.toString());

    let liked = false;
    if (userIndex > -1) {
      // User has already liked, so unlike it
      blog.likedBy.splice(userIndex, 1);
      blog.likes = Math.max(0, blog.likes - 1);
      liked = false;
    } else {
      // User hasn't liked yet, so like it
      blog.likedBy.push(user._id.toString());
      blog.likes = (blog.likes || 0) + 1;
      liked = true;
    }

    await blog.save();

    res.status(200).json({
      message: liked ? "Blog liked" : "Blog unliked",
      likes: blog.likes,
      liked: liked,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete blog (only by author)
const deleteBlogController = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find blog
    const blog = await blogModel.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if user is the author
    if (blog.author.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only the author can delete this blog" });
    }

    // Delete the blog
    await blogModel.findByIdAndDelete(id);

    // Remove from all users' bookmarks
    await userModel.updateMany({ bookmarks: id }, { $pull: { bookmarks: id } });

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createBlogController,
  getProductController,
  getBlogByIdController,
  toggleBookmarkController,
  getBookmarkedBlogsController,
  toggleLikeController,
  deleteBlogController,
};
