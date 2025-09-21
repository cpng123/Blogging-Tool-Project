const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

module.exports = function(passport) {
  // Utilise local strategy for authentication
  passport.use(new LocalStrategy(
    function(inputUsername, inputPassword, done) {
      const sqlquery = `SELECT * FROM User WHERE username = ?`;
      db.get(sqlquery, [inputUsername], (err, userRecord) => {
        if (err) return done(err);
        if (!userRecord) return done(null, false, { message: 'User not found!' });
        
        // Compare the input password with the stored hashed password
        bcrypt.compare(inputPassword, userRecord.password, (err, isMatch) => {
          if (err) return done(err); // Handle comparison errors
          if (isMatch) return done(null, userRecord); // Password matches
          else return done(null, false, { message: 'Incorrect Password!' });
        });
      });
    }
  ));

  // Serialize user information into the session
  passport.serializeUser(function(userRecord, done) {
    // Store user ID in session
    done(null, userRecord.id);
  });

  // Deserialize user information from the session
  passport.deserializeUser(function(id, done) {
    const sqlquery = `SELECT * FROM User WHERE id = ?`;
    db.get(sqlquery, [id], (err, userRecord) => {
      // Retrieve user record by ID
      done(err, userRecord);
    });
  });
};