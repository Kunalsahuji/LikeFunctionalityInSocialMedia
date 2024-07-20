// // const passport = require('passport');
// // const GitHubStrategy = require('passport-github').Strategy;
// // const User = require('../models/User');

// // passport.use(new GitHubStrategy({
// //     clientID: process.env.GITHUB_CLIENT_ID,
// //     clientSecret: process.env.GITHUB_CLIENT_SECRET,
// //     callbackURL: process.env.GITHUB_CALLBACK_URL
// // },
// //     async (accessToken, refreshToken, profile, done) => {
// //         try {
// //             let user = await User.findOne({ githubId: profile.id });
// //             if (!user) {
// //                 user = new User({
// //                     username: profile.username,
// //                     email: profile.emails[0].value,
// //                     githubId: profile.id
// //                 });
// //                 await user.save();
// //             }
// //             return done(null, user);
// //         } catch (err) {
// //             return done(err);
// //         }
// //     }
// // ));

// // passport.serializeUser((user, done) => {
// //     done(null, user.id);
// // });

// // passport.deserializeUser(async (id, done) => {
// //     try {
// //         const user = await User.findById(id);
// //         done(null, user);
// //     } catch (err) {
// //         done(err);
// //     }
// // });


// // const LocalStrategy = require('passport-local').Strategy;
// // const bcrypt = require('bcryptjs');
// // const User = require('../models/User');

// // module.exports = function(passport) {
// //     passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
// //         User.findOne({ email: email }).then(user => {
// //             if (!user) {
// //                 return done(null, false, { message: 'No user with that email' });
// //             }

// //             bcrypt.compare(password, user.password, (err, isMatch) => {
// //                 if (err) throw err;
// //                 if (isMatch) {
// //                     return done(null, user);
// //                 } else {
// //                     return done(null, false, { message: 'Password incorrect' });
// //                 }
// //             });
// //         }).catch(err => console.error(err));
// //     }));

// //     passport.serializeUser((user, done) => {
// //         done(null, user.id);
// //     });

// //     passport.deserializeUser((id, done) => {
// //         User.findById(id, (err, user) => done(err, user));
// //     });
// // };


// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const GitHubStrategy = require('passport-github').Strategy;
// const bcrypt = require('bcryptjs');
// const User = require('../models/User');

// module.exports = function (passport) {
//     // Local Strategy
//     passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
//         User.findOne({ email: email }).then(user => {
//             if (!user) {
//                 return done(null, false, { message: 'No user with that email' });
//             }

//             bcrypt.compare(password, user.password, (err, isMatch) => {
//                 if (err) throw err;
//                 if (isMatch) {
//                     return done(null, user);
//                 } else {
//                     return done(null, false, { message: 'Password incorrect' });
//                 }
//             });
//         }).catch(err => console.error(err));
//     }));

//     // GitHub Strategy
//     passport.use(new GitHubStrategy({
//         clientID: process.env.GITHUB_CLIENT_ID,
//         clientSecret: process.env.GITHUB_CLIENT_SECRET,
//         callbackURL: process.env.GITHUB_CALLBACK_URL
//     },
//         async (accessToken, refreshToken, profile, done) => {
//             try {
//                 let user = await User.findOne({ githubId: profile.id });
//                 if (!user) {
//                     user = new User({
//                         username: profile.username,
//                         email: profile.emails[0].value,
//                         githubId: profile.id
//                     });
//                     await user.save();
//                 }
//                 return done(null, user);
//             } catch (err) {
//                 return done(err);
//             }
//         }));

//     passport.serializeUser((user, done) => {
//         done(null, user.id);
//     });

//     passport.deserializeUser(async (id, done) => {
//         try {
//             const user = await User.findById(id);
//             done(null, user);
//         } catch (err) {
//             done(err);
//         }
//     });
// };

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = function (passport) {
    // Local Strategy
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        User.findOne({ email: email }).then(user => {
            if (!user) {
                return done(null, false, { message: 'No user with that email' });
            }

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password incorrect' });
                }
            });
        }).catch(err => console.error(err));
    }));

    // GitHub Strategy
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ githubId: profile.id });
                if (!user) {
                    user = new User({
                        username: profile.username,
                        email: profile.emails[0].value,
                        githubId: profile.id
                    });
                    await user.save();
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};

