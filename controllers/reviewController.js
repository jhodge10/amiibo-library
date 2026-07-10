import {
  saveUserReview,
  deleteUserReview
} from "../models/reviewModel.js";

export async function saveReview(req, res, next) {
  try {
    const userId = req.session.user.userId;

    const amiiboHead = req.body.head?.trim() || "";
    const amiiboTail = req.body.tail?.trim() || "";
    const reviewText = req.body.reviewText?.trim() || "";
    const rating = Number.parseInt(req.body.rating, 10);

    const errors = [];

    if (!amiiboHead || !amiiboTail) {
      errors.push("The selected amiibo is invalid.");
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      errors.push("Rating must be between 1 and 5.");
    }

    if (reviewText.length < 3) {
      errors.push(
        "Review text must contain at least 3 characters."
      );
    }

    if (reviewText.length > 500) {
      errors.push(
        "Review text cannot contain more than 500 characters."
      );
    }

    if (errors.length > 0) {
      req.session.errorMessage = errors.join(" ");

      return res.redirect("/collection");
    }

    await saveUserReview({
      userId,
      amiiboHead,
      amiiboTail,
      rating,
      reviewText
    });

    req.session.successMessage =
      "Your review was saved.";

    return res.redirect("/collection");
  } catch (error) {
    return next(error);
  }
}

export async function deleteReview(req, res, next) {
  try {
    const userId = req.session.user.userId;
    const reviewId = Number.parseInt(
      req.params.reviewId,
      10
    );

    if (!Number.isInteger(reviewId)) {
      req.session.errorMessage =
        "The selected review is invalid.";

      return res.redirect("/collection");
    }

    const deletedReview = await deleteUserReview(
      reviewId,
      userId
    );

    if (!deletedReview) {
      req.session.errorMessage =
        "The review was not found or does not belong to you.";

      return res.redirect("/collection");
    }

    req.session.successMessage =
      "Your review was deleted.";

    return res.redirect("/collection");
  } catch (error) {
    return next(error);
  }
}