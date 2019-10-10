const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
  res.render('entries/index', { mainOff: true });
});

router.get('/new', function (req, res, next) {
  res.render('users/new');
});

module.exports = router;
