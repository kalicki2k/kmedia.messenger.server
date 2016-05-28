module.exports = {
    init: function(requires) {
        var modules = {};
        try {
            requires.forEach(function(obj) {
                modules[obj.moduleName] = require(obj.moduleName);
                if (typeof obj.callback === 'function') {
                    modules = obj.callback(modules);
                }
            });
        } catch (err) {
            console.error('An error occured ' + err);
            process.exit(1);
        }
        return modules;
    }
};