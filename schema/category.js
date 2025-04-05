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
}, { timestamps: true });

CategorySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

/* Create a Category model */
export const Category = mongoose.model("Category", CategorySchema);
