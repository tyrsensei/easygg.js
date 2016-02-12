var random = require('random-js');

function Dice(params) {
    this.minValue = params.minValue || 1;
    this.maxValue = params.maxValue || 6;
    this.engine = random.engines.mt19937().autoSeed();
}

Dice.prototype.roll = function() {
    return random.integer(this.minValue, this.maxValue)(this.engine);
};

module.exports = Dice;