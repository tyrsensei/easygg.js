function Player(params) {
    this.name = params.name || 'Bob';
    this.score = params.score || 0;
    this.tables = params.tables || [];
}

module.exports = Player;