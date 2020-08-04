let express = require('express');
let router = express.Router();
let configurationsController = require('../controllers/configurationsController');

/*
 * GET
 */
router.get('/', configurationsController.list);

/*
 * POST
 */
router.post('/', configurationsController.create);


module.exports = router;