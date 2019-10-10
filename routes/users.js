const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user');

router
  .route('/new')
  .get(function(req, res, next) {
    res.render('users/new', { regOff: true });
  })
  .post(async (req, res, next) => {
    const newUser = new User({
      name: req.body.username,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10)
    });
    await newUser.save();
    res.render('users/success', { newUser, regOff: true, loginOff: true });
  });

router
  .route('/login')
  .get(function(req, res, next) {
    res.render('users/login', { loginOff: true });
  })
  .post(async (req, res) => {
    console.log(1);

    const { username, password } = req.body;

    const user = await User.findOne({ name: username });
    bcrypt.compare(password, user.password).then(a => console.log(a));
    if (!user) {
      res.redirect('./login');
      // } else if (!user.validPassword(password)) {
    } else if (!bcrypt.compare(password, user.password)) {
      res.redirect('./login');
    } else {
      req.session.user = user;
      console.log(req.session);
      res.render('entries/index', { user, loginOn: true, mainOff: true });
    }
  });

router.get('/logout', async (req, res, next) => {
  console.log('------------------');

  console.log(req.session);

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
