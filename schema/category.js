import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

CategorySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

/* Create a Category model */
export const Category = mongoose.model("Category", CategorySchema);
