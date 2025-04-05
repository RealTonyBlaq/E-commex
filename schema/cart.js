import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "userId is required"],
    validate: {
      validator: (id) => mongoose.Types.ObjectId.isValid(id),
      message: (props) => `${props.value} is not a valid userId`,
    }
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, "productId is required"],
        validate: {
          validator: (id) => mongoose.Types.ObjectId.isValid(id),
          message: (props) => `${props.value} is not a valid productId`,
        },
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1,
      },
    },
  ],
}, { timestamps: true });

CartSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

/* Create a Cart model */
export const Cart = mongoose.model("Cart", CartSchema);
