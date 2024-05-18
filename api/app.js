const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('./models/Users');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/crud")

// POST request to create a new user
app.post("/createUser", async (req, res) => {
    const { name, gender, school } = req.body;
    if (!name || !gender || !school) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const user = new UserModel({ name, gender, school });

    try {
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET request to fetch all users - List all users
app.get("/", async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.json(users);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET request to fetch a single user
app.get("/getUser/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' }); // Return 404 if user is not found
        }
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// PUT request to update a user
app.put("/updateUser/:id", async (req, res) => {
    const id = req.params.id;
    const { name, gender, school } = req.body;
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            { name, gender, school },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE request to delete a user
app.delete("/deleteUser/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const deletedUser = await UserModel.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(deletedUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = app;
