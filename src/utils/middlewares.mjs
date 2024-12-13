export const loggingMiddleware = (request, response, next) => {
  console.log(`Method: ${request.method}, URL: ${request.url}`);
  next();
};

export const resolveIndexByUserId = (request, response, next) => {
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
