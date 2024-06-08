const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_COLLECTION = process.env.MONGO_COLLECTION || 'vdt2024';

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

const UserModel = mongoose.model(MONGO_COLLECTION, UserSchema);
module.exports = UserModel;