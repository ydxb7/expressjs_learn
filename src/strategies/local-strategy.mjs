import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword, comparePassword } from "../utils/helper.mjs";

passport.serializeUser((user, done) => {
  console.log(`serializeUser:`);
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log(`deserializeUser: ${id}`);
  try {
    const findUser = await User.findById(id);
    if (!findUser) throw new Error("User not found.");
    done(null, findUser);
  } catch (error) {
    done(error, null);
  }
});

export default passport.use(
  new Strategy(
    { usernameField: "username" },
    async (username, password, done) => {
      console.log(`username: ${username}, password: ${password}`);
      try {
        const findUser = await User.findOne({ username });
        if (!findUser) throw new Error("User not found.");
        console.log(`password: ${password}`);
        console.log(`hashPassword(password): ${hashPassword(password)}`);
        console.log(`findUser.password: ${findUser.password}`);
        if (!comparePassword(password, findUser.password))
          throw new Error("Invalid password.");
        done(null, findUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
