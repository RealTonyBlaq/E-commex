import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      productId: mongoose.Types.ObjectId,
      quantity: Number,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

CartSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

/* Create a Cart model */
export const Cart = mongoose.model("Cart", CartSchema);
