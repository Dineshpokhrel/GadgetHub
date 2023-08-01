const { Request, Response } = require('express');
const User = require('../../models/user');
const { unlinkFile } = require('../../utils/file');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper function to generate JWT token
const generateToken = (user) => {
  const secretKey = 'secret-key'; // Replace this with your own secret key
  const payload = {
    userId: user._id,
    role: user.role // Include the role property in the token payload
  };
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if the user already exists with the given email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with the provided email already exists' });
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user with the provided role
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role // Assign the provided role to the new user
    });

    // Save the user to the database
    await user.save();

    // Generate a JWT token
    const token = generateToken(user);

    // Include the role property in the user object before sending it in the response
    const userWithRole = { ...user._doc, role };

    // Remove the hashed password from the user object before sending it in the response
    const userWithoutPassword = { ...userWithRole };
    delete userWithoutPassword.password;

    res.status(201).json({ message: 'User registration successful', token, user: userWithoutPassword });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists with the given email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = generateToken(user);

    // Remove the hashed password from the user object before sending it in the response
    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;

    res.status(200).json({ message: 'Login successful', token, user: userWithoutPassword });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};



// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error while getting all users:', error);
    res.status(500).json({ message: 'An error occurred while getting all users' });
  }
};


// Get user by ID
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error while getting user:', error);
    res.status(500).json({ message: 'An error occurred while getting user' });
  }
};


// Update user by ID
const updateUser = async (req, res) => {
  const { name, email, password, role } = req.body; // Include the 'role' field in the request body

  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user data
    user.name = name;
    user.email = email;
    user.role = role || user.role; // Update the user's role if provided, otherwise keep the existing role

    // Hash the new password if provided
    if (password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      user.password = hashedPassword;
    }

    await user.save();

    // Remove the hashed password from the updated user object before sending it in the response
    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;

    res.status(200).json({ message: 'User updated successfully', user: userWithoutPassword });
  } catch (error) {
    console.error('Error while updating user:', error);
    res.status(500).json({ message: 'An error occurred while updating user' });
  }
};


// Delete user by ID
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the hashed password from the deleted user object before sending it in the response
    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;

    res.status(200).json({ message: 'User deleted successfully', user: userWithoutPassword });
  } catch (error) {
    console.error('Error while deleting user:', error);
    res.status(500).json({ message: 'An error occurred while deleting user' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,

};
