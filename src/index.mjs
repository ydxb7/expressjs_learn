import express from "express";
import routers from "./routes/index.mjs";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser("hello-world-secret-key"));
app.use(routers);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get(
  "/",
  (request, response, next) => {
    console.log("mdilleware 1");
    next();
  },
  (request, response, next) => {
    console.log("mdilleware 2");
    next();
  },
  (request, response, next) => {
    console.log("mdilleware 3");
    next();
  },
  (request, response) => {
    response.cookie("hello", "world", { maxAge: 60000 * 60 * 2, signed: true });
    response.status(201).send({ msg: "Hello!" });
  }
);
