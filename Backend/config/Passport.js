// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import { Strategy as GitHubStrategy } from 'passport-github2';
// import { Strategy as FacebookStrategy } from 'passport-facebook';
// // import User from '../Models/UserSchema.js';
// import UserModel from '../models/userModel';
// const configurePassport = () => {
//     passport.use(
//         new FacebookStrategy(
//             {
//                 clientID: process.env.FACEBOOK_APP_ID,
//                 clientSecret: process.env.FACEBOOK_APP_SECRET,
//                 callbackURL: `${process.env.CALLBACK_URL}/auth/facebook/callback`,
//                 profileFields: ['id', 'displayName', 'emails'],
//             },
//             async (accessToken, refreshToken, profile, done) => {
//                 try {
//                     const email = profile.emails?.[0]?.value;

//                     // 1️⃣ find by Facebook ID
//                     let user = await UserModel.findOne({ facebookId: profile.id });
//                     if (user) return done(null, user);

//                     // 2️⃣ find by email (merge/link account)
//                     if (email) {
//                         user = await UserModel.findOne({ email });
//                         if (user) {
//                             user.facebookId = profile.id;
//                             if (!user.name) user.name = profile.displayName;
//                             await user.save();
//                             return done(null, user);
//                         }
//                     }

//                     // 3️⃣ create new user
//                     const newUser = await UserModel.create({
//                         facebookId: profile.id,
//                         email: email || undefined,
//                         name: profile.displayName,
//                     });
//                     return done(null, newUser);
//                 } catch (err) {
//                     return done(err, null);
//                 }
//             }
//         )
//     );

//     passport.use(
//         new GoogleStrategy(
//             {
//                 clientID: process.env.GOOGLE_CLIENT_ID,
//                 clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//                 callbackURL: `${process.env.CALLBACK_URL}/auth/google/callback`,
//             },
//             async (accessToken, refreshToken, profile, done) => {
//                 try {
//                     const email = profile.emails?.[0]?.value;

//                     // 1️⃣ find by Google ID
//                     let user = await UserModel.findOne({ googleId: profile.id });
//                     if (user) return done(null, user);

//                     // 2️⃣ find by email (merge/link account)
//                     if (email) {
//                         user = await UserModel.findOne({ email });
//                         if (user) {
//                             user.googleId = profile.id;
//                             if (!user.name) user.name = profile.displayName;
//                             await user.save();
//                             return done(null, user);
//                         }
//                     }

//                     // 3️⃣ create new user
//                     const newUser = await UserModel.create({
//                         googleId: profile.id,
//                         email: email || undefined,
//                         name: profile.displayName,
//                     });
//                     return done(null, newUser);
//                 } catch (err) {
//                     return done(err, null);
//                 }
//             }
//         )
//     );

//     passport.use(
//         new GitHubStrategy(
//             {
//                 clientID: process.env.GITHUB_CLIENT_ID,
//                 clientSecret: process.env.GITHUB_CLIENT_SECRET,
//                 callbackURL: `${process.env.CALLBACK_URL}/auth/github/callback`,
//                 scope: ['user:email'],
//             },
//             async (accessToken, refreshToken, profile, done) => {
//                 try {
//                     const email = profile.emails?.[0]?.value;

//                     // 1️⃣ find by GitHub ID
//                     let user = await UserModel.findOne({ githubId: profile.id });
//                     if (user) return done(null, user);

//                     // 2️⃣ find by email (merge/link account)
//                     if (email) {
//                         user = await UserModel.findOne({ email });
//                         if (user) {
//                             user.githubId = profile.id;
//                             if (!user.name) user.name = profile.displayName || profile.username;
//                             await user.save();
//                             return done(null, user);
//                         }
//                     }

//                     // 3️⃣ create new user
//                     const newUser = await UserModel.create({
//                         githubId: profile.id,
//                         email: email || undefined,
//                         name: profile.displayName || profile.username,
//                     });
//                     return done(null, newUser);
//                 } catch (err) {
//                     return done(err, null);
//                 }
//             }
//         )
//     );


