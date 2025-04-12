import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "category name is missing"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "description is missing"],
    trim: true,
  },
}, { timestamps: true });

CategorySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

/* Create a Category model */
export const Category = mongoose.model("Category", CategorySchema);
