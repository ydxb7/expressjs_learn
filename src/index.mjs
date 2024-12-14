import express from "express";
import routers from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/constants.mjs";

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
    console.log(request.session);
    console.log(request.session.id);
    request.session.visited = true; // 任意设置一个参数都好使 因为设置了saveUninitialized: false 要改动才会存到sessionStore, 不改动每次都会存新的
    response.cookie("hello", "world", { maxAge: 60000 * 60 * 2, signed: true });
    response.status(201).send({ msg: "Hello!" });
  }
);

app.post("/api/auth", (request, response) => {
  console.log(request.session);
  console.log(request.session.id);
  const { username, password } = request.body;
  const findUser = mockUsers.find((user) => user.username === username);
  if (!findUser || findUser.password !== password)
    return response.status(401).send({ error: "Invalid credentials" });

  request.session.user = findUser;
  return response.status(200).send(findUser);
});

app.get("/api/auth/status", (request, response) => {
  console.log("request.sessionID:" + request.sessionID);
  request.sessionStore.get(request.sessionID, (error, sessionData) => {
    console.log("request.sessionStore.get");
    console.log(sessionData);
  });
  return request.session.user
    ? response.status(200).send(request.session.user)
    : response.status(401).send({ msg: "Unauthorized" });
});

app.post("/api/cart", (request, response) => {
  if (!request.session.user) return response.sendStatus(401);
//   const { item } = request.body; 这个写法是错的
  const { body: item } = request;
  const { cart } = request.session;
  console.log("item: " + item);
  if (cart) {
    cart.push(item);
  } else {
    request.session.cart = [item];
  }
  console.log("request.session.cart: " + request.session.cart);
  return response.status(201).send(request.session.cart);
});

app.get("/api/cart", (request, response) => {
  if (!request.session.user) return response.sendStatus(401);
  return response.send(request.session.cart ?? []);
});