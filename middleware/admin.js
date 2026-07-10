export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const user = req.session.user;

    if (!user) {
      req.session.errorMessage =
        "You must log in to view that page.";

      return res.redirect("/login");
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).send(
        "You do not have permission to view this page."
      );
    }

    return next();
  };
}

export const requireAdmin = requireRole("admin");

export const requireCollectorOrAdmin = requireRole(
  "collector",
  "admin"
);