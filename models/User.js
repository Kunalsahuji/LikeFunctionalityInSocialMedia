const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    profileImage: { type: String },
    githubId: {
        type: String
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;

