import pool from "../config/db.js";

const VALID_ROLES = [
  "user",
  "collector",
  "admin"
];

const VALID_REQUEST_STATUSES = [
  "Submitted",
  "Under Review",
  "Approved",
  "Rejected",
  "Completed"
];

export async function showUserDashboard(req, res, next) {
  try {
    const userId = req.session.user.userId;

    const result = await pool.query(
      `
        SELECT
          r.request_id,
          r.subject,
          r.message,
          r.status,
          r.created_at,
          r.updated_at,
          COALESCE(
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'status', rh.status,
                'changed_at', rh.changed_at
              )
              ORDER BY rh.changed_at
            ) FILTER (
              WHERE rh.history_id IS NOT NULL
            ),
            '[]'
          ) AS history
        FROM requests r
        LEFT JOIN request_history rh
          ON rh.request_id = r.request_id
        WHERE r.user_id = $1
        GROUP BY r.request_id
        ORDER BY r.created_at DESC;
      `,
      [userId]
    );

    return res.render("dashboard", {
      title: "My Dashboard",
      requests: result.rows
    });
  } catch (error) {
    return next(error);
  }
}

export async function submitRequest(req, res, next) {
  const client = await pool.connect();

  try {
    const userId = req.session.user.userId;
    const subject = req.body.subject?.trim() || "";
    const message = req.body.message?.trim() || "";

    if (subject.length < 3 || subject.length > 100) {
      req.session.errorMessage =
        "Subject must contain between 3 and 100 characters.";

      return res.redirect("/dashboard");
    }

    if (message.length < 10 || message.length > 1000) {
      req.session.errorMessage =
        "Message must contain between 10 and 1000 characters.";

      return res.redirect("/dashboard");
    }

    await client.query("BEGIN");

    const requestResult = await client.query(
      `
        INSERT INTO requests (
          user_id,
          subject,
          message,
          status
        )
        VALUES ($1, $2, $3, 'Submitted')
        RETURNING request_id;
      `,
      [
        userId,
        subject,
        message
      ]
    );

    const requestId =
      requestResult.rows[0].request_id;

    await client.query(
      `
        INSERT INTO request_history (
          request_id,
          status,
          changed_by
        )
        VALUES ($1, 'Submitted', $2);
      `,
      [
        requestId,
        userId
      ]
    );

    await client.query("COMMIT");

    req.session.successMessage =
      "Your request was submitted.";

    return res.redirect("/dashboard");
  } catch (error) {
    await client.query("ROLLBACK");

    return next(error);
  } finally {
    client.release();
  }
}

export async function showAdminDashboard(req, res, next) {
  try {
    const [
      usersResult,
      requestsResult,
      reviewsResult
    ] = await Promise.all([
      pool.query(
        `
          SELECT
            user_id,
            username,
            email,
            role,
            created_at
          FROM users
          ORDER BY created_at DESC;
        `
      ),

      pool.query(
        `
          SELECT
            r.request_id,
            r.subject,
            r.message,
            r.status,
            r.created_at,
            r.updated_at,
            u.username,
            u.email
          FROM requests r
          JOIN users u
            ON u.user_id = r.user_id
          ORDER BY r.created_at DESC;
        `
      ),

      pool.query(
        `
          SELECT
            rv.review_id,
            rv.rating,
            rv.review,
            rv.amiibo_head,
            rv.amiibo_tail,
            rv.created_at,
            u.username
          FROM reviews rv
          JOIN users u
            ON u.user_id = rv.user_id
          ORDER BY rv.created_at DESC;
        `
      )
    ]);

    return res.render("admin/dashboard", {
      title: "Admin Dashboard",
      users: usersResult.rows,
      requests: requestsResult.rows,
      reviews: reviewsResult.rows,
      validRoles: VALID_ROLES,
      validRequestStatuses:
        VALID_REQUEST_STATUSES
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateUserRole(req, res, next) {
  try {
    const userId = Number.parseInt(
      req.params.userId,
      10
    );

    const role = req.body.role;

    if (
      !Number.isInteger(userId) ||
      !VALID_ROLES.includes(role)
    ) {
      req.session.errorMessage =
        "Invalid user role update.";

      return res.redirect("/admin");
    }

    await pool.query(
      `
        UPDATE users
        SET role = $1
        WHERE user_id = $2;
      `,
      [
        role,
        userId
      ]
    );

    /*
     * If the admin edits their own role, update
     * the session so the navbar stays accurate.
     */
    if (req.session.user.userId === userId) {
      req.session.user.role = role;
    }

    req.session.successMessage =
      "The user role was updated.";

    return res.redirect("/admin");
  } catch (error) {
    return next(error);
  }
}

export async function updateRequestStatus(
  req,
  res,
  next
) {
  const client = await pool.connect();

  try {
    const requestId = Number.parseInt(
      req.params.requestId,
      10
    );

    const status = req.body.status;

    if (
      !Number.isInteger(requestId) ||
      !VALID_REQUEST_STATUSES.includes(status)
    ) {
      req.session.errorMessage =
        "Invalid request status update.";

      return res.redirect("/admin");
    }

    await client.query("BEGIN");

    const updateResult = await client.query(
      `
        UPDATE requests
        SET
          status = $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE request_id = $2
        RETURNING request_id;
      `,
      [
        status,
        requestId
      ]
    );

    if (updateResult.rowCount === 0) {
      await client.query("ROLLBACK");

      req.session.errorMessage =
        "The request could not be found.";

      return res.redirect("/admin");
    }

    await client.query(
      `
        INSERT INTO request_history (
          request_id,
          status,
          changed_by
        )
        VALUES ($1, $2, $3);
      `,
      [
        requestId,
        status,
        req.session.user.userId
      ]
    );

    await client.query("COMMIT");

    req.session.successMessage =
      "The request status was updated.";

    return res.redirect("/admin");
  } catch (error) {
    await client.query("ROLLBACK");

    return next(error);
  } finally {
    client.release();
  }
}

export async function deleteReviewAsAdmin(
  req,
  res,
  next
) {
  try {
    const reviewId = Number.parseInt(
      req.params.reviewId,
      10
    );

    if (!Number.isInteger(reviewId)) {
      req.session.errorMessage =
        "The selected review is invalid.";

      return res.redirect("/admin");
    }

    await pool.query(
      `
        DELETE FROM reviews
        WHERE review_id = $1;
      `,
      [reviewId]
    );

    req.session.successMessage =
      "The review was removed.";

    return res.redirect("/admin");
  } catch (error) {
    return next(error);
  }
}