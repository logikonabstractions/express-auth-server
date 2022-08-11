var express = require('express');
const passport = require("passport");
var router = express.Router();

/* GET home page. */

router.get('/success', function(req, res, next) {
  res.status(200).json({"auth":"SUCCESS"})
});
router.get('/failure', function(req, res, next) {
  res.status(400).json({"auth":"FAILURE"})
});

// the callbackURL of the strategy employed.
// Google: Note that this URI must match some config entered in the google's dev pannel as well
router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successRedirect: '/success',
  failureRedirect: '/failure'
}));

router.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
  successRedirect: '/success',
  failureRedirect: '/failure'
}));



module.exports = router;
