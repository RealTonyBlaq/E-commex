import { User } from "../schema/user.js";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import process from "process";

const createToken = async (user) => {
  const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return token;
};

class AuthController {
  static async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Email and password are required" });
    try {
      const user = await User.findOne({ email });
      if (!user)
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: "User with email does not exist!" });
      if (!(await user.isValidPassword(password)))
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: "Incorrect password!" });

      const token = await createToken(user);
      return res
        .cookie(process.env.COOKIE_NAME, token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 60 * 60 * 24 * 1000,
        })
        .json({ message: "Login successful", user: user.toJSON() });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  static async logout(req, res) {
    if (!req.user)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "User not logged in" });

    res.clearCookie(process.env.COOKIE_NAME, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res.status(StatusCodes.OK).json({ message: "Logout successful" });
  }
}

export default AuthController;
