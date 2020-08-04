var express = require('express');
var router = express.Router();
var feedbackController = require('../controllers/feedbackController.js');

/*
 * POST
 */
router.post('/', feedbackController.create);

/*
 * PUT
 */
router.put('/:id', feedbackController.update);


module.exports = router;
