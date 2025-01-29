import { Router } from "express";
import UserController from "../controllers/UserController.js";

const router = Router();

router
  .route("/users")
  .post(UserController.createUser)
  .get(UserController.getUser)
  .put(UserController.updateUser)
  .delete(UserController.deleteUser);

export default router;