//     passport.serializeUser((user, done) => done(null, user.id));

//     passport.deserializeUser(async (id, done) => {
//         try {
//             const user = await UserModel.findById(id);
//             done(null, user);
//         } catch (err) {
//             done(err, null);
//         }
//     });
// };

// export default configurePassport;

import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import UserModel from '../models/userModel.js';

// Serialize user for the session
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL+'/api/auth/google/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
            
            try {
                const email = profile.emails[0].value;

                // Check if user exists with this googleId
                let user = await UserModel.findOne({ googleId: profile.id });

                if (user) {
                    return done(null, user);
                }

                // Check if user exists with this email
                user = await UserModel.findOne({ email });

                if (user) {
                    // Link Google account to existing user
                    user.googleId = profile.id;
                    if (!user.profileImage && profile.photos?.[0]?.value) {
                        user.profileImage = profile.photos[0].value;
                    }
                    await user.save();
                    return done(null, user);
                }

                // Generate unique username
                let username = profile.emails[0].value.split('@')[0];
                const existingUsername = await UserModel.findOne({ username });
                if (existingUsername) {
                    username = `${username}_${Math.floor(Math.random() * 10000)}`;
                }

                // Create new user
                user = new UserModel({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: email,
                    username: username,
                    profileImage: profile.photos?.[0]?.value || '',
                    authProvider: 'google',
                    bio: '',
                    followers: [],
                    following: [],
                    followersCount: 0,
                    followingCount: 0,
                });

                await user.save();
                done(null, user);
            } catch (error) {
                console.error('Google OAuth Error:', error);
                done(error, null);
            }
        }
    )
);

// GitHub Strategy
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL+'/api/auth/github/callback',
            scope: ['user:email'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // GitHub might not always provide email
                const email = profile.emails?.[0]?.value || `${profile.username}@github.local`;

                // Check if user exists with this githubId
                let user = await UserModel.findOne({ githubId: profile.id });

                if (user) {
                    return done(null, user);
                }

                // Check if user exists with this email
                user = await UserModel.findOne({ email });

                if (user) {
                    // Link GitHub account to existing user
                    user.githubId = profile.id;
                    if (!user.profileImage && profile.photos?.[0]?.value) {
                        user.profileImage = profile.photos[0].value;
                    }
                    await user.save();
                    return done(null, user);
                }

                // Generate unique username
                let username = profile.username;
                const existingUsername = await UserModel.findOne({ username });
                if (existingUsername) {
                    username = `${username}_${Math.floor(Math.random() * 10000)}`;
                }

                // Create new user
                user = new UserModel({
                    githubId: profile.id,
                    name: profile.displayName || profile.username,
                    email: email,
                    username: username,
                    profileImage: profile.photos?.[0]?.value || '',
                    authProvider: 'github',
                    bio: profile._json.bio || '',
                    followers: [],
                    following: [],
                    followersCount: 0,
                    followingCount: 0,
                });

                await user.save();
                done(null, user);
            } catch (error) {
                console.error('GitHub OAuth Error:', error);
                done(error, null);
            }
        }
    )
);

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: `${process.env.CALLBACK_URL}/auth/facebook/callback`,
            profileFields: ['id', 'displayName', 'emails'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;

                // 1️⃣ find by Facebook ID
                let user = await UserModel.findOne({ facebookId: profile.id });
                if (user) return done(null, user);

                // 2️⃣ find by email (merge/link account)
                if (email) {
                    user = await UserModel.findOne({ email });
                    if (user) {
                        user.facebookId = profile.id;
                        if (!user.name) user.name = profile.displayName;
                        await user.save();
                        return done(null, user);
                    }
                }

                // Create new user
                user = new UserModel({
                    facebookId: profile.id,
                    name: profile.displayName || profile.username,
                    email: email,
                    username: username,
                    profileImage: profile.photos?.[0]?.value || '',
                    authProvider: 'FaceBook',
                    bio: profile._json.bio || '',
                    followers: [],
                    following: [],
                    followersCount: 0,
                    followingCount: 0,
                });

                return done(null, newUser);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

export default passport;
