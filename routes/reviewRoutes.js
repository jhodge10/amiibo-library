import express from "express";

import {
  saveReview,
  deleteReview
} from "../controllers/reviewController.js";

import {
  requireCollectorOrAdmin
} from "../middleware/admin.js";

const router = express.Router();

router.post(
  "/",
  requireCollectorOrAdmin,
  saveReview
);

router.post(
  "/:reviewId/delete",
  requireCollectorOrAdmin,
  deleteReview
);

export default router;