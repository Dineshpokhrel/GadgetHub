const { Request, Response } = require('express');
const User = require('../../models/user');
const { unlinkFile } = require('../../utils/file');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Create a JWT for the user
    const secretKey = "your_secret_key"; // Replace with your actual secret key
    const expiresIn = "1h"; // Token expiration time, e.g., "1h" for 1 hour
    const token = jwt.sign({ id: newUser._id }, secretKey, { expiresIn });

    // Return the token and user data
    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: 'user',
    }).select("-password").sort({ "_id": -1 }).populate('order', "_id");

    res.status(200).json({
      status: true,
      message: "Successfully fetched users.",
      data: users
    });
  } catch (err) {
    res.status(400).json({ status: false, message: "Error fetching users" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { role, status } = req.body;

    const user = await User.findByIdAndUpdate(req.params.id, { role, status }, { new: true });

    res.status(200).json({ status: true, message: "Successfully updated user", data: user });
  } catch (error) {
    res.status(400).json({ status: false, message: 'Error updating users' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
      try {
        if (user.avatar) {
          const filePath = user.avatar.substring(1);
          unlinkFile(filePath);
        }
      } catch (err) {
        console.log(err);
      }
      return res.status(200).json({ status: true, data: user, message: "User deleted successfully." });
    } else {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: "Something went wrong while deleting."
    });
  }
};

module.exports = {
  registerUser,
  getUsers,
  updateUser,
  deleteUser,

};
