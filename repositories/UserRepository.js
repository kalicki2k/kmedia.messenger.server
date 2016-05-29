var _ = require('lodash');
var users = [];

module.exports = function () {

    return {

        add: function (userModel) {
            return users.push(userModel);
        },

        get: function (userModel) {
            return (arguments.length > 0) ? _.find(users, userModel) : users;
        },

        has: function (userModel) {
            return (_.size(_.filter(users, userModel)) > 0);
        },

        remove: function (userModel) {
            return users.splice(_.findIndex(users, userModel), 1);
        },

        search: function (userModel) {
            return (arguments.length > 0) ? _.filter(users, userModel) : users;
        }
    };
}();