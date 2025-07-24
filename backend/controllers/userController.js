const bcrypt = require('bcrypt');
const { userModel } = require('../models/userModel');

const jwt = require('jsonwebtoken');

const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
    
        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Internal server error' });
    }
}


const userLogin = async (req, res) => {
  const { email, password } = req.body;

  const userExist = await userModel.findOne({ email });
  console.log(userExist);
  if (!userExist) {
    res.status(404).send({error: "User not found with this email"});
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
        res.status(200).send({token : token, email : userExist.email});
     
      } else {
        res.status(401).send({error: "Invalid credentials"});
      }
    });
  } catch (error) {
    console.error("Error during user signup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports={signUp,userLogin}
