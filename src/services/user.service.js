const User = require("../models/user.model");

// Get all users
const getAllUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    throw new Error("Internal server error");
  }
};

// Get a user by ID
const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(error.message || "Internal server error");
  }
};

// Create a new user
const createUser = async (name, gender, school) => {
  try {
    const user = new User({
      name,
      gender,
      school,
    });
    await user.save();
    return user;
  } catch (error) {
    throw new Error("Internal server error");
  }
};

// Update a user by ID
const updateUser = async (id, name, gender, school) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    user.name = name;
    user.gender = gender;
    user.school = school;
    await user.save();
    return user;
  } catch (error) {
    throw new Error(error.message || "Internal server error");
  }
};

// Delete a user by ID
const deleteUser = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    await user.remove();
    return user;
  } catch (error) {
    throw new Error(error.message || "Internal server error");
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
