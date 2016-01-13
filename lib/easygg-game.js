function Game(params) {
    this.name = params.name || 'Game';
    this.minPlayers = params.minPlayers || 2;
    this.maxPlayers = params.maxPlayers || 2;
}

module.exports = Game;