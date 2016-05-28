module.exports = function() {
    var user = {
        _id: null,
        _name: null,
        _email: null,
        _socketId: null,

        id: function (id) {
            if (arguments.length > 0) {
                user._id = id;
                return this;
            } else {
                return user._id;
            }
        },

        name: function (name) {
            if (arguments.length > 0) {
                user._name = name;
                return this;
            } else {
                return user._name;
            }
        },

        email: function (email) {
            if (arguments.length > 0) {
                user._email = email;
                return this;
            } else {
                return user._email;
            }
        },

        socketId: function (socketId) {
            if (arguments.length > 0) {
                user._socketId = socketId;
                return this;
            } else {
                return user._socketId;
            }
        }
    };

    return user;
}();