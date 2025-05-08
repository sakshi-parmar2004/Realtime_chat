import jwt from "jsonwebtoken"; // Importing the jsonwebtoken library for verifying JWTs
import User from "../models/UserSchema.js"; // Importing the User model to fetch user details from the database

/**
 * Middleware to protect routes by verifying the user's authentication status.
 * Ensures that only authenticated users can access certain endpoints.
 */
export const protectRoute = async (req, res, next) => {
  try {
    // Retrieve the JWT token from the cookies
    const token = req.cookies.jwt;

    // If no token is provided, return a 401 Unauthorized response
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    // Verify the token using the secret key from the environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If the token is invalid or does not contain a userId, return a 401 Unauthorized response
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    // Find the user in the database using the userId from the decoded token
    // Exclude the password field from the retrieved user data for security
    const user = await User.findById(decoded.userId).select("-password");

    // If the user is not found in the database, return a 404 Not Found response
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Attach the user object to the request object for use in subsequent middleware or routes
    req.user = user;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    // Log the error message to the console for debugging
    console.error(error.message);

    // Return a 401 Unauthorized response if an error occurs during token verification or user lookup
    return res.status(401).json({ success: false, message: "Unauthorized access" });
  }
};
