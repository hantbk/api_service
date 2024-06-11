const express = require("express");
const userController = require("../controllers/user.controller");

// Router
const router = express.Router();

// Get all users
router.get("/", userController.getAllUsers);

// Get a single user by ID
router.get("/getUser/:id", userController.getUserById);

// Create a new user
router.post("/createUser", userController.createUser);

// Update a user by ID
router.put("/updateUser/:id", userController.updateUser);

// Delete a user by ID
router.delete("/deleteUser/:id", userController.deleteUser);

module.exports = router;
