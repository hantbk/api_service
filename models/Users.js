const mongoose = require('mongoose');

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

const UserModel = mongoose.model('vdt2024', UserSchema);
module.exports = UserModel;