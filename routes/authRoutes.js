import express from "express";

import {
  showRegisterPage,
  registerUser,
  showLoginPage,
  loginUser,
  logoutUser
} from "../controllers/authController.js";

import { requireGuest } from "../middleware/auth.js";

const router = express.Router();

router.get("/register", requireGuest, showRegisterPage);
router.post("/register", requireGuest, registerUser);

router.get("/login", requireGuest, showLoginPage);
router.post("/login", requireGuest, loginUser);

router.post("/logout", logoutUser);

export default router;