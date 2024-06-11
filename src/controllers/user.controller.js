const userService = require("../services/user.service");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.send(users);
  } catch (error) {
    res.status(500).send({ error: "couldn't fetch all users" });
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  try {
    if (!req.params.id) {
      res.status(400).send({ message: "id must be provided" });
    }
    const user = await userService.getUserById(req.params.id);
    res.send(user);
  } catch (error) {
    res
      .status(404)
      .send({ error: `Couldn't retrieve a user with id ${req.params.id}` });
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const { name, gender, school } = req.body;
    const user = await userService.createUser(name,gender,school);
    res.send(user);
  } catch (error) {
    res.status(500).send({ error: `User creation failed` });
  }
};

// Update a user by ID
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, gender, school } = req.body;
    const user = await userService.updateUser(id, name, gender, school);
    res.send(user);
  } catch (error) {
    res.status(404).send({
      error: `Couldn't update a user with id ${req.params.id}`,
    });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.deleteUser(id);
    res.send(user);
  } catch (error) {
    res.status(404).send({
      error: `Couldn't delete a user with id ${req.params.id}`,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
