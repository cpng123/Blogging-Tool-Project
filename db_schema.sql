PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS Article (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(50) NOT NULL,
    subtitle VARCHAR(80) NULL,
    body TEXT NOT NULL,
    article_status VARCHAR(20) DEFAULT "unpublished",
    created_date DATETIME NOT NULL,
    published_date DATETIME NULL,
    modified_date DATETIME NULL,
    views INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS Comments (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    commenter_name TEXT DEFAULT "mystery",
    comment_content TEXT NOT NULL,
    comment_date DATETIME NOT NULL,
    articleId INT NOT NULL, -- FK
    FOREIGN KEY (articleId) REFERENCES Article(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Settings (
    id VARCHAR(8) NOT NULL PRIMARY KEY,
    value VARCHAR(80) NOT NULL
);

-- Default data for setting
INSERT INTO Settings VALUES
("title", "Whispers of Wisdom"),
("subtitle", "Echoes from the Mind"),
("author", "Chun Peng");

CREATE TABLE IF NOT EXISTS Article_Likes (
    articleId INT NOT NULL,
    userId GUID NOT NULL,
    PRIMARY KEY (articleId, userId),
    FOREIGN KEY (articleId) REFERENCES Article(id) ON DELETE CASCADE
);

-- Extension - Register & Login - Account Management
CREATE TABLE IF NOT EXISTS User (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);

COMMIT;
