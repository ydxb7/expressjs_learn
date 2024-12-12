import express from "express";

const app = express();

app.use(express.json());

// middleware
const loggingMiddleware = (request, response, next) => {
  console.log(`Method: ${request.method}, URL: ${request.url}`);
  next();
};

// app.use(loggingMiddleware); //order matters!

const resolveIndexByUserId = (request, response, next) => {
  const {
    params: { id },
  } = request;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    response.status(400).send({ error: "Invalid user ID" });
    return;
  }
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) {
    response.sendStatus(404);
    return;
  }
  request.findUserIndex = findUserIndex;
  next();
};

const PORT = process.env.PORT || 3000;

const mockUsers = [
  { id: 1, username: "john", displayName: "John" },
  { id: 2, username: "anson", displayName: "Anson" },
  { id: 3, username: "adam", displayName: "Adam" },
  { id: 4, username: "tina", displayName: "Tina" },
  { id: 5, username: "henry", displayName: "Henry" },
];

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
    response.status(201).send({ msg: "Hello!" });
  }
);

app.get("/api/users", loggingMiddleware, (request, response) => {
  console.log(request.query);
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
});

// POST: create a new user
app.post("/api/users", (request, response) => {
  console.log(request.body);
  const { body } = request;
  const newUser = { id: mockUsers.length + 1, ...body };
  mockUsers.push(newUser);
  return response.status(201).send(newUser);
});

app.get("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  const findUser = mockUsers[findUserIndex];
  if (!findUser) return response.sendStatus(404);
  response.send(findUser);
});

app.get("/api/products", (request, response) => {
  response.send([{ id: 1, name: "chicken breast", price: 10.99 }]);
});

// PATCH: update specific field of a user
app.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  const updatedUser = { ...mockUsers[findUserIndex], ...body };
  mockUsers[findUserIndex] = updatedUser;
  response.send(updatedUser);
});

// PUT: update entire user
app.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  const updatedUser = { id: mockUsers[findUserIndex].id, ...body };
  mockUsers[findUserIndex] = updatedUser;
  response.send(updatedUser);
});

// DELETE: delete a user
app.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  mockUsers.splice(findUserIndex, 1);
  response.sendStatus(204);
});