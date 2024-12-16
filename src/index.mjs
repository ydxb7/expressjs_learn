import express from "express";
import routers from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/constants.mjs";
import passport from "passport";
import mongoose from "mongoose";
import "./strategies/local-strategy.mjs";
import { loggingMiddleware } from "./utils/middlewares.mjs";
import MongoStore from "connect-mongo";

const app = express();

mongoose
  .connect("mongodb://localhost:27017/express_learn")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

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
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);
app.use(loggingMiddleware);

// after session middleware and before routes
passport.use(passport.initialize());
app.use(passport.session());

app.use(routers);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
