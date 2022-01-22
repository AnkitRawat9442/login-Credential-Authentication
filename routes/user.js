const express = require("express");
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require("../models/User");

const saltRounds = 10;


router.get("/register", (req, res) => {

    res.render("register");

});
router.get("/signin", (req, res) => {

    res.render("signin");

});

// Register handle

router.post("/register", (req, res) => {
    // console.log(req.body);
    let { name, email, password, password2 } = req.body;
    let errors = [];

    // check required field 
    if (!name || !email || !password || !password2) {
        errors.push({ msg: "Please fill in all the field" });
    }
    // check for pass lenght
    else {
        if (password.length < 6) {
            console.log(password.length);
            errors.push({ msg: "Password should be atleast 6 character" });
        }
        // check for password
        if (password !== password2) {
            password = '';
            password2 = '';
            errors.push({ msg: "Password does not match" });
        }
    }

    if (errors.length > 0) {

        // console.log(errors);
        // console.log(password);
        // console.log(password2);
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2,

        });
    } else {
        User.findOne({ email: email })
            .then((user) => {
                if (user) {
                    errors.push({ msg: "Email already registered" });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2,

                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    // bcrypt.genSalt(10 , ()=>{
                    //     bcrypt.hash(newUser.password, salt,  (err , hash)=>{
                    //         if(err) {
                    //             throw err;
                    //         }
                    //         newUser.password = hash;
                    //         // save newUser
                    //         newUser.save().then((user)=>{
                    //             res.redirect('/login');
                    //         }).catch((err)=>{
                    //             console.log(err)
                    //         });
                    //     })
                    // })

                    // password hashing 
                    bcrypt.genSalt(saltRounds, function (err, salt) {
                        bcrypt.hash(newUser.password, salt, function (err, hash) {
                            // returns hash

                            newUser.password = hash;
                            // save newUser
                            newUser.save().then((user) => {
                                req.flash('success_msg' , 'You are successfull registered');
                                res.redirect('/user/login');
                            }).catch((err) => {
                                console.log(err)
                            });
                        });
                    });


                }
            });


    }
});


// handle login 

router.post("/login" , (req , res , next)=>{
   
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/user/login',
        failureFlash :true,
      })(req , res , next);
      console.log(req.body);
})

// logout form
router.get('/logoutform',(req , res)=>{
    res.render("logoutform");
})

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/user/login');
  });

module.exports = router;
