/* Category controller */
import { Category } from "../schema/category.js";
import { isValidObjectId } from "mongoose";
import { StatusCodes } from "http-status-codes";


class CategoryController {
    static async createCategory(req, res) {
        const { name, description } = req.body;
        if (!name || !description) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: "All fields are required" });
        }
    
        try {
        const category = new Category({ name, description });
        await category.save();
        return res.status(StatusCodes.CREATED).json(category);
        } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
        }
    }
    
    static async getCategory(req, res) {
        const id = req.query.id;

        if (!id) {
        const allCategories = await Category.find();
        return res.status(StatusCodes.OK).json(allCategories);
        }

        if (!isValidObjectId(id))
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Invalid Category ID" });
    
        try {
        const category = await Category.findById(id);
        if (!category)
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Category not found" });
    
        return res.status(StatusCodes.OK).json(category);
        } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
        }
    }
    
    static async updateCategory(req, res) {
        const id = req.query.id;
        const allowedUpdates = ["name", "description"];
        const updates = {};
    
        if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ error: "No ID passed" });
        if (!isValidObjectId(id))
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Invalid ID" });
    
        allowedUpdates.forEach((update) => {
        if (req.body[update]) updates[update] = req.body[update];
        });
    
        try {
        const category = await Category.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });
        if (!category) return res.status(StatusCodes.NOT_FOUND).json({ error: "Category not found" });
    
        return res.status(StatusCodes.OK).json(category);
        } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
        }
    }
    
    static async deleteCategory(req, res) {
        const id = req.query.id;
        if (!id) return res.status(StatusCodes.BAD_REQUEST).json({ error: "No ID passed" });
        if (!isValidObjectId(id))
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Invalid ID" });
    }
}

export default CategoryController;
