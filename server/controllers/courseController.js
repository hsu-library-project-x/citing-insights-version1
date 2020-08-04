let courseModel = require('../models/courseModel.js');
let assignmentModel = require('../models/assignmentModel.js');
let citationModel = require('../models/citationModel.js');
let paperModel = require('../models/paperModel.js');
/**
 * courseController.js
 *
 * @description :: Server-side logic for managing courses.
 */
module.exports = {

    /**
     * courseController.list()
     * Lists BY USER ID
     */

    list: function (req, res) {
        if(req.session.user !== undefined) {

        let id = req.params.id;
        courseModel.find({user_id: id}, function (err, courses) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting course.',
                    error: err
                });
            }
          return res.json(courses);
        });
    }
    },

    //courseController.get_groups
    get_groups: function(req,res){
        let id = req.params.id;

        if (req.session.user !== undefined) {
            courseModel.findOne({_id: id}, function (err, course) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting assignment.',
                        error: err
                    });
                }
                if (!course) {
                    return res.status(404).json({
                        message: 'No such course'
                    });
                }

                if(course.group_ids === undefined){
                    return res.json({});
                }else{
                    return res.json(course.group_ids);
                }


            });
        }
    },

    sharedCourses: function(req, res){
        if (req.session.user !== undefined) {
            let email = req.params.email;
            let user_id = req.params.id; 

            // if user is a group member and NOT the owner of the course 
            courseModel.find({ 
                $and : [
                {members: {$in: email}},
                {user_id: {$ne: user_id}}
            ]}, function (err, courses) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting courses.',
                        error: err
                    });
                }
                if (!courses) {
                    return res.status(404).json({
                        message: 'No such course'
                    });
                }
                return res.status(201).json(courses);
            });
        }
    },

    /**
     * courseController.show()
     */
    show: function (req, res) {
        if(req.session.user !== undefined) {

        let id = req.params.id;
        courseModel.findOne({_id: id}, function (err, course) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting course.',
                    error: err
                });
            }
            if (!course) {
                return res.status(404).json({
                    message: 'No such course'
                });
            }
            return res.json(course);
        });
    }
    },

    /**
     * courseController.create()
     */
    create: function (req, res) { 
    
        if(req.session.user !== undefined) {

        let course = new courseModel({
			name : req.body.name,
            course_note: req.body.note,
			user_id : req.body.user_id,

        });


        course.save(function (err, course) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating course',
                    error: err
                });
            }
            return res.status(201).json(course);
        });
    }
    },

    /**
     * courseController.update()
     */
    update: function (req, res) {
        if(req.session.user !== undefined) {

        let id = req.params.id;
        courseModel.findOne({_id: id}, function (err, course) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting course',
                    error: err
                });
            }
            if (!course) {
                return res.status(404).json({
                    message: 'No such course'
                });
            }

            course.name = req.body.name ? req.body.name : course.name;
			course.user_id = req.body.user_id ? req.body.user_id : course.user_id;
			
            course.save(function (err, course) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating course.',
                        error: err
                    });
                }

                return res.json(course);
            });
        });
    }
    },

    updateGroup: function (req, res) {
        if (req.session.user !== undefined) {
            let id = req.params.id;
            
            courseModel.findOneAndUpdate({ _id: id },
                {  $push: {group_ids: req.body.group_id, members: req.body.members} }, function (err, course) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when getting course',
                            error: err
                        });
                    }
                    if (!course) {
                        return res.status(404).json({
                            message: 'No such course'
                        });
                    }

                    return res.status(201).json(course);
                });

        }
    },

    removeGroup: function (req, res){
        if (req.session.user !== undefined) {
            let id = req.params.id;
            courseModel.findOneAndUpdate({_id: id},
                {$pull: 
                    { 
                        group_ids: req.body.group_id,
                        members: {$in: req.body.members }
                   }
               },
                
                function (err, course) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when getting assignment',
                            error: err
                        });
                    }
                    if (!course) {
                        return res.status(404).json({
                            message: 'No such assignment'
                        });
                    }

                    return res.status(202).json(course);
                });
        }
    },
    /**
     * courseController.remove()
     */
    remove: function (req, res) {
        if(req.session.user !== undefined) {

        let id = req.params.id;

        assignmentModel.find({"class_id": id}, function(err, assignments) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when finding the assignments of the course.',
                    error: err
                });
            }

            for (let i = 0; i < assignments.length; i++) {
                paperModel.find({'assignment_id': assignments[i]['_id']}, function (err, papers) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when finding the papers of the assignment.',
                            error: err
                        });
                    }

                    for (let j = 0; j < papers.length; j++) {
                        citationModel.deleteMany({'paper_id': papers[j]['_id']}, function(err, citations){
                            if(err) {
                                return res.status(500).json({
                                    message: 'Error when deleting the citations of the paper.',
                                    error: err
                                });
                            }
                        });
                    }
                });

                paperModel.deleteMany({'assignment_id': assignments[i]['_id']}, function (err, papers) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when deleting the papers of the assignment.',
                            error: err
                        });
                    }
                });

            }
        });


            assignmentModel.deleteMany({'class_id': id}, function (err, assingments) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when deleting assignments.',
                        error: err
                    });
                }
            });


            courseModel.findByIdAndRemove(id, function (err, course) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when deleting the course.',
                        error: err
                    });
                }
                return res.status(204).json();
            });
        }
    },

    getCoursesByGroup: function(req, res){
        let groupId = req.params.groupId;
        courseModel.find({"group_ids": groupId}), function(err, course){
            if(err){
                return res.status(500).json({
                    message: "Error when finding course",
                    error: err
                });
            }
            return res.status(204).json();
        }
    }
};
