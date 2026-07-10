import express from "express";

import {
  registerForm,
  registerUser
} from "../controllers/authController.js";

const router = express.Router();

router.get("/register", registerForm);

router.post("/register", registerUser);

export default router;