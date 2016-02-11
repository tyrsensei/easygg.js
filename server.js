var app = require('http').createServer();
var Server = require('./lib/easygg-server');
var Player = require('./lib/easygg-player');
var Game = require('./lib/easygg-game');
var Instance = require('./lib/easygg-instance');

var game = new Game({
    id: '/monjeu',
    name: 'Jeu de test'
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
        'instances': function() {
            console.log(this.instances);
        },
        'join': function(data) {
            // Check if instance exists
            if (undefined == data.instance || !this.instances[data.instance.id]) {
                data.instance = new Instance({
                    game: game
                });
                game.updateInstance(data.instance.id, data.instance);
                this.updateInstance(data.instance.id, data.instance);
            }
            this.joinGame(this.players[this.socket.id], '/monjeu', data.instance);
        }
    },
    onJoinGame: function(player, game, instance) {
        console.log('joined');

        // Add Instance to Player
        player.joinInstance(instance);

        // Add Player to Instance
        instance.updatePlayer(player.id, player);
    },
    onDisconnect: function() {
        console.log('disconnected ('+this.socket.id+')');
        // Leave all instances
        var player = this.players[this.socket.id];
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
});

server.updateGame(game.id, game);

app.listen(3000);