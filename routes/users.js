// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/users/register', async (req, res) => {
  const { username, email, password, password2 } = req.body;
  let errors = [];

  if (!username || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      username,
      email,
      password,
      password2
    });
  } else {
    try {
      let user = await User.findOne({ email: email });
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          username,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          username,
          email,
          password
        });

        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        await newUser.save();

        req.flash('success_msg', 'You are now registered and can log in');
        res.redirect('/login');
      }
    } catch (err) {
      console.error(err);
    }
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/auth/login');
  }
  res.render('profile', { user: req.user });
});

module.exports = router;
