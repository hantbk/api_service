const express = require("express");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const rateLimitMiddleware = require("../middlewares/rateLimitMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Router
const router = express.Router();

router.use(rateLimitMiddleware)

// Get all users
router.get("/", userController.getAllUsers);

// Get a single user by ID
router.get("/:id", authMiddleware, userController.getUserById);

// Create a new user
router.post("/", authMiddleware, roleMiddleware, userController.createUser);

// Update a user by ID
router.put("/:id", authMiddleware, roleMiddleware, userController.updateUser);

// Delete a user by ID
router.delete("/:id", authMiddleware, roleMiddleware, userController.deleteUser);

module.exports = router;
