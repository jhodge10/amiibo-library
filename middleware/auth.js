export function requireAuthentication(req, res, next) {
  if (!req.session.user) {
    req.session.errorMessage =
      "You must log in to view that page.";

    return res.redirect("/login");
  }

  return next();
}

export function requireGuest(req, res, next) {
  if (req.session.user) {
    return res.redirect("/amiibos");
  }

  return next();
}