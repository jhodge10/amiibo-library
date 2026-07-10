import express from "express";
import dotenv from "dotenv";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";

import routes from "./routes/index.js";
import pool from "./config/db.js";

dotenv.config();

const app = express();

pool.query("SELECT NOW()", (err, result) => {

    if (err) {

        console.error(err);

    } else {

        console.log("Database Time:", result.rows[0].now);

    }

});

app.set("view engine", "ejs");

app.use(expressLayouts);

app.set("layout", "layouts/main");

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(express.static("public"));

app.use(session({

    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false

}));

app.use("/", routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`✅ Amiibo Vault running on port ${PORT}`);

});