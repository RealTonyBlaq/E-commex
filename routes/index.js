import { Router } from "express";
import CategoryController from "../controllers/CategoryController.js";
import ProductController from "../controllers/ProductController.js";
import UserController from "../controllers/UserController.js";
import CartController from "../controllers/CartController.js";
import ReviewsController from "../controllers/ReviewsController.js";

const router = Router();

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
  .post(await CartController.AddToCart)
  .get(await CartController.GetCart)
  .delete(await CartController.RemoveFromCart);

/* Review Routes */
router
  .route("/reviews")
  .post(await ReviewsController.createReview)
  .get(await ReviewsController.getReview)
  .put(await ReviewsController.updateReview)
  .delete(await ReviewsController.deleteReview);

export default router;
