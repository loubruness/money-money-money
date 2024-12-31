import { getUserById } from "../database/queries/userQueries.js";

// Authorization middleware
export const authorize = (...allowedRoles) => {
  return (request, response, next) => {
    // Get the user from the user id in the request
    const userId = request.query.userId;
    getUserById(userId)
      .then((user) => {
        if (user.length === 0) {
          response.status(404).send("User not found");
          return;
        }

        // Check if the user has the required role
        const hasRole = allowedRoles.includes(user[0].role);

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
        response.status(500).json({
          info: "Error authenticating user",
          error: error,
          message: error.message,
        });
      });
  };
};
