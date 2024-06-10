const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION || "vdt2024";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    school: {
        type: String,
        required: true
    },
});

const UserModel = mongoose.model(MONGODB_COLLECTION, UserSchema);
module.exports = UserModel;