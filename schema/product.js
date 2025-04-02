import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Product description is required"],
    trim: true,
  },
  imageURL: {
    type: String,
    required: [true, "Product image URL is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stockQuantity: {
    type: Number,
    min: [1, "Stock quantity must be at least 1"],
    max: 10000,
    required: [true, "Stock quantity is required"],
  },
  categoryId: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
    required: true,
  },
}, {
  timestamps: true,
});

ProductSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

/* Create a Product model */
export const Product = mongoose.model("Product", ProductSchema);
