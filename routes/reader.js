const express = require("express");
const router = express.Router();
const { getSingaporeTime } = require("../utils/time");
const cookieParser = require("cookie-parser");

router.use(cookieParser());

// Middleware to update views count with unique view tracking
function updateViewsCount(req, res, next) {
  const { id } = req.params;
  const articleViewKey = `article_view_${id}`;

  // Check if the article has already been viewed in the current session
  if (!req.cookies[articleViewKey]) {
    // Increment views count
    global.db.run(
      "UPDATE Article SET views = views + 1 WHERE id = ?",
      [id],
      (err) => {
        if (err) {
          console.error("Error updating views count:", err);
          next(err); // Pass error to error handling middleware
        } else {
          // Set a cookie to indicate that the article has been viewed for 24 hours
          res.cookie(articleViewKey, true, { maxAge: 24 * 60 * 60 * 1000 });
          next(); // Proceed to next middleware or route handler
        }
      }
    );
  } else {
    next(); // Skip updating views count if already viewed
  }
}

// Middleware to fetch article details and comments
function fetchArticleDetails(req, res, next) {
  const { id } = req.params;

  // SQL - Retrieve article details and likes count
  const articleQuery = `
  SELECT a.id, a.title, a.subtitle, a.body, a.published_date, 
         COUNT(r.userId) as likes, a.views
  FROM Article a
  LEFT JOIN Article_Likes r ON r.articleId = a.id
  WHERE a.id = ?
  GROUP BY a.id;
`;

  // SQL - Retrieve comments for the selected article
  const commentsQuery = `
    SELECT comment_content, comment_date, commenter_name as name
    FROM Comments
    WHERE articleId = ?
    ORDER BY comment_date DESC;
  `;

  // Fetch article details
  global.db.get(articleQuery, id, (err, article) => {
    if (err) {
      next(err);
    } else {
      // Fetch comments
      global.db.all(commentsQuery, id, (err, comments) => {
        if (err) {
          next(err);
        } else {
          // Attach fetched data to request object
          req.article = article;
          req.comments = comments;
          next();
        }
      });
    }
  });
}

// Retrieve all published articles
router.get("/", (req, res, next) => {
  // SQL - Retrieve published article's details (ordered by publication date)
  const articleQuery = `
    SELECT id, title, subtitle, published_date
    FROM Article
    WHERE published_date IS NOT NULL
    ORDER BY published_date DESC;
  `;

  global.db.all(articleQuery, (err, articles) => {
    if (err) {
      // Pass any database error to the global error handler middleware
      next(err);
    } else {
      res.render("reader_home", { articles });
    }
  });
});

// Display selected article
router.get("/:id", updateViewsCount, fetchArticleDetails, (req, res) => {
  // Render article page with fetched article and comments
  res.render("reader_article", {
    article: req.article,
    comments: req.comments,
  });
});

// Update likes count
router.post("/like/:articleId", (req, res, next) => {
  const { articleId } = req.params;

  // Insert new likes into database
  global.db.run(
    "INSERT INTO Article_Likes (articleId, userId) VALUES (?, ?);",
    [articleId, global.userId],
    function (err) {
      if (err) {
        next(err);
      } else {
        // Fetch the article's updated likes count
        global.db.get(
          "SELECT COUNT(userId) as likes FROM Article_Likes WHERE articleId = ?;",
          [articleId],
          function (err, row) {
            if (err) {
              next(err);
            } else {
              // Respond with the updated likes count
              res.json({ likes: row.likes });
            }
          }
        );
      }
    }
  );
});

// Add new comment
router.post("/comments/:articleId", (req, res, next) => {
  const { articleId } = req.params;
  const { name, comment } = req.body;
  const commenterName = name.trim() === "" ? "Mystery" : name.trim();
  const currentTime = getSingaporeTime();

  // Insert new comment into the database
  global.db.run(
    "INSERT INTO Comments (articleId, comment_content, comment_date, commenter_name) VALUES (?, ?, ?, ?);",
    [articleId, comment, currentTime, commenterName],
    function (err) {
      if (err) {
        next(err);
      } else {
        res.redirect(`/reader/${articleId}`);
      }
    }
  );
});

module.exports = router;
