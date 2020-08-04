var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');
var passport = require("passport");

var { generateToken, sendToken } = require('../utils/token.utils');
require('../passport')();

/*
 * GET
 */
router.get('/', userController.list);

/*
 * GET
 */
router.get('/:id', userController.show);

/*
 * LOGIN - POST
 */

//router.post('/auth', userController.login);


router.route('/auth')
  .post(passport.authenticate(
    'google-token',
    { session: false }),
    function (req, res, next) {
      if (!req.user) {
        return res.send(401, 'User Not Authenticated');
      }
      req.session.user = req.user;
      req.auth = {
        id: req.user.id
      };
      next();
    }, generateToken, sendToken);

/*
 * PUT
 */
router.put('/:id', userController.update);

/*
 * DELETE
 */
router.delete('/:id', userController.remove);

module.exports = router;
