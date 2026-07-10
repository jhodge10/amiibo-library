import express from "express";

import {
  saveReview,
  deleteReview
} from "../controllers/reviewController.js";

import {
  requireAuthentication
} from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/",
  requireAuthentication,
  saveReview
);

router.post(
  "/:reviewId/delete",
  requireAuthentication,
  deleteReview
);

export default router;