var _ = require('lodash');
var dialogs = [];

module.exports = function () {

    return {

        add: function (dialogModel) {
            return dialogs.push(dialogModel);
        },

        get: function (dialogModel) {
            return (arguments.length > 0) ? _.find(dialogs, dialogModel) : dialogs;
        },

        has: function (dialogModel) {
            return (_.size(_.filter(dialogs, dialogModel)) > 0);
        },

        remove: function (dialogModel) {
            return dialogs.splice(_.findIndex(dialogs, dialogModel), 1);
        },

        search: function (dialogModel) {
            return (arguments.length > 0) ? _.filter(dialogs, dialogModel) : dialogs;
        }
    };
}();