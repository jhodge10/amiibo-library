import express from "express";
import dotenv from "dotenv";
import expressLayouts from "express-ejs-layouts";

import routes from "./routes/index.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(expressLayouts);
app.set("layout", "./layouts/main");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.use("/", routes);

app.listen(PORT, () => {
    console.log(`✅ Amiibo Vault running on port ${PORT}`);
});