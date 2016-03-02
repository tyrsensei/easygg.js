var shortid = require('shortid');

function Instance(params) {
    this.id = params.id || shortid.generate();
    this.name = params.name || 'My Instance';
    this.players = params.players || [];
    this.readyPlayers = params.readyPlayers || [];

    this.game = params.game || null;
    this.started = params.started || false;
}

Instance.prototype.updatePlayer = function(playerId, player) {
    this.players[playerId] = player;
};

Instance.prototype.playersReady = function() {
    return Object.keys(this.players).length == this.readyPlayers.length;
};

Instance.prototype.togglePlayerReady = function(playerId) {
    var playerReadyIndex = this.readyPlayers.indexOf(playerId);
    if (playerReadyIndex == -1) {
        this.readyPlayers.push(playerId);
    } else {
        this.readyPlayers.splice(playerReadyIndex, 1);
    }
};

module.exports = Instance;