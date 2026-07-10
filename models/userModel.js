import pool from "../config/db.js";

export async function createUser(username, email, password) {
  const sql = `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  const result = await pool.query(sql, [
    username,
    email,
    password
  ]);

  return result.rows[0];
}

export async function getUserByEmail(email) {
  const sql = `
    SELECT *
    FROM users
    WHERE email = $1;
  `;

  const result = await pool.query(sql, [email]);

  return result.rows[0];
}