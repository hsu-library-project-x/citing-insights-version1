var express = require('express');
var router = express.Router();
var groupsController = require('../controllers/groupsController.js');

/*
 * GET
 */
router.get('/', groupsController.list);

/*
 * GET
 */
router.get('/findOwner/:id', groupsController.findOwner);
router.get('/findMember/:id', groupsController.findMember);


/*
 * GET
 */
router.get('/:id', groupsController.show);

router.get('/by_email/:email', groupsController.getGroupsByEmail);

/*
 * POST
 */
router.post('/', groupsController.create);

/*
 * PUT
 */
router.put('/pendingAdd', groupsController.pendingAdd);


/*
 * PUT
 */
router.put('/pendingAccept/', groupsController.pendingAccept);

/*
 * PUT
 */
router.put('/pendingReject/', groupsController.pendingReject);

/*
 * PUT
 */
router.put('/update/', groupsController.update);


/*
 * PUT
 */
router.put('/removeMember/', groupsController.removeMember);

/*
 * DELETE
 */
router.delete('/:id', groupsController.remove);

module.exports = router;
