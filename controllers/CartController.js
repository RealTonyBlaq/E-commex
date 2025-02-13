import { isValidObjectId } from "mongoose";
import { Cart } from "../schema/cart.js";
import { StatusCodes } from "http-status-codes";

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

    if (!listOfProducts)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "No product list passed" });

    if (!Array.isArray(listOfProducts))
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Not a list type" });

    const items = [];
    listOfProducts.forEach((product) => {
      const { productId, quantity } = product;
      if (productId && quantity) {
        if (!isValidObjectId(productId))
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: "Invalid product ID" });
        
        items.push({ productId, quantity});
      }
    });

    try {
        const newCart = new Cart({
            userId,
            items
        });
        await newCart.save();
        return res.status(StatusCodes.CREATED).json(newCart);
    } catch (error) {
        return res.status(StatusCodes.BAD_GATEWAY).json({ error: error.message});
    }
  }

  static async getCart(req, res) {
    const 
  }
}


export default CartController;
