var config = require('./config.js');
var bootstrap = require('./components/bootstrap.js');
var messenger = require('./components/messenger.js');
var modules = bootstrap.init([
    {
        moduleName: 'express',
        callback: function(modules) {
            modules['express'] = modules['express']();
            return modules;
        }
    },
    {
        moduleName: 'http',
        callback: function(modules) {
            modules['http'] = modules['http'].Server(modules['express']);
            modules['http'].listen(config.port);
            return modules;
        }
    },
    {
        moduleName: 'socket.io',
        callback: function(modules) {
            modules['socket.io'] = modules['socket.io'](modules['http']);
            return modules;
        }
    },
    {
        moduleName: 'winston',
        callback: function(modules) {
            modules['winston'].level = config.logger.level;
            modules['winston'].add(modules['winston'].transports.File, {filename: config.logger.logfile});
            if (!config.logger.console) {
                modules['winston'].remove(modules['winston'].transports.Console);
            }
            return modules;
        }
    }
]);

var http = modules['express'];
var io = modules['socket.io'];
var winston = modules['winston'];


var userFactory = require('./factories/UserFactory.js');
var userRepository = require('./repositories/UserRepository.js');

var user = userFactory.build({_username:'Kalicki'}).id(0);

userRepository.addUser(user);

http.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

messenger.init(modules['socket.io'], modules['winston']);
