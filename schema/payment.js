import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  method: {
    type: String,
    enum: ["debitCard", "PayPal", "bankTransfer"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  amount: {
    type: Number,
    required: true,
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

PaymentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

/* Create a Payment model */
export const Payment = mongoose.model("Payment", PaymentSchema);
