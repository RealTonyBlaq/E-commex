import { User } from '../schema/user.js';
import { isValidObjectId } from 'mongoose';
import { StatusCodes } from 'http-status-codes';

class UserController {
  static async createUser (req, res) {
    try {
      const { firstName, lastName, email, password, phoneNumber } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: 'User already exists' });
      }

      /* const hashedPassword = await bcrypt.hash(password, 10); */

      const user = new User({
        firstName,
        lastName,
        email,
        password,
        phoneNumber
      });

      await user.save();
      return res.status(StatusCodes.CREATED).json(user);
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  }

  static async getUser (req, res) {
    const id = req.query.id;
    if (!id) {
      const allUsers = await User.find();
      return res.status(StatusCodes.OK).json(allUsers);
    }
    if (!isValidObjectId(id)) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Invalid ID' });

    try {
      const user = await User.findById(id);
      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'User not found' });
      }
      return res.status(StatusCodes.OK).json(user);
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  }

  static async updateUser (req, res) {
    const id = req.query.id;
    const allowedUpdates = ['firstName', 'lastName', 'password', 'phoneNumber'];
    const updates = {};

    if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'No ID passed' });
    if (!isValidObjectId(id)) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Invalid User ID' });

    Object.keys(req.body).forEach((update) => {
      if (allowedUpdates.includes(update)) {
        updates[update] = req.body[update];
      }
    });

    /* if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    } */

    try {
      const user = await User.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true
      });

      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'User not found' });
      }
      return res.status(StatusCodes.OK).json(user);
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  }

  static async deleteUser (req, res) {
    const id = req.query.id;

    if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'No ID passed' });
    if (!isValidObjectId(id)) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Invalid ID' });

    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'User not found' });
      }
      return res.status(StatusCodes.OK).json({ message: 'User deleted' });
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  }
}

export default UserController;
