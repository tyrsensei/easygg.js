var socketIo = require('socket.io');

function Server(params) {
    // Properties initialization
    var self = this;
    this.io = params.io || socketIo(params.server);
    this.games = params.games || {};
    this.connected = params.connected || 0;
    this.players = params.players || {};
    this.instances = params.instances || {};
    this.socket = null;

    // On join game
    this.onJoinGame = params.onJoinGame || function(player, game) {};

    // Default connection callback
    this.onConnection = function(socket) {
        self.socket = socket;
        console.log('Connected ('+socket.id+')');
        // console.log(socket);
        // Register callbacks
        var callbacks = params.callbacks || {};
        for (var callback in callbacks) {
            socket.on(callback, callbacks[callback].bind(self));
        }

        // Disconnect callback
        var onDisconnect = params.onDisconnect.bind(self) || function() {
            console.log('Disconnected ('+this.id+')');
        };
        socket.on('disconnect', onDisconnect);

        // User callbacks
        if (params.onConnection != undefined) {
            params.onConnection();
        }
    };
    this.io.on('connection', this.onConnection);
}

Server.prototype.updatePlayer = function(socketId, player) {
    this.players[socketId] = player;
};

Server.prototype.updateGame = function(id, game) {
    this.games[id] = game;
};

Server.prototype.updateInstance = function(roomId, instance) {
    this.instances[roomId] = instance;
};

Server.prototype.joinGame = function(player, game, instance) {
    // TODO: Check if player has been registered in this.players
    this.onJoinGame(player, game, instance);

    // Join the room of the game instance
    this.socket.join(instance.id);
};

module.exports = Server;