var userModel = require('./../models/UserModel.js');
var _ = require('lodash');

module.exports = {
    build: function (customUser) {
        return _.extend(new userModel(), customUser);
    }
};
