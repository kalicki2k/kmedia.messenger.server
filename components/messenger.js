module.exports = {
    init: function (io, winston) {
        io.on('connection', function (socket) {
            winston.info('User has been connected.');

            socket.on('user.init', function (data) {
                winston.info('User ' + data.user.name + ' has logged in.');
            });

            socket.on('send.message', function (data) {
                winston.info(data.message);
                socket.broadcast.emit('add.message', {
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