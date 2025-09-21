# 📝 CM2040 Database Networks and the Web – Blogging Tool

A secure blogging platform built with **Node.js**, **Express.js**, **SQLite3**, and **Passport.js**, featuring article management, comments, user authentication, and responsive views with EJS and Bootstrap.  
This project was developed as part of the **CM2040 – Databases, Networks & the Web** module.

📺 **[Watch Demo Video](https://youtu.be/RST2-K4jG58)**

---

## ✨ Features

- **Article Management**
  - Create, edit, delete, and publish/unpublish articles
  - Articles include title, subtitle, body, and view counter

- **Comments**
  - Readers can add comments to articles
  - Linked to article ID with cascade delete

- **Settings**
  - Custom blog metadata (title, subtitle, author)

- **User Authentication**
  - Registration & Login system (Passport.js local strategy)
  - Secure password hashing with bcrypt
  - Session management with express-session
  - Flash messages for login/logout feedback

- **Likes**
  - Readers can like articles
  - Article-likes tracked with composite keys

- **Secure Routes**
  - Only logged-in authors can access article management
  - Middleware ensures protected access

---

## 📂 Project Structure

```
│── assets/ # Static files (images, CSS, background)
│── config/ # Passport.js config
│── public/ # Public CSS/JS
│── routes/ # Express routes (author, reader, auth)
│── views/ # EJS templates (layouts, home, article pages)
│── db_schema.sql # Database schema
│── database.db # SQLite3 database
│── index.js # App entry point
│── package.json
│── README.md
```

---

## 🔧 Installation Requirements

The following modules must be installed for this project:

- bcrypt  
- body-parser  
- connect-flash  
- cookie-parser  
- ejs  
- express  
- express-session  
- passport  
- passport-local  
- path  
- sqlite3  

Install them with: `npm install`

---

### Account Registration Requirements

When first running the application, you must register an account. Please note the following requirements for creating your account:

- **Username**: Must be at least **5 characters** long.
- **Password**: Must be at least **8 characters** long and include:
  - At least one **uppercase letter** (A-Z)
  - At least one **lowercase letter** (a-z)
  - At least one **number** (0-9)

---

### Styling
Most of the styling in this application is done using the Bootstrap library. This ensures a responsive and visually appealing design with minimal effort.

---

### 🚀 Getting Started

1. Run npm install from the project directory to install all Node packages.

2. Build the database:
  * On Mac/Linux: `npm run build-db`
  * On Windows: `npm run build-db-win`

3. Start the web app: `npm run start`

4. Open the app at: http://localhost:3000

---

### 🌐 Routes

**Main Home Page**
- http://localhost:3000

**Reader - Home Page**
- http://localhost:3000/reader

**Extension - Register Account**
- http://localhost:3000/auth/register

**Extension - Login Account**
- http://localhost:3000/auth/login

**Author - Home Page**
- http://localhost:3000/author

**Author - Create Article Page**
- http://localhost:3000/author/new

**Arthor - Settings Page**
- http://localhost:3000/author/settings

**Author - Edit Page**
- http://localhost:3000/author/edit/1

**Reader - Article Page**
- http://localhost:3000/reader/1

---

### 🔒 Security

* Passwords are hashed with **bcrypt** (cost factor 10) before being stored.

* **express-session** manages user sessions securely.

* Unauthorized access is blocked using custom middleware.