import { User } from "../schema/user.js";
import { StatusCodes } from "http-status-codes";


class UserController {
  static async createUser(req, res) {
    try {
      const { firstName, lastName, email, password, phoneNumber } = req.body;

      const user = new User({
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
      });
      await user.save();
      return res.status(StatusCodes.CREATED).json(user);
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  }
};

export default UserController;
