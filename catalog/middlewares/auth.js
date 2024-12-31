import { getUserById } from "../database/queries/userQueries";

// Authorization middleware
const authenticate = (...allowedRoles) => {
  return (request, response, next) => {
    // Get the user from the user id in the request
    const userId = request.userId;
    getUserById(userId)
      .then((user) => {
        // Check if the user has the required role
        const hasRole = user.role in allowedRoles;

        // If the user has the required route authorization, call next()
        if (hasRole) {
          next();
          return;
        }

        // If the user does not have the required route authorization, return a 403 Forbidden response
        response
          .status(403)
          .send(
            "Only roles " +
              allowedRoles.join(", ") +
              " are allowed to access this route"
          );
      })
      .catch((error) => {
        response.status(500).send("Error authenticating user");
      });
  };
};
