module.exports = function() {
    var _users = [];
    var Users = {
        user: function (userData) {
            var defaultUser = {
                getUserName: function() {
                    return username;
                }
            };
            return _.extend(defaultUser, userData);
        },
        users: function () {
            if(arguments.length > 0) {
                return _.map(arguments[0], function (userData) {
                    var user = Users.user(userData);
                    _users.push(user);
                    return user;
                });
            } else {
                return Users.user(arguments[0]);
            }
        }
    };
    return Users;
}();

var users = require('./components/user').users([{name:"Müller"},{name:"Kalicki"}]);