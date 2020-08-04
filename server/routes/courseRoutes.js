var express = require('express');
var router = express.Router();
var courseController = require('../controllers/courseController.js');

/*
 * GET // :id is user_id
 */
router.get('/:id', courseController.list);

/*
 * GET
 */
router.get('/:id', courseController.show);

router.get('/by_email_and_ID/:email/:id', courseController.sharedCourses);

router.get('/getCoursesByGroup/:groupId', courseController.getCoursesByGroup)

/*
 * POST
 */

 router.post('/', courseController.create);

/*
 * PUT
 */
router.put('/:id', courseController.update);

router.put('/update/:id', courseController.updateGroup);

router.put('/removeGroup/:id', courseController.removeGroup);

/*
 * DELETE
 */
router.delete('/:id', courseController.remove);

module.exports = router;
