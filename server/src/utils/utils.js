import jwt from 'jsonwebtoken'; // Importing the jsonwebtoken library for generating and verifying JWTs

/**
 * Function to generate a JWT token and set it as a cookie in the response.
 * @param {string} userId - The ID of the user for whom the token is being generated.
 * @param {object} res - The HTTP response object to set the cookie.
 * @returns {string} - The generated JWT token.
 */
export const generateToken = (userId, res) => {
    // Generate a JWT token with the userId as the payload
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d", // Token will expire in 7 days
    });

    // Set the token as a cookie in the response
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time in milliseconds (7 days)
        httpOnly: true, // Cookie is accessible only by the server (not client-side JavaScript)
        sameSite: 'strict', // Prevents the cookie from being sent with cross-site requests
        secure: process.env.NODE_ENV !== 'development', // Cookie is sent only over HTTPS in production
    });

    // Return the generated token
    return token;
};