var express = require('express');
var router = express.Router();
var citationController = require('../controllers/citationController.js');

/*
 * GET
 */
router.get('/', citationController.list);

/*
 * GET
 */
router.get('/:id', citationController.show);

router.get('/by_paper_id/:id', citationController.by_paper_id);


router.get('/find_evaluations/:paper_id', citationController.find_evaluations);

/*
 * PUT
 */

//After user chooses to rewrite, updates the assessment array accordingly
router.put('/remove_assessment/:id', citationController.remove_assessment);

//Route for adding assessments to a citation
//  Assessments have values: a rubric, a rubric value, and an optional annotation
router.put('/add_assessment/:id', citationController.add_assessment);


module.exports = router;
