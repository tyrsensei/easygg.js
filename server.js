var app = require('http').createServer();
var Server = require('./lib/easygg-server');
var Player = require('./lib/easygg-player');
var Game = require('./lib/easygg-game');
var Instance = require('./lib/easygg-instance');

var Dice = require('./lib/easygg-dice');

var dice = new Dice({});

var game = new Game({
    id: 'test',
    name: 'Jeu de test',
    actions: {
        'ready': function(data) {
            var instance = this.easygg.instances[data.room];
            instance.togglePlayerReady(this.id);
            this.easygg.io.sockets.in(data.instance).emit('ready players', instance.readyPlayers);
            if (instance.playersReady()) {
                instance.started = true;
                this.easygg.io.sockets.in(data.room).emit('intance started');
            }
        },
        'roll': function(data) {
            if (this.easygg.instances[data.room].started) {
                var val = dice.roll();
                var newData = {player: this.id, value: val};
                console.log(newData);
                this.easygg.io.sockets.in(data.room).emit('rolled', newData);
            } else {
                this.emit('not started');
            }
        }
    }
});

var server = new Server({
    server: app,
    callbacks: {
        'player': function(data) {
            console.log(this.id);
            var player = new Player({
                id: this.id,
                nickname: data.nickname
            });
            this.easygg.updatePlayer(this.id, player);
        },
        'players': function() {
            console.log(this.easygg.players);
        },
        'games': function() {
            console.log(this.easygg.games);
        },
        'io': function() {
            console.log(this.easygg.io);
        },
        'socket': function() {
            console.log(this);
        },
        'rooms': function() {
            console.log(this.rooms);
        },
        'instances': function() {
            console.log(this.easygg.instances);
        },
        'join': function(data) {
            // Check if player is registered
            if (this.easygg.players[this.id]) {
                var player = this.easygg.players[this.id];
                // Check if instance exists
                if (undefined == data.instance || !this.easygg.instances.hasOwnProperty(data.instance)) {
                    instance = new Instance({
                        game: this.easygg.games[data.game]
                    });
                    this.easygg.games[data.game].updateInstance(instance.id, instance);
                    this.easygg.updateInstance(instance.id, instance);
                } else {
                    instance = this.easygg.instances[data.instance];
                }

                // Check if instance hasn't already started
                if (!instance.started) {
                    player.joinInstance(instance);
                    instance.updatePlayer(player.id, player);

                    this.easygg.joinGame(this, instance);
                    this.emit('instance', {id: instance.id});
                }
            }
        }
    },
    onDisconnect: function() {
        console.log('Disconnected ('+this.id+')');
        // Leave all instances
        var player = this.easygg.players[this.id];
        if (player) {
            var instances = player.instances;
            for (var instance in instances) {
                delete instances[instance].players[player.id];
                // Delete instance if no player in it
                if (!instances[instance].players.length) {
                    delete instances[instance].game.instances[instance];
                    delete this.easygg.instances[instance];
                }
            }
            delete this.easygg.players[player.id];
        }
    }
});

server.updateGame(game.id, game, game.actions);

app.listen(3000);