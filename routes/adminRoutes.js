import express from "express";

import {
  showUserDashboard,
  submitRequest,
  showAdminDashboard,
  updateUserRole,
  updateRequestStatus,
  deleteReviewAsAdmin
} from "../controllers/adminController.js";

import {
  requireAuthentication
} from "../middleware/auth.js";

import {
  requireAdmin
} from "../middleware/admin.js";

const router = express.Router();

router.get(
  "/dashboard",
  requireAuthentication,
  showUserDashboard
);

router.post(
  "/requests",
  requireAuthentication,
  submitRequest
);

router.get(
  "/admin",
  requireAdmin,
  showAdminDashboard
);

router.post(
  "/admin/users/:userId/role",
  requireAdmin,
  updateUserRole
);

router.post(
  "/admin/requests/:requestId/status",
  requireAdmin,
  updateRequestStatus
);

router.post(
  "/admin/reviews/:reviewId/delete",
  requireAdmin,
  deleteReviewAsAdmin
);

export default router;