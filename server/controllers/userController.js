//var userModel = require('../models/userModel.js');
require('../models/userModel')();
var userModel = require("mongoose").model("user");
/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    /**
     * userController.list()
     */

    list: function (req, res) {
        if (req.session.user !== undefined) {

            userModel.find(function (err, users) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting user.',
                        error: err
                    });
                }
                return res.json(users);
            });
        }
    },

    /**
     * userController.show()
     */
    show: function (req, res) {
        if (req.session.user !== undefined) {

            var id = req.params.id;
            userModel.findOne({ _id: id }, function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting user.',
                        error: err
                    });
                }
                if (!user) {
                    return res.status(404).json({
                        message: 'No such user'
                    });
                }
                return res.json(user);
            });
        }
    },


    /**
     * userController.update()
     */
    update: function (req, res) {
        if (req.session.user !== undefined) {

            var id = req.params.id;
            userModel.findOne({ _id: id }, function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting user',
                        error: err
                    });
                }
                if (!user) {
                    return res.status(404).json({
                        message: 'No such user'
                    });
                }

                user.save(function (err, user) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when updating user.',
                            error: err
                        });
                    }

                    return res.json(user);
                });
            });
        }
    },

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        if (req.session.user !== undefined) {

            var id = req.params.id;
            userModel.findByIdAndRemove(id, function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when deleting the user.',
                        error: err
                    });
                }
                return res.status(204).json();
            });
        }
    }
};
