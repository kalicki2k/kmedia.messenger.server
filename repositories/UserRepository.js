var _ = require('lodash');
var users = [];

module.exports = function () {

    return {

        add: function (userModel) {
            users.push(userModel);
        },

        search: function (userModel) {
            return (arguments.length > 0) ? _.find(users, userModel) : users;
        },

        has: function (userModel) {
            return (_.size(_.filter(users, userModel)) > 0);
        },

        remove: function (userModel) {
            delete users[_.findIndex(users, userModel)];
        }
    };
}();