const bcrypt = require('bcrypt');
const { userModal } = require('../modals/userModal');

const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
    
        // Check if user already exists
        const existingUser = await userModal.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new userModal({
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

module.exports={signUp}
