import mongoose from "mongoose";
import { Cart } from "./cart.js";

const OrderSchema = mongoose.schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "userId is required"],
    validate: {
      validator: (id) => mongoose.Types.ObjectId.isValid(id),
      message: (props) => `${props.value} is not a valid userId`,
    },
  },
  cartId: {
    type: mongoose.Types.ObjectId,
    ref: "Cart",
    required: [true, "cartId is required"],
    validate: {
      validator: (id) => mongoose.Types.ObjectId.isValid(id),
      message: (props) => `${props.value} is not a valid cartId`,
    },
  },
  shippingAddress: {
    type: String,
    required: true,
    trim: true,
  },
  billingAddress: {
    type: String,
    required: true,
    trim: true,
  },
  totalPrice: {
    type: Number,
    default: () => {
      const cart = Cart.findById(this.cartId);
      if (!cart) throw new Error('Cart not found');
      return cart.items.reduce((total, item) => {
        return total + item.productId.price * item.quantity;
      }, 0);
    },
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  method: {
    type: String,
    enum: ["debitCard", "bankTransfer", "PayStack"],
    required: true,
  },
}, { timestamps: true });

OrderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

/* Create an Order model */
export const Order = mongoose.model("Order", OrderSchema);
