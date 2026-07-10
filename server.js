import express from "express";
import dotenv from "dotenv";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

import routes from "./routes/index.js";
import pool from "./config/db.js";

dotenv.config();

const app = express();
const PgSession = connectPgSimple(session);

app.set("view engine", "ejs");

app.use(expressLayouts);
app.set("layout", "layouts/main");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "user_sessions",
      createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.successMessage =
    req.session.successMessage || null;
  res.locals.errorMessage =
    req.session.errorMessage || null;

  delete req.session.successMessage;
  delete req.session.errorMessage;

  next();
});

app.use("/", routes);

app.use((req, res) => {
  res.status(404).send("Page not found.");
});

app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).send(
    "A server error occurred. Please try again later."
  );
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    const result = await pool.query("SELECT NOW()");

    console.log(
      `✅ PostgreSQL connected: ${result.rows[0].now}`
    );

    app.listen(PORT, () => {
      console.log(`✅ Amiibo Vault running on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      "❌ Could not connect to PostgreSQL:",
      error.message
    );

    process.exit(1);
  }
}

startServer();