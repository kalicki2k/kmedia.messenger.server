module.exports = {
    init: function (io, winston) {
        io.on('connection', function (socket) {
            // a client has been connected
            winston.info('User has been connected.');

            // client will be redirected to a dynamic generated room
            socket.join(socket.id);


            // user has logged in
            socket.on('user.init', function (data) {
                winston.info('User ' + data.user.name + ' has logged in.');
            });

            socket.on('send.message', function (data) {
                winston.info(data.message);
                socket.broadcast.to(socket.id).emit('add.message', {message: data.message});
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
    }
};