const express = require('express');
const multer = require('multer');
const Post = require('../models/Post');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config()

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Create a post
router.post('/create', upload.single('image'), async (req, res) => {
    const { content } = req.body;
    const user = req.user;
    const newPost = new Post({ content, user: user.id, image: req.file.path });
    await newPost.save();
    res.redirect('/');
});

// Like a post
router.post('/:id/like', async (req, res) => {
    const post = await Post.findById(req.params.id);
    const user = req.user;

    if (!post.likes.includes(user.id)) {
        post.likes.push(user.id);
        await post.save();

        const postOwner = await User.findById(post.user);

        // Send email notification
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: postOwner.email,
            subject: 'Your post was liked!',
            text: `Hello ${postOwner.username},\n\nYour post was liked by ${user.username}. Check it out!\n\nBest regards,\nSocial Media Platform`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Email sent: ' + info.response);
        });
    }

    res.redirect('/');
});

module.exports = router;
