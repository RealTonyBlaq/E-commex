import jwt from "jsonwebtoken";
import process from "process";
import { StatusCodes } from "http-status-codes";
import { User } from "../../schema/user.js";

export const requireAuth = (req, res, next) => {
  const token = req.cookies[process.env.COOKIE_NAME];
  if (!token)
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (err || !decoded)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "User not authorized" });

    req.user = await User.findById(decoded.id);
    next();
  });
};
