import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be defined in environment variables");
}

const JWT_OPTIONS = {
  expiresIn: "7d",
  algorithm: "HS256",
};

export const setUser = (user) => {
  if (!user?._id || !user?.name || !user?.email) {
    throw new Error("Invalid user object for JWT");
  }

  return jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    JWT_SECRET,
    JWT_OPTIONS
  );
};

export const getUser = (token) => {
  if (!token) return null;

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("JWT Verification Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return { error: "Token expired" };
    }

    return null;
  }
};
