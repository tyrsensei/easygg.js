var app = require('http').createServer();
var Server = require('./lib/easygg-server');
var Player = require('./lib/easygg-player');
var Game = require('./lib/easygg-game');
var Instance = require('./lib/easygg-instance');

var Dice = require('./lib/easygg-dice');

var dice = new Dice({});

var game = new Game({
    id: '/monjeu',
    name: 'Jeu de test',
    actions: {
        'roll': function() {
            console.log(dice.roll());
        }
    }
});

var server = new Server({
    server: app,
    callbacks: {
        'player': function(data) {
            console.log('Here comes a new challenger');
            var player = new Player({
                id: this.socket.id,
                nickname: data.nickname
            });
            this.updatePlayer(player.id, player);
        },
        'players': function() {
            console.log(this.players);
        },
        'games': function() {
            console.log(this.games);
        },
        'io': function() {
            console.log(this.io);
        },
        'instances': function() {
            console.log(this.instances);
        },
        'join': function(data) {
            console.log(data);
            // Check if player is registered
            if (this.players[this.socket.id]) {
                // Check if instance exists
                if (undefined == data.instance || !this.instances.hasOwnProperty(data.instance.id)) {
                    instance = new Instance({
                        game: this.games[data.game]
                    });
                    this.games[data.game].updateInstance(instance.id, instance);
                    this.updateInstance(instance.id, instance);
                } else {
                    instance = this.instances[data.instance];
                }

                player.joinInstance(data.instance);
                data.instance.updatePlayer(player.id, player);

                this.joinGame(this.players[this.socket.id], this.games[data.game], instance);
            }
        }
    },
    onDisconnect: function() {
        console.log('Disconnected ('+this.socket.id+')');
        // Leave all instances
        var player = this.players[this.socket.id];
        if (player) {
            var instances = player.instances;
            for (var instance in instances) {
                delete instances[instance].players[player.id];
                // Delete instance if no player in it
                console.log(instances[instance].players.length);
                if (!instances[instance].players.length) {
                    delete instances[instance].game.instances[instance];
                    delete this.instances[instance];
                }
            }
            delete this.players[player.id];
        }
    }
});

server.updateGame(game.id, game, game.actions);

app.listen(3000);