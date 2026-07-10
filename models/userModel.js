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

// -------------------------
// User Amiibo Functions
// -------------------------

export async function getUserAmiibo(userId, head, tail) {
  const sql = `
    SELECT *
    FROM user_amiibos
    WHERE user_id = $1
      AND amiibo_head = $2
      AND amiibo_tail = $3;
  `;

  const result = await pool.query(sql, [userId, head, tail]);

  return result.rows[0];
}

export async function saveWishlist(userId, head, tail, wishlist) {
  const existing = await getUserAmiibo(userId, head, tail);

  if (existing) {
    await pool.query(
      `
      UPDATE user_amiibos
      SET in_wishlist = $1
      WHERE id = $2;
      `,
      [wishlist, existing.id]
    );
  } else {
    await pool.query(
      `
      INSERT INTO user_amiibos
      (
        user_id,
        amiibo_head,
        amiibo_tail,
        in_wishlist,
        in_collection
      )
      VALUES ($1,$2,$3,$4,false);
      `,
      [userId, head, tail, wishlist]
    );
  }
}

export async function saveCollection(userId, head, tail, collection) {
  const existing = await getUserAmiibo(userId, head, tail);

  if (existing) {
    await pool.query(
      `
      UPDATE user_amiibos
      SET in_collection = $1
      WHERE id = $2;
      `,
      [collection, existing.id]
    );
  } else {
    await pool.query(
      `
      INSERT INTO user_amiibos
      (
        user_id,
        amiibo_head,
        amiibo_tail,
        in_collection,
        in_wishlist
      )
      VALUES ($1,$2,$3,$4,false);
      `,
      [userId, head,tail,collection]
    );
  }
}

export async function getWishlist(userId) {
  const result = await pool.query(
    `
    SELECT *
    FROM user_amiibos
    WHERE user_id=$1
    AND in_wishlist=true;
    `,
    [userId]
  );

  return result.rows;
}

export async function getCollection(userId) {
  const result = await pool.query(
    `
    SELECT *
    FROM user_amiibos
    WHERE user_id=$1
    AND in_collection=true;
    `,
    [userId]
  );

  return result.rows;
}