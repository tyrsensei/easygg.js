var shortid = require('shortid');

function Game(params) {
    // Properties initialization
    var randomId = shortid.generate();
    this.id = params.id || randomId;
    this.name = params.name || 'Game ' + randomId;
    this.minPlayers = params.minPlayers || 2;
    this.maxPlayers = params.maxPlayers || 2;
    this.instances = params.instances || {};
    this.actions = params.actions || {};
}

Game.prototype.updateInstance = function(id, instance) {
    this.instances[id] = instance;
};

module.exports = Game;