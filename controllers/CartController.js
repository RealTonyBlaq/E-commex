import { isValidObjectId } from "mongoose";
import { Cart } from "../schema/cart.js";
import { StatusCodes } from "http-status-codes";
import { Product } from "../schema/product.js";
import { User } from "../schema/user.js";

class CartController {
  static async GetCart(req, res) {
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

    myCart.items.push({ productId, quantity });
    await myCart.save();
    return res.status(StatusCodes.OK).json(myCart);
  }

  static async RemoveFromCart(req, res) {
    const cartId = req.query.id;
    const { productId, clearAll } = req.body;

    if (!cartId)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "CartId missing" });

    if (!isValidObjectId(cartId))
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid Cart ID" });

    const myCart = await Cart.findById(cartId);
    if (!myCart)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Cart Not found" });

    if (clearAll) {
      myCart.items = [];
      await myCart.save();
      return res.status(StatusCodes.OK).json(myCart);
    }

    if (productId && !isValidObjectId(productId))
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid product ID" });

    const index = myCart.items.findIndex(
      (item) => item.productId === productId
    );
    if (index === -1)
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Not found" });

    myCart.items.splice(index, 1);
    await myCart.save();
    return res.status(StatusCodes.OK).json(myCart);
  }
}

export default CartController;
