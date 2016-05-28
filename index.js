/**
 *
 */
var app = require('express')();

/**
 *
 */
var server = require('http').Server(app);

/**
 *
 */
var io = require('socket.io')(server);

/**
 * A multi-transport async logging library.
 */
var winston = require('winston');

/**
 * Winston configuration
 */
winston.console = true;
winston.level = 'debug';
winston.logfile = 'logfile.json';

winston.add(winston.transports.File, {filename: winston.logfile});
if (!winston.console) {
    winston.remove(winston.transports.Console);
}

server.listen(3000);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    winston.info('User connected.');

    socket.on('user.init', function (data) {
        winston.info('User ' + data.user.name + ' has logged in.');
        //socket.emit('user.join', {hello: 'world'});
    });

    socket.on('send.message', function (data) {
        winston.info(data.message)
        socket.emit('add.message', {message: data.message});
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