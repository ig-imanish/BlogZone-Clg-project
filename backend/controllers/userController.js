const bcrypt = require("bcrypt");
const { userModel } = require("../models/userModel");

const jwt = require("jsonwebtoken");

// Password strength validation function
function validatePasswordStrength(password) {
  const minLength = 8;
  const errors = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  // Calculate strength score
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (password.match(/[A-Z]/)) strength += 25;
  if (password.match(/[0-9]/)) strength += 25;
  if (password.match(/[^A-Za-z0-9]/)) strength += 25;

  // Only allow signup if password strength is 75% or higher (Good/Strong)
  const isStrongEnough = strength >= 75;

  return {
    isValid: errors.length === 0 && isStrongEnough,
    errors: errors,
    strength: strength,
  };
}

const signUp = async (req, res) => {
  try {
    let { name, username, email, password, avatar } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    // Auto-generate username from email if not provided
    if (!username) {
      username = email.split("@")[0].toLowerCase();
      // Check if auto-generated username exists, add numbers if needed
      let baseUsername = username;
      let counter = 1;
      while (await userModel.findOne({ username: username.toLowerCase() })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      const strengthLevel =
        passwordValidation.strength <= 25
          ? "Very Weak"
          : passwordValidation.strength <= 50
          ? "Weak"
          : passwordValidation.strength <= 75
          ? "Moderate"
          : "Strong";

      return res.status(400).json({
        message: `Password is too weak (${strengthLevel}). Only "Good" or "Strong" passwords are allowed for account creation.`,
        errors: passwordValidation.errors,
        details:
          "Your password must include uppercase letters, lowercase letters, numbers, special characters, and be at least 8 characters long.",
        currentStrength: strengthLevel,
        requiredStrength: "Good or Strong",
        strengthScore: `${passwordValidation.strength}%`,
      });
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

// Get public user profile by username
const getUserProfileByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
    const user = await userModel
      .findOne({ username: username.toLowerCase() })
      .select("-password -__v");
    console.log("user found:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email, // Remove this if you want to hide email
      avatar: user.avatar,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      bio: user.bio || "",
      // Add more public fields as needed
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { signUp, userLogin, getUserProfileByUsername };
