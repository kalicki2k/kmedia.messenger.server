var _ = require('lodash');

module.exports = function() {
    return {
        _users: [],

        addUser: function (userModel) {
            this._users.push(userModel);
        },

        searchUser: function (userModel) {
            return _.filter(this._users, userModel);
        },

        hasUser: function (userModel) {
            return (_.size(_.filter(this._users, userModel)) > 0);
        },

        removeUser: function (userModel) {
            delete this._users[_.findIndex(this._users, userModel)];
        }
    };
}();