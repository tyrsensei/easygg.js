function Table(params) {
    this.name = params.name || 'My Table';
    this.players = params.players || [];
    this.game = params.game || '';
}

module.exports = Table;