import { AuthenticationError } from "../models/errorModel";
import { verifyToken } from "../utils/jwt";

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from `Authorization` header
  console.log("token", token);

  if (!token) {
    throw new AuthenticationError("Access token required");
  }

  try {
    const decoded = verifyToken(token); // Verify the token
    req.user = decoded; // Attach user data to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    throw new AuthenticationError("Invalid or expired access token");
  }
};

export default authenticateToken;
