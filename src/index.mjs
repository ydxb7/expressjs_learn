import express from "express";
import routers from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/constants.mjs";
import passport from "passport";

const app = express();

app.use(express.json());
app.use(cookieParser("hello-world-secret-key"));
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000 * 60 * 2, // 2 hours, how long the cookie will live in milliseconds
    },
  })
);

// after session middleware and before routes
passport.use(passport.initialize());
app.use(passport.session());

app.use(routers);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

