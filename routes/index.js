const express = require('express');
const router = express.Router();
const { isUser, sessionChecker } = require('../middleware/auth');

router.get('/', sessionChecker, function(req, res, next) {
  res.render('entries/index', { mainOff: true });
});

router.get('/new', function(req, res, next) {
  res.render('users/new');
});

module.exports = router;
