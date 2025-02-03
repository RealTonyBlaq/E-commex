import { isValidObjectId } from "mongoose";
import { Product } from "../schema/product";
import { StatusCodes } from "http-status-codes";

class ProductController {
    static async createProduct(req, res) {
        const { name, description, price, stockQuantity, categoryId,  } = req.body;
        if (!name || !description || !price || !stockQuantity || !categoryId) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ error: "All fields are required" });
        }
        if (!isValidObjectId(categoryId)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid category ID" });
        }
        try {
            const product = new Product({
                name,
                description,
                price,
                stockQuantity,
                categoryId,
            });
            await product.save();
            return res.status(StatusCodes.CREATED).json(product);
        } catch (error) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
        }
    }
}


export default ProductController;
