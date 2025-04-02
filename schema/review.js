import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    validate: {
      validator: (v) => mongoose.Types.ObjectId.isValid(v),
      message: (props) => `${props.value} is not a valid product ID`,
    },
    trim: true,
    required: [true, "Product ID is required"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    validate: {
      validator: (v) => mongoose.Types.ObjectId.isValid(v),
      message: (props) => `${props.value} is not a valid user ID`,
    },
    trim: true,
    required: [true, "User ID is required"],
  },
  rating: {
    type: Number,
    min: [0, "Rating must be between 0 and 5"],
    max: [5, "Rating must be between 0 and 5"],
    default: 0,
  },
  comment: {
    type: String,
    default: "",
    trim: true,
  },
}, {
  timestamps: true,
});

ReviewSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

/* Create a Review model */
export const Review = mongoose.model("Review", ReviewSchema);
