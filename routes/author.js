const express = require("express");
const router = express.Router();
const { getSingaporeTime } = require("../utils/time");
const isAuthenticated = require("../utils/authMiddleware");

// Use authentication middleware for all author routes
router.use(isAuthenticated);

// Retrieves all articles list (ordered by publication date)
router.get("/", (req, res, next) => {
  const query = `
    SELECT id, title, subtitle, created_date, modified_date, published_date, views,
      (SELECT COUNT(userId) FROM Article_Likes WHERE articleId = id) AS likes
    FROM Article;
  `;
  global.db.all(query, (err, articles) => {
    if (err) return next(err);
    res.render("author_home", { articles });
  });
});

// Display create new article page.
router.get("/new", (req, res) => {
  res.render("author_edit");
});

// Create new article and redirects to author home page.
router.post("/new", (req, res, next) => {
  const { title, subtitle, body, article_status } = req.body;
  // Get current time
  const currentTime = getSingaporeTime();

  const query = `
    INSERT INTO Article (title, subtitle, body, created_date, article_status) 
    VALUES (?, ?, ?, ?, ?);
  `;

  global.db.run(
    query,
    [title, subtitle, body, currentTime, article_status || "unpublished"],
    (err) => {
      if (err) return next(err);
      res.redirect("/author");
    }
  );
});

// Display edit article page.
router.get("/edit/:id", (req, res, next) => {
  const { id } = req.params;
  const query = `
    SELECT a.id, a.title, a.subtitle, a.body, a.created_date, a.modified_date, a.published_date, a.article_status,
           COUNT(r.userId) AS likes
    FROM Article a 
    LEFT JOIN Article_Likes r ON r.articleId = a.id 
    WHERE a.id = ?;
  `;
  global.db.get(query, id, (err, article) => {
    if (err) return next(err);
    res.render("author_edit", article);
  });
});

// Updates the edited article and redirect to author home page.
router.post("/edit/:id", (req, res, next) => {
  const { id } = req.params;
  const { title, subtitle, body, article_status } = req.body;

  const currentTime = getSingaporeTime();

  const query = `
    UPDATE Article 
    SET title = ?, subtitle = ?, body = ?, modified_date = ?, 
      article_status = COALESCE(?, article_status) 
    WHERE id = ?;
  `;

  global.db.run(
    query,
    [title, subtitle, body, currentTime, article_status, id],
    (err) => {
      if (err) return next(err);
      res.redirect("/author");
    }
  );
});

// Publishes article and update the published date.
router.post("/publish/:articleId", (req, res, next) => {
  const { articleId } = req.params;

  const currentTime = getSingaporeTime();

  const query = `
    UPDATE Article 
    SET published_date = ?, article_status = "published"
    WHERE id = ?;
  `;

  global.db.run(query, [currentTime, articleId], (err) => {
    if (err) return next(err);
    res.sendStatus(204);
  });
});

// Delete article.
router.delete("/delete/:articleId", (req, res, next) => {
  const { articleId } = req.params;
  const query = "DELETE FROM Article WHERE id = ?;";
  global.db.run(query, [articleId], (err) => {
    if (err) return next(err);
    res.sendStatus(204);
  });
});

// Fetches the initial blog settings and render it.
router.get("/settings", (req, res, next) => {
  const query =
    'SELECT id, value FROM Settings WHERE id IN ("title", "subtitle", "author")';
  global.db.all(query, (err, rows) => {
    if (err) {
      console.error("Error fetching settings:", err);
      return next(err);
    }

    const settings = {
      title: "",
      subtitle: "",
      author: "",
      ...rows.reduce((acc, row) => ({ ...acc, [row.id]: row.value }), {}),
    };

    res.render("author_settings", { settings });
  });
});

// Updates blog settings and redirects to the author home page.
router.post("/settings", (req, res, next) => {
  const { title, subtitle, author } = req.body;
  const query = `
    UPDATE Settings 
    SET value = CASE id 
                WHEN "title" THEN ? 
                WHEN "subtitle" THEN ? 
                WHEN "author" THEN ? 
                ELSE value 
                END 
    WHERE id IN ("title", "subtitle", "author");
  `;
  global.db.run(query, [title, subtitle, author], (err) => {
    if (err) {
      console.error("Error updating settings:", err);
      return next(err);
    }
    res.redirect("/author");
  });
});

module.exports = router;
