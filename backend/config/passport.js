const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");
const dotenv = require("dotenv");

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
      accessType: "offline", // Make sure to request offline access for refresh token
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find user by email or create new user if not found
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // New user, create a record and save the refresh token
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            refreshToken, // Save the refresh token in the user's record
          });
          await user.save();
        } else {
          // If the user exists, update the refresh token
          user.refreshToken = refreshToken;
          await user.save();
        }

        return done(null, user); // Return the user after saving or updating
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
