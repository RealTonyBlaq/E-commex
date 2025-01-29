import { User } from "../schema/user.js";
import { StatusCodes } from "http-status-codes";

class UserController {
  static async createUser(req, res) {
    try {
      const { firstName, lastName, email, password, phoneNumber } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "User already exists" });
      }

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

  static async getUser(req, res, id) {
    try {
      const user = await User.findById(id);
      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "User not found" });
      }
      return res.status(StatusCodes.OK).json(user);
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  }

  static async updateUser(req, res, id) {
    const allowedUpdates = ["firstName", "lastName", "password", "phoneNumber"];
    const updates = {};
    Object.keys(req.body).forEach((update) => {
        if (allowedUpdates.includes(update)) {
            updates[update] = req.body[update];
        }
    });

    try {
      const user = await User.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });
        if (!user) {
            return res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: "User not found" });
        }
        return res.status(StatusCodes.OK).json(user);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
}

export default UserController;
