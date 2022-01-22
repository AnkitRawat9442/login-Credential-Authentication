const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();



const PORT = process.env.PORT || 3000;




// config database
const db = require("./config/key").MongoURI;

mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log("mongodb connected ...."))
    .catch(err => console.log(err));
// passport config
require('./config/passport')(passport);

// ejs 
app.use(expressLayouts);
app.set('view engine', "ejs");

// body - parser
app.use(express.urlencoded({ extended: false }));


//express session 
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true

}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash for meassage 
app.use(flash());

// creating global var for messages 
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// use public folder
app.use("/public", express.static("public"));


// config routes 
app.use('/', require("./routes/index"));
app.use('/user', require("./routes/user"));




app.listen(PORT, () => {
    console.log("Server is running on port" + PORT);
});
