var userModel = require('./../models/UserModel.js');
var userRepository = require('./../repositories/UserRepository.js');
var _ = require('lodash');

module.exports = {
    init: function (io, winston) {
        io.on('connection', function (socket) {
            var user = new userModel();

            user.socketId = socket.id;
            socket.join(user.socketId);

            winston.info('User has been connected.');

            socket.on('customer.join', function (data) {
                user.name = data.user.name;
                user.email = data.user.email;
                user.role = 'customer';

                userRepository.add(user);
                socket.emit('customer.data', user);
                socket.broadcast.emit('room.customer.join', user);
                winston.info('Customer ' + user.name + ' has logged in.');
            });

            socket.on('operator.join', function (data) {
                user.name = data.user.name;
                user.email = data.user.email;
                user.role = 'operator';

                userRepository.add(user);
                socket.emit('operator.data', user);
                socket.emit('room.all.customer', userRepository.search({role: 'customer'}));
                socket.broadcast.emit('room.operator.join', user);
                winston.info('Operator ' + user.name + ' has logged in.');
            });

            socket.on('room.operator.join', function (data) {
                socket
                    .join(data.room)
                    .emit('room.join');
                winston.info('Operator ' + user.name + ' has join ' + data.room + ' room.');
            });

            socket.on('message.sent', function (data) {
                winston.info(user.name + ': ' + data.message);

                socket.broadcast.to(data.room).emit('message.received', {
                    user: user.name,
                    message: data.message
                });
            });

            socket.on('disconnect', function () {
                winston.info('User ' + user.name + ' disconnected.');
            });
        });
    }
};