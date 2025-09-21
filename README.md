### CM2040 Database Networks and the Web
#### Installation requirements
The following modules have been downloaded for this project:
bcrypt
body-parser
connect-flash
cookie-parser
ejs
express
express-session
passport
passport-local
path
sqlite3

### Account Registration Requirements

When first running the application, you must register an account. Please note the following requirements for creating your account:

- **Username**: Must be at least **5 characters** long.
- **Password**: Must be at least **8 characters** long and include:
  - At least one **uppercase letter** (A-Z)
  - At least one **lowercase letter** (a-z)
  - At least one **number** (0-9)

#### Styling
Most of the styling in this application is done using the Bootstrap library. This ensures a responsive and visually appealing design with minimal effort.

#### Using this template

This template sets you off in the right direction for your coursework. To get started:

- Run `npm install` from the project directory to install all the node packages.

- Run `npm run build-db` to create the database on Mac or Linux
  or run `npm run build-db-win` to create the database on Windows

- Run `npm run start` to start serving the web app (Access via http://localhost:3000)

Test the app by browsing to the following routes:
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
