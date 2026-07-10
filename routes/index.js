import express from "express";

import amiiboRoutes from "./amiiboRoutes.js";
import authRoutes from "./authRoutes.js";

import {
  showWishlist,
  showCollection
} from "../controllers/amiiboController.js";

import {
  requireAuthentication
} from "../middleware/auth.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("home", {
    title: "Home"
  });
});

router.get(
  "/wishlist",
  requireAuthentication,
  showWishlist
);

router.get(
  "/collection",
  requireAuthentication,
  showCollection
);

router.use("/amiibos", amiiboRoutes);
router.use("/", authRoutes);

export default router;