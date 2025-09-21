const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
      return next();
  }

  console.warn(`Unauthorized access attempt to: ${req.originalUrl}`);
  return res.redirect("/auth/login");
};

module.exports = isAuthenticated;