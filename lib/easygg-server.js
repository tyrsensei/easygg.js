var socketIo = require('socket.io');

function Server(params) {
    // Properties initialization
    var self = this;
    this.io = params.io || socketIo(params.server);
    this.games = params.games || {};
    this.connected = params.connected || 0;
    this.players = params.players || {};
    this.instances = params.instances || {};

    // Default connection callback
    this.onConnection = function(socket) {
        socket.easygg = self;
        console.log('Connected ('+socket.id+')');
        // console.log(socket);
        // Register callbacks
        var callbacks = params.callbacks || {};
        for (var callback in callbacks) {
            socket.on(callback, callbacks[callback].bind(socket));
        }

        // Disconnect callback
        var onDisconnect = params.onDisconnect.bind(socket) || function() {
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

Server.prototype.updateGame = function(id, game, actions) {
    var self = this;
    this.games[id] = game;
    this.io.on('connection', function(socket){
        socket.easygg = self;

        for (var action in actions) {
            socket.on(action, actions[action].bind(socket));
        }
    });
};

Server.prototype.updateInstance = function(roomId, instance) {
    this.instances[roomId] = instance;
};

Server.prototype.joinGame = function(socket, instance) {
    // Join the room of the game instance
    socket.join(instance.id);
};

module.exports = Server;