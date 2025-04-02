import { isValidObjectId } from "mongoose";
import { Review } from "../schema/review.js";
import { StatusCodes } from "http-status-codes";

class ReviewsController {
  static async createReview(req, res) {
    const { productId, userId, rating, comment } = req.body;

    try {
      const newReview = new Review({
        productId,
        userId,
        rating,
        comment,
      });
      await newReview.save({ runValidators: true });
      return res.status(StatusCodes.CREATED).json(newReview);
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  }

  static async getReview(req, res) {
    const id = req.query.reviewId;
    if (!id) {
      const allReviews = await Review.find();
      return res.status(StatusCodes.OK).json(allReviews);
    }

    if (!isValidObjectId(id))
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Invalid ID" });

    try {
      const review = await Review.findById(id);
      if (!review)
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "Review not found" });
      return res.status(StatusCodes.OK).json(review);
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  }

  static async updateReview(req, res) {
    const id = req.query.reviewId;
    const { rating, comment } = req.body;
    const updates = {};

    if (rating) updates.rating = rating;
    if (comment) updates.comment = comment;

    if (!id)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "reviewId missing" });
    if (!isValidObjectId(id))
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid ID" });
    if (Object.keys(updates).length === 0)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "No fields to update" });

    try {
      const review = await Review.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });
      if (!review)
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "Review not found" });
      return res.status(StatusCodes.OK).json(review);
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  }

  static async deleteReview(req, res) {
    const id = req.query.reviewId;
    if (!id)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "reviewId missing" });

    if (!isValidObjectId(id))
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid ID" });
    try {
      const review = await Review.findByIdAndDelete(id);
      if (!review)
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "Review not found" });
      return res.status(StatusCodes.OK).json({ message: "Review deleted" });
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
  }
}

export default ReviewsController;
