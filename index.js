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
            modules['winston'].console = true;
            modules['winston'].level = 'debug';
            modules['winston'].logfile = 'logfile.json';

            modules['winston'].add(modules['winston'].transports.File, {filename: modules['winston'].logfile});
            if (!modules['winston'].console) {
                modules['winston'].remove(modules['winston'].transports.Console);
            }
            return modules;
        }
    }
]);

var app = modules['express'];
var server = modules['http'];
var io = modules['socket.io'];
var winston = modules['winston'];

/**
 * Winston configuration
 */
/*

winston.console = true;
winston.level = 'debug';
winston.logfile = 'logfile.json';

winston.add(winston.transports.File, {filename: winston.logfile});
if (!winston.console) {
    winston.remove(winston.transports.Console);
}

*/

server.listen(3000);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
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
