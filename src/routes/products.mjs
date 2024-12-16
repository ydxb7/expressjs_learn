import { Router } from "express";

const router = Router();

router.get("/api/products", (request, response) => {
  console.log("request.headers.cookie: ", request.headers.cookie);
  console.log("request.cookies: ", request.cookies);
  console.log("request.signedCookies: ", request.signedCookies);
  console.log("request.signedCookies.hello: ", request.signedCookies.hello);
  console.log("request.session: ", request.session);
  console.log("request.session.id: " + request.session.id);
  request.sessionStore.get(request.sessionID, (error, sessionData) => {
    if (error) {
      console.error(error);
      throw error;
    }
    console.log("sessionData:");
    console.log(sessionData);
  });
  if (request.signedCookies.hello && request.signedCookies.hello === "world") {
    return response.send([{ id: 1, name: "chicken breast", price: 10.99 }]);
  }
  return response.send("Sorry, you need the correct cookies");
});

export default router;
