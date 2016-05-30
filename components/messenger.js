var userModel = require('./../models/UserModel.js');
var userRepository = require('./../repositories/UserRepository.js');
var _ = require('lodash');

module.exports = {
    init: function (io, winston) {
        io.on('connection', function (socket) {
            var user = new userModel();
            user.socketId = socket.id;

            socket.join(socket.id);

            winston.info('User has been connected.');

            socket.on('client.join', function (data) {
                user.name = data.user.name;
                user.email = data.user.email;
                user.role = 'client';

                userRepository.add(user);
                socket
                    .emit('client.join', user)
                    .broadcast
                    .emit('room.join', user);
                winston.info('User ' + user.name + ' has logged in.');
            });

            socket.on('operator.join', function (data) {
                user.name = data.user.name;
                user.email = data.user.email;
                user.role = 'client';

                userRepository.add(user);
                socket
                    .emit('operator.join', user);
                winston.info('User ' + user.name + ' has logged in.');
            });

            socket.on('clients.all', function () {
                socket.emit('clients.all', userRepository.search({role: 'client'}));
            });

            socket.on('room.join', function (data) {
                socket
                    .join(data.room)
                    .emit('room.join');
                winston.info('User ' + user.name + ' has join ' + data.room + ' room.');
            });

            socket.on('room.leave', function (data) {
                socket
                    .leave(data.room)
                    .emit('room.leave');
                winston.info('User ' + user.name + ' has leave ' + data.room + ' room.');
            });

            socket.on('message.send', function (data) {
                winston.info(user.name + ': ' + data.message);

                socket.broadcast.to(data.room).emit('message.send', {
                    user: user.name,
                    message: data.message
                });
            });

            socket.on('disconnect', function () {
                socket.broadcast.emit('client.disconnect', user);
                winston.info('User ' + user.name + ' disconnected.');
                userRepository.remove(user);
                //delete user;
            });
        });
    }
};