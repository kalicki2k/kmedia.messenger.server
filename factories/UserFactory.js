var userModel = require('./../models/UserModel.js');
var _ = require('lodash');

module.exports = {
    build: function (customUser) {
        var defaultUser = userModel;
        return _.extend(defaultUser, customUser);
    }
};