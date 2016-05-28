module.exports = {
    init: function (io, winston) {
        io.on('connection', function (socket) {
            // a client has been connected
            winston.info('User has been connected.');

            // client will be redirected to a dynamic generated room
            // socket.join(socket.id);
            socket.join('testroom');

            // user has logged in
            socket.on('user.init', function (data) {
                winston.info('User ' + data.user.name + ' has logged in.');
            });

            socket.on('send.message', function (data) {
                winston.info(data.message);
                socket.broadcast.to('testroom').emit('add.message', {
                    user: data.user,
                    message: data.message
                });
            });

            socket.on('disconnect', function () {
                winston.info('User disconnected.');
            });
        });
    }
};