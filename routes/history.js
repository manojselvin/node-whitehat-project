var express = require('express');
var router = express.Router();
var History = require('../server/models/history');
var path = require("path");


// GET route for reading data
router.get('/', function (req, res, next) {
  if (req.session.user) {
    res.redirect('/users/profile');
  } else {
    res.render('auth/index', {user: undefined});
  }
  
  // return res.sendFile(path.join(__dirname + '/../server/views/auth/index.html'));
});


//POST route for updating data
router.post('/', function (req, res, next) {
    console.log(req.body);
  // confirm that user typed same password twice
  if (req.body.cityName) {
    res.status(400).send({status: 'error', msg: 'Passwords don\'t match'});
  }

  if (req.body.email &&
    req.body.name &&
    req.body.mobile &&
    req.body.city &&
    req.body.country &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      email: req.body.email,
      name: req.body.name,
      city: req.body.city,
      country: req.body.country,
      mobile: req.body.mobile,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
    }

    User.create(userData, function (error, user) {
      if (error) {
          res.status(400).send({status: 'error', msg: 'Unable to create account!'});
      } else {
        req.session.userId = user._id;
        req.session.user = user;
        res.status(200).send({status: 'success', msg: 'Logged In!', data: {redirectUrl: '/users/profile'}});
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        res.status(401).send({status: 'error', msg: 'Invalid email or password'});
      } else {
        req.session.userId = user._id;
        req.session.user = user;
        res.status(200).send({status: 'success', msg: 'Successfully Logged In!', data: {redirectUrl: '/weather'}});
      }
    });
  } else {
    res.status(400).send({status: 'error', msg: 'Invalid email or password'});
  }
})

// GET route after registering
router.get('/profile', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        res.status(400).send({status: 'error', msg: 'Invalid User!'});
      } else {
        if (user === null) {
          res.render('auth/index', {user: undefined});
          // return res.sendFile(path.join(__dirname + '/../server/views/auth/index.html'));
        } else {
          res.render('users/profile', {user: req.session.user});
          // return res.status(200).sendFile(path.join(__dirname + '/../server/views/users/profile.html'));
          // return res.status(200).send('<h1>Name: </h1>' + user.name + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
        }
      }
    });
});

// GET for logout logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        res.send({status: 'error', msg: 'Unable to logout!'})
      } else {
        return res.redirect('/users');
      }
    });
  }
});

module.exports = router;