import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from "../models/User.js";
export default function() {
    // passport.use(
    //     new GoogleStrategy({
    //             clientID: "521485029690-8ef25d7c887q95cih670p9sj0urfhite.apps.googleusercontent.com",
    //             clientSecret: "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",
    //             callbackURL: 'http://localhost:4100/auth/google/callback',
    //         },
    //         async(accessToken, refreshToken, profile, done) => {
    //             // Assuming you have a database model for users (e.g., User)
    //             try {
    //                 // Check if the user exists in the database using their Google ID
    //                 let user = await User.findOne({ userId });

    //                 if (!user) {
    //                     // If the user doesn't exist, create a new user in the database
    //                     user = new User({
    //                         firstName: profile.displayName,
    //                         lastName: profile.displayName,
    //                         userImage: profile.im
    //                         email: profile.emails[0].value, // Assuming you want to save the first email
    //                         state: profile.provider,
    //                         country: profile.placesLived,
    //                         address: profile.placesLived,
    //                         password: profile.emails[0].value,


    //                         // You can save additional user data from the profile object if needed
    //                     });
    //                     await user.save();
    //                 }

    //                 // Call the done function to indicate successful authentication
    //                 // The 'user' object will be serialized and stored in the session
    //                 done(null, user);
    //             } catch (error) {
    //                 // If there is an error during database operations, call done with the error
    //                 done(error, null);
    //             }
    //             return done(null, profile);
    //         }
    //     )
    // );

}