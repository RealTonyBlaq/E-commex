import { User } from "../schema/user.js";
import { isValidObjectId } from "mongoose";
import { StatusCodes } from "http-status-codes";

class UserController {
  static async createUser(req, res) {
    try {
      const { firstName, lastName, email, password, phoneNumber } = req.body;

      const missingUploads = [];
      const fields = { firstName, lastName, email, password  };
      Object.keys(fields).forEach((key) => {
        if (!fields[key]) missingUploads.push(key);
      });

      if (missingUploads.length > 0)
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: `${missingUploads.join(", ")} field(s) are missing` });

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
      return res.status(StatusCodes.CREATED).json(user.toJSON());
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  }

  static async getUser(req, res) {
    const id = req.query.id;
    if (!id) {
      const allUsers = await User.find();
      const users = allUsers.map((user) => user.toJSON());
      return res.status(StatusCodes.OK).json(users);
    }
    if (!isValidObjectId(id))
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Invalid ID" });

    try {
      const user = await User.findById(id);
      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "User not found" });
      }
      return res.status(StatusCodes.OK).json(user.toJSON());
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  }

  static async updateUser(req, res) {
    const id = req.query.id;
    const allowedUpdates = ["firstName", "lastName", "password", "phoneNumber"];
    const updates = {};

    if (!id)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "No ID passed" });
    if (!isValidObjectId(id))
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Invalid User ID" });

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
      return res.status(StatusCodes.OK).json(user.toJSON());
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  }

  static async deleteUser(req, res) {
    const id = req.query.id;

    if (!id)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "No ID passed" });
    if (!isValidObjectId(id))
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Invalid ID" });

    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "User not found" });
      }
      return res.status(StatusCodes.OK).json({ message: "User deleted" });
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  }
}

export default UserController;
