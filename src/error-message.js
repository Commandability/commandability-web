function errorMessage(error) {
  console.log(error.message);
  switch (error.message) {
    case "Firebase: Error (auth/email-already-exists).":
      return {
        title: "Email already exists",
        message:
          "There is already an account associated with this email address",
      };
    case "Firebase: Error (auth/user-not-found).":
      return {
        title: "Login failed",
        message: "The email and password combination provided do not match",
      };
    case "Firebase: Error (auth/wrong-password).":
      return {
        title: "Login failed",
        message: "The email and password combination provided do not match",
      };
    default:
      return {
        title: "Unknown Error",
        message: "An unknown error has occurred",
      };
  }
}

export default errorMessage;
