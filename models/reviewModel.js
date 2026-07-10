import pool from "../config/db.js";

export async function getUserReviews(userId) {
  const sql = `
    SELECT
      review_id,
      user_id,
      amiibo_head,
      amiibo_tail,
      rating,
      review,
      created_at
    FROM reviews
    WHERE user_id = $1
    ORDER BY created_at DESC;
  `;

  const result = await pool.query(sql, [userId]);

  return result.rows;
}

export async function getUserReviewForAmiibo(
  userId,
  amiiboHead,
  amiiboTail
) {
  const sql = `
    SELECT
      review_id,
      user_id,
      amiibo_head,
      amiibo_tail,
      rating,
      review,
      created_at
    FROM reviews
    WHERE user_id = $1
      AND amiibo_head = $2
      AND amiibo_tail = $3
    LIMIT 1;
  `;

  const result = await pool.query(sql, [
    userId,
    amiiboHead,
    amiiboTail
  ]);

  return result.rows[0] || null;
}

export async function saveUserReview({
  userId,
  amiiboHead,
  amiiboTail,
  rating,
  reviewText
}) {
  const existingReview = await getUserReviewForAmiibo(
    userId,
    amiiboHead,
    amiiboTail
  );

  if (existingReview) {
    const sql = `
      UPDATE reviews
      SET
        rating = $1,
        review = $2
      WHERE review_id = $3
        AND user_id = $4
      RETURNING *;
    `;

    const result = await pool.query(sql, [
      rating,
      reviewText,
      existingReview.review_id,
      userId
    ]);

    return result.rows[0];
  }

  const sql = `
    INSERT INTO reviews (
      user_id,
      amiibo_head,
      amiibo_tail,
      rating,
      review
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const result = await pool.query(sql, [
    userId,
    amiiboHead,
    amiiboTail,
    rating,
    reviewText
  ]);

  return result.rows[0];
}

export async function deleteUserReview(reviewId, userId) {
  const sql = `
    DELETE FROM reviews
    WHERE review_id = $1
      AND user_id = $2
    RETURNING review_id;
  `;

  const result = await pool.query(sql, [
    reviewId,
    userId
  ]);

  return result.rows[0] || null;
}