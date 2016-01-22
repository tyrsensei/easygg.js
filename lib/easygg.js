var socketIo = require('socket.io');

var io = null;
var connected = 0;
var games = {};
var tables = {};
var players = {};
var namespaces = {};
var gameCallbacks = {};

function Server(httpServer, callbacks) {
    io = socketIo(httpServer);
    io.on('connection', function(socket) {
        connected++;
        console.log('Connection ! ('+connected+')');
        socket.on('disconnect', function() {
            delete players[socket.id];
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

    for (var namespace in games) {
        namespaces[namespace] = io.of(namespace);
        console.log('Création de '+namespace);
        namespaces[namespace].on('connection', function(socket){
            console.log('Connection au ns '+namespace);
            for (var callback in gameCallbacks[namespace]) {
                socket.on(callback, gameCallbacks[namespace][callback]);
            }
        });
    }
}

Server.addPlayer = function(player) {
    players.push(player);
};

Server.updatePlayer = function(id, player) {
    players[id] = player;
};

Server.getNbPlayers = function() {
    return players.length;
};

Server.getPlayers = function() {
    return players;
}

Server.getConnectedSockets = function() {
    return connected;
};

Server.addGame = function(namespace, game, callbacks) {
    games[namespace] = game;
    games[namespace].playing = 0;
    gameCallbacks[namespace] = callbacks;
};

Server.getGames = function() {
    return games;
};

Server.updateTable = function(id, table) {
    tables[id] = table;
};

Server.getTables = function() {
    return tables;
};

module.exports = Server;