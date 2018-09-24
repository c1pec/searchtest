var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (req.session.isAuth) {
    res.redirect('/main');
  }
  else res.render('auth');
});

router.post('/', function(req, res, next) {
  if (req.body.pwd == 'admin') {
    req.session.isAuth = true;
    res.redirect('/main');
  }
  else {
    res.render('auth', { msg: 'Invalid password' });
  }
});

module.exports = router;