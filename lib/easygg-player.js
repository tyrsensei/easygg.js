var shortid = require('shortid');

function Player(params) {
    this.id = params.id || shortid.generate();
    this.nickname = params.nickname || 'Unknown';
    this.instances = params.instances || {};
    this.waiting = params.waiting || false;
}

Player.prototype.joinInstance = function(instance) {
    this.instances[instance.id] = instance;
};

module.exports = Player;