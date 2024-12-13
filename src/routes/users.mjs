import { Router } from "express";
import {
  query,
  validationResult,
  body,
  matchedData,
  checkSchema,
} from "express-validator";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { mockUsers } from "../utils/constants.mjs";
import {
  loggingMiddleware,
  resolveIndexByUserId,
} from "../utils/middlewares.mjs";

const router = Router();

router.get(
  "/api/users",
  query("filter")
    .isString()
    .withMessage("Filter must be a string")
    .notEmpty()
    .withMessage("Filter must not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("Filter must be between 3 and 10 characters long"),
  loggingMiddleware,
  (request, response) => {
    const result = validationResult(request);
    console.log(result);
    const {
      query: { filter, value },
    } = request;
    let filteredUsers = [...mockUsers];
    if (filter && value) {
      return response.send(
        filteredUsers.filter((user) =>
          user[filter].toLowerCase().includes(value.toLowerCase())
        )
      );
    }
    return response.status(200).send(mockUsers);
  }
);

router.get("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  const findUser = mockUsers[findUserIndex];
  if (!findUser) return response.sendStatus(404);
  response.send(findUser);
});

// POST: create a new user
router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  (request, response) => {
    const result = validationResult(request);
    console.log(result);
    if (!result.isEmpty()) {
      return response.status(400).send({ errors: result.array() });
    }
    const data = matchedData(request); // 如果body里有多的filed，会自动去除，只返回验证过的field
    const newUser = { id: mockUsers.length + 1, ...data };
    mockUsers.push(newUser);
    return response.status(201).send(newUser);
  }
);

// PATCH: update specific field of a user
router.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  const updatedUser = { ...mockUsers[findUserIndex], ...body };
  mockUsers[findUserIndex] = updatedUser;
  response.send(updatedUser);
});

// PUT: update entire user
router.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  const updatedUser = { id: mockUsers[findUserIndex].id, ...body };
  mockUsers[findUserIndex] = updatedUser;
  response.send(updatedUser);
});

// DELETE: delete a user
router.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  mockUsers.splice(findUserIndex, 1);
  response.sendStatus(204);
});

export default router;
