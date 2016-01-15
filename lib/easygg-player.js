function Player(params) {
    this.name = params.name || 'Bob';
    this.score = params.score || 0;
}

module.exports = Player;