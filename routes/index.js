import express from "express";

import amiiboRoutes from "./amiiboRoutes.js";
import authRoutes from "./authRoutes.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("home", {
    title: "Home"
  });
});

router.use("/amiibos", amiiboRoutes);

/*
 * Because authRoutes already contains /login and /register,
 * mount it at the root path.
 */
router.use("/", authRoutes);

export default router;