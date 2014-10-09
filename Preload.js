var dudegame = dudegame || {};

//loading the game assets
dudegame.Preload = function(){};

dudegame.Preload.prototype = {
	preload: function() {
		//for level
		dudegame.game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
		dudegame.game.load.spritesheet('coin', 'assets/sprites/coin.png', 32, 32);
		dudegame.game.load.audio('coin', 'assets/audio/SoundEffects/p-ping.mp3');

		// for player
		dudegame.game.load.spritesheet('dude', 'assets/games/starstruck/dude.png', 32, 48);
		dudegame.game.load.audio('death', 'assets/audio/SoundEffects/numkey_wrong.wav');

		// same music/background for all levels right now, might change later
		dudegame.game.load.audio('music', 'assets/audio/sd-ingame1.wav');
		dudegame.game.load.image('sky', 'assets/skies/sky4.png');

		// we need physics asap for player
		dudegame.game.physics.startSystem(Phaser.Physics.P2JS);
	},
	create: function() {
		dudegame.player = new dudegame.Player();
		dudegame.player.init(dudegame.game);;
		dudegame.player.create();

		dudegame.keys = new dudegame.Keys();
		dudegame.keys.init(dudegame.game, dudegame.player.sprite);  //this hurts a little to do.. If I have time I will look into this.

		this.state.start('MainMenu',false);
	}
};