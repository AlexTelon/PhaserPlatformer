

Player = function(game) {

	this.game = game;
	this.player= null;
	this.cursors = null;
	this.startXPos = 100;
	this.startYPos = 200;
};

Player.prototype = {

	preload: function () {
		this.game.load.spritesheet('dude', 'assets/games/starstruck/dude.png', 32, 48);
	},

	create: function () {

		this.player = game.add.sprite(this.startXPos, this.startYPos, 'dude');
		console.log(this.game.physics);
		console.log(this.game.physics.p2);

		this.game.physics.p2.enable(this.player);
		this.player.body.fixedRotation = true;
		this.player.body.gravity.y = 500;
	    this.player.body.collideWorldBounds = true;

		this.player.animations.add('left', [0, 1, 2, 3], 10, true);
		this.player.animations.add('turn', [4], 20, true);
		this.player.animations.add('right', [5, 6, 7, 8], 10, true);

	    this.cursors = this.game.input.keyboard.createCursorKeys();
		this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON);
		return this;
	},

	collectCoin: function () {
		// Right now this code could be in level directly. If no powerups or changes to the player
		// are to be made this should be moved there to reduce coupling between "classes"

	    //  Add and update the score
	 //  	console.log("COLLECTED A COIN BITCHES!");
	    hud.score += 10;
	    hud.scoreText.text = 'Score: ' + hud.score;
	},

	update: function() {
	// nothing to do now that keyboard handling is in keys.js instead.
	},

	setStartPos: function(x,y) {
		this.startXPos = x;
		this.startYPos = y;
	},

	dieAndRepeat: function() {
		this.player.sprite.kill();
		this.player.sprite.reset(this.startXPos, this.startYPos);
	}
};