import { isValidObjectId } from "mongoose";
import { Cart } from "../schema/cart.js";
import { StatusCodes } from "http-status-codes";
import { Product } from "../schema/product.js";
import { User } from "../schema/user.js";

class CartController {
  static async CreateCart(req, res) {
    const userId = req.query.userId;
    const { listOfProducts } = req.body;

    // define methods to retrieve carted products from cache/redis
    if (!userId)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "No user ID passed" });

    if (!isValidObjectId(userId))
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid user ID" });

    if (!(await User.findById(userId)))
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });

    if (!listOfProducts)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "No product list passed" });

    if (!Array.isArray(listOfProducts))
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Not a list type" });

    if (listOfProducts.length === 0)
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Empty list" });

    const items = [];
    for (const product of listOfProducts) {
      const { productId, quantity } = product;
      if (productId) {
        if (!isValidObjectId(productId))
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: "Invalid product ID" });

        if (!(await Product.findById(productId)))
          return res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: "Product not found" });

        items.push({ productId, quantity });
      }
    }

    if (items.length === 0)
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Empty list" });

    try {
      const newCart = new Cart({
        userId,
        items,
      });
      await newCart.save();
      return res.status(StatusCodes.CREATED).json(newCart);
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  static async getCart(req, res) {
    const cartId = req.query.cartId;

    if (!cartId)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "No cartId passed" });

    if (!isValidObjectId(cartId))
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid Cart ID" });

    const myCart = await Cart.findById(cartId);

    if (!myCart)
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Not found" });
    return res.status(StatusCodes.OK).json(myCart);
  }

  static async AddToCart(req, res) {
    const cartId = req.query.id;
    const userId = req.query.userId;
    const { productId, quantity } = req.body;

    if (!isValidObjectId(productId))
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid product ID" });

    if (!(await Product.findById(productId)))
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Product not found" });

    const items = [{ productId, quantity }];

    if (!cartId) {
      try {
        const newCart = new Cart({
          userId,
          items,
        });
        newCart.save();
        return res.status(StatusCodes.CREATED).json(newCart);
      } catch (error) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
      }
    }

    if (!isValidObjectId(cartId))
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid Cart ID" });

    const myCart = await Cart.findById(cartId);
    if (!myCart)
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Not found" });
  }
}

export default CartController;
