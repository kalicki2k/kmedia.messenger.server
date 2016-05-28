var config = require('./config.js');
var bootstrap = require('./components/bootstrap.js');
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

http.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// listen on connection
io.on('connection', function (socket) {

    winston.info('User has been connected.');

    socket.on('user.init', function (data) {
        winston.info('User ' + data.user.name + ' has logged in.');
        //socket.emit('user.join', {hello: 'world'});
    });

    socket.on('send.message', function (data) {
        winston.info(data.message)
        socket.broadcast.emit('add.message', {message: data.message});
    });

    // socket.on('user.join', function () {
    //     console.log(user);
    // });

    socket.on('disconnect', function () {
        winston.info('User disconnected.');
    });

    //
    // console.log(socket.id)
    //
    // socket.emit('news', { hello: 'world' });
    // socket.on('my other event', function (data) {
    //     console.log(data);
    // });
});
