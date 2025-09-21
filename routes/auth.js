const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");

// Middleware to render views with errors and form data
const renderWithErrors = (res, view, errors, formData) => {
  res.render(view, { errors, ...formData });
};

// Regex for email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Regex for password complexity validation
const passwordComplexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

// Route to Login Page
router.get("/login", (req, res) => {
  res.render("login", {
    // Retain username if flash message exists
    username: req.flash("username") || "",
    errors: req.flash("error"),
  });
});

// Handle login with Passport.js
router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  // Validation checks for login fields
  if (!username || !password) {
    req.flash("error", "ALL fields are required!");
    req.flash("username", username);
    return res.redirect("/auth/login");
  }

  // Passport Check & Authentication
  passport.authenticate("local", {
    successRedirect: "/author",
    failureRedirect: "/auth/login",
    failureFlash: true,
  })(req, res, next);
});

// Route to Registration Page
router.get("/register", (req, res) => {
  res.render("register", {
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    errors: [],
  });
});

// Handle registration form submission
router.post("/register", (req, res) => {
  const { username, email, password, password_confirm } = req.body;
  var errors = [];
  // Validation checks for registration fields
  if (!username || !email || !password || !password_confirm) {
    errors.push({ msg: "ALL fields are required!" });
  }
  if (username.length < 5) {
    errors.push({ msg: "Username must be at least 5 characters" });
  }
  if (!emailRegex.test(email)) {
    errors.push({ msg: "Please provide a valid email address" });
  }
  if (password !== password_confirm) {
    errors.push({ msg: "Passwords do not match" });
  }
  if (password.length < 8) {
    errors.push({ msg: "Password must be at least 8 characters" });
  }
  if (!passwordComplexityRegex.test(password)) {
    errors.push({
      msg: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    });
  }
  // Render the registration page with errors if validation fails
  if (errors.length > 0) {
    return renderWithErrors(res, "register", errors, {
      username,
      email,
      password,
      password_confirm,
    });
  }

  try {
    // Check if username or email already exists in the database
    const query = "SELECT * FROM User WHERE username = ? OR email = ?";
    db.get(query, [username, email], (err, user) => {
      if (err) throw err;
      if (user) {
        errors.push({ msg: "Username or email already exists" });
        return renderWithErrors(res, "register", errors, {
          username,
          email,
          password,
          password_confirm,
        });
      }

      // Hash the password before saving the user into database
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;
        const newUser = { username, email, password: hash };
        const insertQuery =
          "INSERT INTO User (username, email, password) VALUES (?, ?, ?)";

        db.run(
          insertQuery,
          [newUser.username, newUser.email, newUser.password],
          (err) => {
            if (err) throw err;
            req.flash("success_msg", "Register Successful!");
            res.redirect("/auth/login");
          }
        );
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
