import { isValidObjectId } from 'mongoose';
import { Product } from '../schema/product';
import { StatusCodes } from 'http-status-codes';

class ProductController {
  static async createProduct (req, res) {
    const { name, description, price, stockQuantity, categoryId, imageURL } = req.body;
    if (!name || !description || !price || !stockQuantity || !categoryId || !imageURL) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: 'All fields are required' });
    }
    if (!isValidObjectId(categoryId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid category ID' });
    }
    try {
      const product = new Product({
        name,
        description,
        price,
        stockQuantity,
        categoryId,
        imageURL
      });
      await product.save();
      return res.status(StatusCodes.CREATED).json(product);
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  }

  static async getProduct (req, res) {
    const id = req.query.id;
    if (!id) {
      const allProducts = await Product.find();
      return res.status(StatusCodes.OK).json(allProducts);
    }
    if (!isValidObjectId(id)) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Invalid Product ID' });

    try {
      const product = await Product.findById(id);
      if (!product) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Product not found' });

      return res.status(StatusCodes.OK).json(product);
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  }

  static async updateProduct (req, res) {
    const id = req.query.id;
    const allowedUpdates = ['name', 'description', 'price', 'stockQuantity', 'categoryId', 'imageURL'];
    const updates = {};

    if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'No ID passed' });
    if (!isValidObjectId(id)) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Invalid ID' });

    allowedUpdates.forEach((update) => {
      if (req.body[update]) updates[update] = req.body[update];
    });

    if (updates.categoryId && !isValidObjectId(updates.categoryId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid category ID' });
    }

    if (updates.name && await Product.findOne({ name: updates.name })) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Product name already exists' });
    }

    try {
      const product = await Product.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true
      });

      if (!product) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Product not found' });
      return res.status(StatusCodes.OK).json(product);
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  }

  static async deleteProduct (req, res) {
    const id = req.query.id;
    if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ error: 'No ID passed' });
    if (!isValidObjectId(id)) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Invalid ID' });

    try {
      const product = await Product.findByIdAndDelete(id);
      if (!product) return res.status(StatusCodes.NOT_FOUND).json({ error: 'Product not found' });

      return res.status(StatusCodes.OK).json(product);
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
}

export default ProductController;
