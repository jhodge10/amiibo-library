import pool from "../config/db.js";

export async function createUser({
  username,
  email,
  passwordHash
}) {
  const sql = `
    INSERT INTO users (
      username,
      email,
      password,
      role
    )
    VALUES ($1, $2, $3, 'user')
    RETURNING
      user_id,
      username,
      email,
      role,
      created_at;
  `;

  const values = [
    username,
    email.toLowerCase(),
    passwordHash
  ];

  const result = await pool.query(sql, values);

  return result.rows[0];
}

export async function findUserByEmail(email) {
  const sql = `
    SELECT
      user_id,
      username,
      email,
      password,
      role,
      created_at
    FROM users
    WHERE LOWER(email) = LOWER($1);
  `;

  const result = await pool.query(sql, [email]);

  return result.rows[0] || null;
}

export async function findUserByUsername(username) {
  const sql = `
    SELECT
      user_id,
      username,
      email,
      password,
      role,
      created_at
    FROM users
    WHERE LOWER(username) = LOWER($1);
  `;

  const result = await pool.query(sql, [username]);

  return result.rows[0] || null;
}

export async function findUserById(userId) {
  const sql = `
    SELECT
      user_id,
      username,
      email,
      role,
      created_at
    FROM users
    WHERE user_id = $1;
  `;

  const result = await pool.query(sql, [userId]);

  return result.rows[0] || null;
}