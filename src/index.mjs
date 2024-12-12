import express from "express";

const app = express();

app.use(express.json());

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

app.get("/", (request, response) => {
  response.status(201).send({ msg: "Hello!" });
});

app.get("/api/users", (request, response) => {
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

app.get("/api/users/:id", (request, response) => {
  console.log(request.params);
  const parsedId = parseInt(request.params.id);
  if (isNaN(parsedId)) {
    response.status(400).send({ error: "Invalid user ID" });
    return;
  }
  const findUser = mockUsers.find((user) => user.id === parsedId);
  if (!findUser) {
    response.sendStatus(404);
    return;
  }
  response.send(findUser);
});

app.get("/api/products", (request, response) => {
  response.send([{ id: 1, name: "chicken breast", price: 10.99 }]);
});

// PATCH: update specific field of a user
app.patch("/api/users/:id", (request, response) => {
  const {
    body,
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
  const updatedUser = { ...mockUsers[findUserIndex], ...body };
  mockUsers[findUserIndex] = updatedUser;
  response.send(updatedUser);
});

// PUT: update entire user
app.put("/api/users/:id", (request, response) => {
  const {
    body,
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
  const updatedUser = { id: parsedId, ...body };
  mockUsers[findUserIndex] = updatedUser;
  response.send(updatedUser);
});

// DELETE: delete a user
app.delete("/api/users/:id", (request, response) => {
  const { params: { id } } = request;
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
  mockUsers.splice(findUserIndex, 1);
  response.sendStatus(204);
});