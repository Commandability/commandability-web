function firebaseErrors(error) {
  switch (error.code) {
    case "auth/email-already-in-use":
      return {
        title: "Email already in use",
        message:
          "There is already an account associated with this email address",
      };
    case "auth/user-not-found":
    case "auth/wrong-password":
      return {
        title: "Login failed",
        message: "Invalid email or password",
      };
    default:
      return {
        title: "Unknown error",
        message: "An unknown error has occurred",
      };
  }
}

export default firebaseErrors;
