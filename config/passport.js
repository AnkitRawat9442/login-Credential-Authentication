// const LocalStrategy = require('passport-local').Strategy;
// const mongoose = require('mongoose');
// const bcrypt = require ('bcryptjs');

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/User');


// module.exports = function(passport) {
// passport.use(new LocalStrategy({usernamefield: 'email'}, (email, password, done) => {
//     User.findOne({ email: email }).then((user) => {
//       console.log(user);
//        // email check
//         if (!user) { return done(null, false, { message: 'Email not registered' }); }
       
//           console.log(user);

//        // match password
//             bcrypt.compare(password ,user.password, function (err, ismatch) {
//                 if(err) throw err;
//                 if (ismatch) {
//                     console.log("It matches!")
//                     return done(null , user);
//                 }
//                 else {
//                     console.log("Incorrect password")
//                     return done(null, false, { message: 'Incorrect password' });
//                 }
//             });
        
//     }).catch(error => console.log(error));
// }));

// // passport.serializeUser((user, done) =>{
// //     process.nextTick(()=> {
// //       done(null, { id: user.id, username: user.username });
// //     });
//   });
  
//   passport.deserializeUser((user, done) =>{
//     process.nextTick(()=> {
//       return done(null, user);
//     });
//   });
// }

// const LocalStrategy = require('passport-local').Strategy;
// const bcrypt = require('bcryptjs');

// // Load User model
// const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};