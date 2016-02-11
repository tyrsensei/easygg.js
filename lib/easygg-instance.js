var shortid = require('shortid');

function Instance(params) {
    this.name = params.name || 'My Instance';
    this.players = params.players || [];
    this.game = params.game || '';

    this.id = params.id || shortid.generate();
    this.game = params.game || null;
    this.players = params.players || {};
    this.started = params.started || false;
}

Instance.prototype.updatePlayer = function(playerId, player) {
    this.players[playerId] = player;
};

module.exports = Instance;