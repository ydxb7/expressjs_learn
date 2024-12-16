import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { GoogleUser } from "../mongoose/schemas/google-user.mjs";

const google_client_secret = process.env.GOOGLE_OAUTH_CLIENT_SECRET_KEY;
const google_client_id = process.env.GOOGLE_OAUTH_CLIENT_ID;

passport.serializeUser((user, done) => {
  console.log(`serializeUser:`);
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log(`deserializeUser: ${id}`);
  try {
    const findUser = await GoogleUser.findById(id);
    if (!findUser) throw new Error("User not found.");
    done(null, findUser);
  } catch (error) {
    done(error, null);
  }
});

export default passport.use(
  new Strategy(
    {
      clientID: google_client_id,
      clientSecret: google_client_secret,
      callbackURL: "http://localhost:3000/api/auth/google/redirect",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(`accessToken: ${accessToken}`);
      console.log(`refreshToken: ${refreshToken}`);
      console.log(`profile: ${JSON.stringify(profile)}`);

      let findUser;
      try {
        findUser = await GoogleUser.findOne({ googleId: profile.id });
      } catch (err) {
        return done(err, null);
      }
      try {
        if (!findUser) {
          const newUser = new GoogleUser({
            username: profile.emails[0].value,
            googleId: profile.id,
          });
          const newSavedUser = await newUser.save();
          return done(null, newSavedUser);
        }
        return done(null, findUser);
      } catch (err) {
        console.error("error: ", err);
        return done(err, null);
      }
    }
  )
);
