var rubricModel = require('../models/rubricModel.js');

/**
 * rubricController.js
 *
 * @description :: Server-side logic for managing rubrics.
 */
module.exports = {

    all: function (req, res) {
        if (req.session.user !== undefined) {

            rubricModel.find({}, function (err, rubrics) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting rubric.',
                        error: err
                    });
                }
                return res.status(200).json(rubrics);
            });
        }
    },
    /**
     * rubricController.list()
     */

    list: function (req, res) {
        if (req.session.user !== undefined) {

            var user_id = req.params.user_id;
            rubricModel.find({ user_id: user_id }, function (err, rubrics) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting rubric.',
                        error: err
                    });
                }
                return res.json(rubrics);
            });
        }
    },

    /**
     * rubricController.show()
     */
    show: function (req, res) {
        if (req.session.user !== undefined) {

            var id = req.params.id;
            rubricModel.findOne({ _id: id }, function (err, rubric) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting rubric.',
                        error: err
                    });
                }
                if (!rubric) {
                    return res.status(404).json({
                        message: 'No such rubric'
                    });
                }
                return res.json(rubric);
            });
        }
    },

    /**
     * rubricController.create()
     */
    create: function (req, res) {
        if (req.session.user !== undefined) {

            var rubric = new rubricModel({
                name: req.body.name,
                cards: req.body.cards,
                user_id: req.body.user_id
            });
            rubricModel.findOne({ $and:[
                { name: req.body.name },
                {user_id: req.body.user_id}
             ]
             }, function (err, foundRubric) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting rubric',
                        error: err
                    });
                }
                if (!foundRubric) {
                    //Rubric is not in user's collection yet, add it.
                    rubric.save(function (err, rubric) {
                        if (err) {
                            return res.status(500).json({
                                message: 'Error when creating rubric',
                                error: err
                            });
                        }
                        return res.status(201).json(rubric);
                    });
                }
                else {
                    return res.status(304).json({
                        message: 'Rubric already in collection'
                    });
                };
            });
        }
    },


    /**
     * rubricController.update()
     */
    update: function (req, res) {
        if (req.session.user !== undefined) {

            var id = req.params.id;
            rubricModel.findOne({ _id: id }, function (err, rubric) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting rubric',
                        error: err
                    });
                }
                if (!rubric) {
                    return res.status(404).json({
                        message: 'No such rubric'
                    });
                }

                rubric.name = req.body.name ? req.body.name : rubric.name;
                rubric.cards = req.body.cards ? req.body.cards : rubric.cards;
                rubric.user_id = req.body.user_id ? req.body.user_id : rubric.user_id;

                rubric.save(function (err, rubric) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when updating rubric.',
                            error: err
                        });
                    }

                    return res.json(rubric);
                });
            });
        }
    },

    updateGroup: function(req,res){
        if (req.session.user !== undefined) {

            let id = req.params.id;
    
            rubricModel.findOneAndUpdate({ _id: id },
                {  $push: {group_ids: req.body.group_id, members: req.body.members} }, function (err, rubric) {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Error when getting rubric',
                        error: err
                    });
                }
                if (!rubric) {
                    return res.status(404).json({
                        message: 'No such rubric'
                    });
                }


                    return res.status(201).json(rubric);
                });

        }
    },

    removeGroup: function(req,res){
        let id = req.params.id;
    
        rubricModel.findOneAndUpdate({ _id: id },
            {  $pull: {group_ids: req.body.group_id, members: req.body.members} }, function (err, rubric) {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    message: 'Error when getting rubric',
                    error: err
                });
            }
            if (!rubric) {
                return res.status(404).json({
                    message: 'No such rubric'
                });
            }


                return res.status(201).json(rubric);
            });

    },

    sharedRubrics: function(req,res){
        if (req.session.user !== undefined) {

            let email = req.params.email;
            let user_id = req.params.id;
            
            rubricModel.find({
                $and : [
                    {members: {$in: email}},
                    {user_id: {$ne: user_id}}
                ]}, function (err, rubrics) {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Error when getting rubrics.',
                        error: err
                    });
                }
                if (!rubrics) {
                    return res.status(404).json({
                        message: 'No such member'
                    });
                }

                return res.status(201).json(rubrics);
            });
        }
    },

    /**
     * rubricController.remove()
     */
    remove: function (req, res) {
        if (req.session.user !== undefined) {

            var id = req.params.id;
            rubricModel.findByIdAndRemove(id, function (err, rubric) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when deleting the rubric.',
                        error: err
                    });
                }
                return res.status(204).json();
            });
        }
    }
};
