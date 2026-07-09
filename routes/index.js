import express from "express";

import amiiboRoutes from "./amiiboRoutes.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.render("home", {
        title: "Home"
    });
});

router.use("/amiibos", amiiboRoutes);

export default router;