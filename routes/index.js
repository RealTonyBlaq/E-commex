import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import CategoryController from "../controllers/CategoryController.js";
import ProductController from "../controllers/ProductController.js";
import UserController from "../controllers/UserController.js";
import CartController from "../controllers/CartController.js";
import ReviewsController from "../controllers/ReviewsController.js";
import { requireAuth } from "../controllers/middleware/auth.js";

const router = Router();

/* Auth Routes */
router
  .route("/login")
  .post(await AuthController.login)

router
  .route("/logout")
  .get(requireAuth, await AuthController.logout);


/* User Routes */
router
  .route("/users")
  .post(await UserController.createUser)
  .get(await UserController.getUser)
  .put(await UserController.updateUser)
  .delete(await UserController.deleteUser);

/* Category Routes */
router
  .route("/categories")
  .post(await CategoryController.createCategory)
  .get(await CategoryController.getCategory)
  .put(await CategoryController.updateCategory)
  .delete(await CategoryController.deleteCategory);

/* Product Routes */
router
  .route("/products")
  .post(await ProductController.createProduct)
  .get(await ProductController.getProduct)
  .put(await ProductController.updateProduct)
  .delete(await ProductController.deleteProduct);

/* Cart Routes */
router
  .route("/cart")
  .post(requireAuth, await CartController.AddToCart)
  .get(requireAuth, await CartController.GetCart)
  .delete(requireAuth, await CartController.RemoveFromCart);

/* Review Routes */
router
  .route("/reviews")
  .post(requireAuth, await ReviewsController.createReview)
  .get(requireAuth, await ReviewsController.getReview)
  .put(requireAuth, await ReviewsController.updateReview)
  .delete(requireAuth, await ReviewsController.deleteReview);

export default router;
