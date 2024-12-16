export const createUserValidationSchema = {
  username: {
    isLength: {
      options: { min: 3, max: 10 },
      errorMessage: "Name must be between 3 and 10 characters",
    },
    notEmpty: {
      errorMessage: "Name cannot be empty",
    },
    isString: {
      errorMessage: "Name must be a string",
    },
  },
  displayName: {
    notEmpty: {
      errorMessage: "Display name cannot be empty",
    },
    isString: {
      errorMessage: "Display name must be a string",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "password cannot be empty",
    },
  },
};
