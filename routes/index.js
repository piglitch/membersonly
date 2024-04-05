var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../model/user');
const Message = require('../model/messages');
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy; 
require('dotenv').config();

/* GET home page. */

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message:"Incorrect username" });
      };
      const match =  await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      };
      return done(null, user);
    } catch (error) {
      return done(error);
    };
  })
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async(id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
const messageDefault = {
  username: 'test1',
  message: "12345",
  timestamp: Date()
} 
router.get("/", async(req, res, next) => {
  const messages = await Message.find().sort({timestamp: 1}).populate('username').exec();
  res.render("index", { user: req.user, messages: messages })
});
router.get("/send-messages", (req, res) => {
  res.render("messagesForm", { user: req.user, messages: messageDefault })
});
router.get("/sign-up", (req, res) => {
  res.render("signup", { user: req.user });
});
router.get("/log-out", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
router.post("/sign-up", async(req, res, next) => {
  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    if (err) {
      next(err);
    }
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      admin: req.body.secret === process.env.SECRET
    });
    const result = await user.save();
    res.redirect("/");
  })
});
router.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);
router.post("/send-messages", async(req, res, next) => {
  try {
    const message = new Message({
      username: req.user._id,
      message: req.body.message,
      timestamp: new Date()
    });  
    const newMessage = await message.save();    
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// router.post(
//   "/send-messages",
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/"
//   })
// );


module.exports = router;
