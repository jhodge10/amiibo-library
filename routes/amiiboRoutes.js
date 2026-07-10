import express from "express";

import {
  getAllAmiibos,
  updateWishlist,
  updateCollection
} from "../controllers/amiiboController.js";

const router = express.Router();

router.get("/", getAllAmiibos);

// Save wishlist
router.post("/wishlist", updateWishlist);

// Save collection
router.post("/collection", updateCollection);

export default router;