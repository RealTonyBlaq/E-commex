import { Review } from "../schema/review.js";
import { StatusCodes } from "http-status-codes";

class ReviewsController {
    static async createReview(req, res) {
        const { productId, userId, rating, comment } = req.body;

        const newReview = new Review({
            productId,
            userId,
            rating,
            comment,
        });
        try {
            await newReview.save();
            return res.status(StatusCodes.CREATED).json(newReview);
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
}

export default ReviewsController;
