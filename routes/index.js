import { Router } from "express";
import UserController from "../controllers/UserController.js";

const router = Router();

router
  .route("/users")
  .post(await UserController.createUser)
  .get(await UserController.getUser)
  .put(await UserController.updateUser)
  .delete(await UserController.deleteUser);

export default router;
