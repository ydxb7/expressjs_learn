import { Router } from "express";
import usersRouter from "../routes/users.mjs";
import productsRouter from "../routes/products.mjs";
import auth0Router from "../routes/auth0.mjs";

const router = new Router();

router.use(usersRouter);
router.use(productsRouter);
router.use(auth0Router);

export default router;