import { Router } from "express";
import { mockUsers } from "../utils/constants.mjs";

const router = Router();

router.get("/", (request, response) => {
  console.log(request.session);
  console.log(request.session.id);
  request.session.visited = true; // 任意设置一个参数都好使 因为设置了saveUninitialized: false 要改动才会存到sessionStore, 不改动每次都会存新的
  response.cookie("hello", "world", { maxAge: 60000 * 60 * 2, signed: true });
  response.status(201).send({ msg: "Hello!" });
});

router.post("/api/auth", (request, response) => {
  console.log(request.session);
  console.log(request.session.id);
  const { username, password } = request.body;
  const findUser = mockUsers.find((user) => user.username === username);
  if (!findUser || findUser.password !== password)
    return response.status(401).send({ error: "Invalid credentials" });

  request.session.user = findUser;
  return response.status(200).send(findUser);
});

router.get("/api/auth/status", (request, response) => {
  console.log("request.sessionID:" + request.sessionID);
  request.sessionStore.get(request.sessionID, (error, sessionData) => {
    console.log("request.sessionStore.get");
    console.log(sessionData);
  });
  return request.session.user
    ? response.status(200).send(request.session.user)
    : response.status(401).send({ msg: "Unauthorized" });
});

router.post("/api/cart", (request, response) => {
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

router.get("/api/cart", (request, response) => {
  if (!request.session.user) return response.sendStatus(401);
  return response.send(request.session.cart ?? []);
});

export default router;