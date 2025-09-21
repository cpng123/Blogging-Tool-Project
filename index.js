const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const crypto = require("crypto");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

// Express instance
const app = express();
const port = 3000;

// Passport configuration
require("./config/passport")(passport);

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Session & Flash setup
app.use(
  session({
    secret: "magic", // Encryption Session Key
    resave: false, 
    saveUninitialized: true, 
  })
);
app.use(flash()); // Flash Messaging

// Passport middleware
app.use(passport.initialize());
// Enable persistent login session
app.use(passport.session());

// Middleware to set flash messages in response locals
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  res.locals.user = req.user;
  next();
});

// Database connection
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
  } else {
    console.log("Database connected");
    db.run("PRAGMA foreign_keys=ON");
  }
});

// Global variables
global.db = db;
// Generate unique user ID
global.userId = crypto.randomUUID();
global.settings = {};

// Middleware to fetch and store settings
app.use((req, res, next) => {
  db.all("SELECT id, value FROM Settings", (err, rows) => {
    if (err) {
      console.error("Error fetching settings:", err);
      return next(err);
    }
    // Convertion of rows to object
    const settings = rows.reduce((acc, row) => {
      acc[row.id] = row.value;
      return acc;
    }, {});
    // Make settings available to all views
    res.locals.settings = settings; 
    next();
  });
});

// Route setup - Main Home
app.get("/", (req, res) => {
  res.render("main_home");
});

// Route setup - Authentication - Extension
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// Route setup - Author
const authorRoutes = require("./routes/author");
app.use("/author", authorRoutes);

// Route setup - Reader
const readerRoutes = require("./routes/reader");
app.use("/reader", readerRoutes);

// Start the server
app.listen(port, () => {
  // Blue color and underline
  const link = `\x1b[34m\x1b[4mhttp://localhost:${port}\x1b[0m`;
  console.log(`Server running at ${link}`);
});