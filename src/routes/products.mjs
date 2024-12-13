import { Router } from "express";

const router = Router();

router.get("/api/products", (request, response) => {
  console.log(request.headers.cookie);
  console.log(request.cookies);
  console.log(request.signedCookies);
  console.log(request.signedCookies.hello);
  if (request.signedCookies.hello && request.signedCookies.hello === "world") {
    return response.send([{ id: 1, name: "chicken breast", price: 10.99 }]);
  }
  return response.send("Sorry, you need the correct cookies");
});

export default router;