
const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config()


// Register
router.post('/user/register', async (req, res) => {
    const { username, email, password } = req.body;
    let errors = [];

    if (!username || !email || !password) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (errors.length > 0) {
        res.render('register', { errors });
    } else {
        const user = await User.findOne({ email: email });
        if (user) {
            errors.push({ msg: 'Email already exists' });
            res.render('register', { errors });
        } else {
            const newUser = new User({ username, email, password });
            bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save()
                    .then(user => res.redirect('/auth/login'))
                    .catch(err => console.error(err));
            }));
        }
    }
});

// Login
router.post('/auth/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/users/profile',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/auth/login');
});


// GitHub OAuth login route
router.get('/github', passport.authenticate('github'));

// GitHub OAuth callback route
router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/auth/login' }),
    (req, res) => {
        res.redirect('/users/profile');
    }
);
module.exports = router;
