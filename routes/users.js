const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user');
const { isUser, sessionChecker } = require('../middleware/auth');

router
  .route('/new')
  .get(function(req, res, next) {
    res.render('users/new', { regOff: true });
  })
  .post(isUser, async (req, res, next) => {
    const newUser = new User({
      name: req.body.username,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10)
    });
    await newUser.save();
    req.session.user = newUser;
    res.render('users/success', { newUser, regOff: true, loginOff: true });
  });

router
  .route('/login')
  .get(function(req, res, next) {
    res.render('users/login', { loginOff: true });
  })
  .post(async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ name: username });
    if (!user) res.redirect('./login');
    const ok = a => {
      if (a) {
        req.session.user = user;
        res.render('entries/index', { user, loginOn: true, mainOff: true });
      } else {
        res.redirect('./login');
      }
    };
    bcrypt.compare(password, user.password).then(ok);
  });

router.get('/logout', async (req, res, next) => {
  // if (req.session.user && req.cookies.user_sid) {
  //   try {
  res.clearCookie('user_sid');
  await req.session.destroy();
  res.redirect('/');
  //   }
  //   catch (error) {
  //     next(error);
  //   }
  // } else {
  //   res.redirect('/login');
  // }
});

module.exports = router;
