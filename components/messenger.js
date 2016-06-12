var userModel = require('./../models/UserModel.js');
var userRepository = require('./../repositories/UserRepository.js');

var dialogModel = require('./../models/DialogModel.js');
var dialogRepository = require('./../repositories/DialogRepository.js');

//var _ = require('lodash');

module.exports = {
    init: function (io, winston) {
        io.on('connection', function (socket) {
            var user;

            winston.info('User has been connected.');

            socket.on('customer.join', function (data) {
                var dialog = new dialogModel();

                user = new userModel();

                user.name = data.user.name;
                user.email = data.user.email;
                user.role = 'customer';
                user.socketId = socket.id;

                dialog.user = user.name;
                dialog.room = socket.id;
                dialog.message = 'Customer ' + user.name + ' has logged in.';
                dialog.time = new Date().getTime();

                userRepository.add(user);
                dialogRepository.add(dialog);

                socket.join(user.socketId);
                socket.emit('customer.data', user);
                socket.broadcast.emit('room.customer.join', user);

                winston.info('Customer ' + user.name + ' has logged in.');
            });

            socket.on('operator.join', function (data) {
                var dialog = new dialogModel();

                user = new userModel();

                user.name = data.user.name;
                user.email = data.user.email;
                user.role = 'operator';
                user.socketId = socket.id;

                dialog.user = user.name;
                dialog.room = socket.id;
                dialog.message = 'Operator ' + user.name + ' has logged in.';
                dialog.time = new Date().getTime();

                userRepository.add(user);
                dialogRepository.add(dialog);

                socket.join(user.socketId);
                socket.emit('operator.data', user);
                socket.emit('room.all.customer', userRepository.search({role: 'customer'}));

                winston.info('Operator ' + user.name + ' has logged in.');
            });

            socket.on('room.operator.join', function (data) {
                var dialog = new dialogModel();

                dialog.user = user.name;
                dialog.room = data.room;
                dialog.message = 'Operator ' + user.name + ' has join ' + data.room + ' room.';
                dialog.time = new Date().getTime();

                dialogRepository.add(dialog);

                socket.join(data.room);
                socket.emit('room.dialog', dialogRepository.search({room: data.room}));
                socket.broadcast.to(data.room).emit('room.operator.join', user);

                winston.info('Operator ' + user.name + ' has join ' + data.room + ' room.');
            });

            socket.on('message.sent', function (data) {
                var dialog = new dialogModel();

                dialog.user = user.name;
                dialog.room = data.room;
                dialog.message = data.message;
                dialog.time = new Date().getTime();

                dialogRepository.add(dialog);

                socket.broadcast.to(data.room).emit('message.received', {
                    user: user.name,
                    message: data.message
                });

                winston.info(user.name + ': ' + data.message);
            });

            socket.on('disconnect', function () {
                if (user.role == 'customer') {
                    winston.info('Customer ' + user.name + ' disconnected.');
                    socket.broadcast.emit('customer.leave', user);
                } else if (user.role == 'operator') {
                    winston.info('Operator ' + user.name + ' disconnected.');
                    socket.broadcast.emit('operator.leave', user);
                } else {
                    winston.info('User disconnected.');
                }
                userRepository.remove(user);
            });
        });
    }
};