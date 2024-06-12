const jwt = require('jsonwebtoken');
const User = require("../models/auth.model");
const bcrypt = require('bcrypt');

const register = async (req, res) => {
    try {
      const { username, password, role } = req.body;
  
      if (!username || !password || !role) {
        return res.status(400).send({ message: "All fields are required." });
      }
  
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).send({ message: "Username already exists." });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        username,
        password: hashedPassword,
        role,
      });
  
      await newUser.save();
  
      res.status(201).send({ message: "User registered successfully." });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ message: "Server error." });
    }
  };
  
  const login = async (req, res) => {
    const { username, password } = req.body;
  
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send({ message: "Invalid username or password." });
    }
  
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send({ message: "Invalid username or password." });
    }
  
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.send({ token });
  };
  
  module.exports = { register, login };