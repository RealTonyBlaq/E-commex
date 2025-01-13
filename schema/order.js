import mongoose from "mongoose";

const OrderSchema = mongoose.schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  orderItems: [
    {
      productId: mongoose.Types.ObjectId,
      quantity: Number,
      price: Number,
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

export const Order = mongoose.model('Order', OrderSchema);
