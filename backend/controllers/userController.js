const bcrypt = require("bcrypt");
const { userModel } = require("../models/userModel");

const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  try {
    const { name, username, email, password, avatar } = req.body;

    // Validation
    if (!name || !username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, username, email, and password are required" });
    }

    // Check if user already exists by email
    const existingUserByEmail = await userModel.findOne({ email });
    if (existingUserByEmail) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Check if username already exists
    const existingUserByUsername = await userModel.findOne({
      username: username.toLowerCase(),
    });
    if (existingUserByUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        message:
          "Username must be 3-20 characters long and contain only letters, numbers, and underscores",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new userModel({
      name: name.trim(),
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      avatar: avatar || undefined, // Use default if not provided
    });
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
        isVerified: newUser.isVerified,
      },
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      // Handle duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  const userExist = await userModel.findOne({ email });
  console.log(userExist);
  if (!userExist) {
    res.status(404).send({ error: "User not found with this email" });
    return;
  }

  try {
    bcrypt.compare(password, userExist.password, (err, result) => {
      const token = jwt.sign(
        {
          userId: userExist._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "5h" }
      );

      if (err) {
        console.error("Error during bcrypt comparison:", err);
        res.status(500).json({ error: "Error during bcrypt comparison" });
        return;
      }
      if (result) {
        res.status(200).send({
          token: token,
          email: userExist.email,
          user: {
            id: userExist._id,
            name: userExist.name,
            username: userExist.username,
            email: userExist.email,
            avatar: userExist.avatar,
            isVerified: userExist.isVerified,
          },
        });
      } else {
        res.status(401).send({ error: "Invalid credentials" });
      }
    });
  } catch (error) {
    console.error("Error during user signup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { signUp, userLogin };
