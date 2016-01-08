var socketIo = require('socket.io');
var player = require('./easygg-player');

var players = [];
var io = null;
var connected = 0;

function Server(httpServer, callbacks) {
    io = socketIo(httpServer);
    io.on('connection', function(socket) {
        connected++;
        console.log('Connection ! ('+connected+')');
        socket.on('disconnect', function() {
            connected--;
            console.log('Deconnection ! ('+connected+')');
        });

        // Apply user callbacks
        if (callbacks) {
            for (var callback in callbacks) {
                socket.on(callback, callbacks[callback]);
            }
        }
    });
}

Server.prototype.addPlayer = function(player) {
    players.push(player);
};

Server.prototype.getNbPlayers = function() {
    return players.length;
};

Server.prototype.getConnectedSockets = function() {
    return connected;
};

module.exports = Server;