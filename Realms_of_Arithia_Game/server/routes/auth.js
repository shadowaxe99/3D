const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { UserSchema } = require('../models/User');
const { BLOCKCHAIN_PROVIDER, SMART_CONTRACTS } = require('../utils/constants');

// Middleware to validate user token
const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }
    req.userId = decoded.id;
    next();
  });
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new UserSchema({
      username,
      email,
      password: hashedPassword,
      blockchainAccount: null // Placeholder for blockchain account creation
    });

    // Save user in the database
    await newUser.save();

    // Create blockchain account for the user
    // This is a placeholder for the actual blockchain account creation logic
    newUser.blockchainAccount = await createBlockchainAccount(BLOCKCHAIN_PROVIDER, SMART_CONTRACTS);

    // Save the blockchain account information
    await newUser.save();

    res.status(201).send({ message: 'User registered successfully!', userId: newUser._id });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await UserSchema.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: 'User not found!' });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Invalid password!' });
    }

    // Create and assign a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 86400 // 24 hours
    });

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      accessToken: token
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Middleware to create a blockchain account - Placeholder for actual implementation
async function createBlockchainAccount(provider, contracts) {
  // Logic to integrate with blockchain and create an account
  // This is a simplified version and should be replaced with actual blockchain interaction
  return `0x${Math.random().toString(36).substring(2, 15)}`;
}

module.exports = router;