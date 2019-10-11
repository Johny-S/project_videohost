const express = require('express');
const multer = require('multer');
const router = express.Router();
const { isUser, sessionChecker } = require('../middleware/auth');

router.get('/', sessionChecker, function(req, res, next) {
  res.render('entries/index', { mainOff: true });
});

router.get('/new', function(req, res, next) {
  res.render('users/new');
});

router.post('/upload', type, (req, res) => {
  console.log(req.body);
  console.log(req.file);
  res.send();
});

module.exports = router;
