

Player = function(game) {

	this.game = game;
	this.sprite= null;
	this.cursors = null;
	this.startXPos = 100;
	this.startYPos = 200;
	this.deathCounter = 0;
};

Player.prototype = {

	preload: function () {
		this.game.load.spritesheet('dude', 'assets/dudeFly.png', 32, 48);

		game.load.audio('death', 'assets/audio/numkey_wrong.wav');
	},

	create: function () {

		this.sprite = game.add.sprite(this.startXPos, this.startYPos, 'dude');
		this.sprite.name = 'player';
		// the second variable true/false indicates if we are to have debugging on/off
		this.game.physics.p2.enable(this.sprite, true);
		this.sprite.body.fixedRotation = true;
		this.sprite.body.gravity.y = 500;
		this.sprite.checkWorldBounds = true;

		// The player dies if it hits the edges of the map.
		//	this.sprite.events.onOutOfBounds.add(this.handleEventualDeath, this);

		this.sprite.animations.add('left', [0, 1, 0, 3], 10, true);
		this.sprite.animations.add('turn', [4], 20, true);
		this.sprite.animations.add('right', [5, 6, 5, 8], 10, true);
		this.sprite.animations.add('leftFly', [2], 10, true);
		this.sprite.animations.add('rightFly', [7], 10, true);

		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_PLATFORMER);

		this.deathSound = this.game.add.audio('death');

		return this;
	},

	collectCoin: function () {
		// Right now this code could be in level directly. If no powerups or changes to the player
		// are to be made this should be moved there to reduce coupling between "classes"

		//  Add and update the score
		//	hud.score += 10;
		//	hud.scoreText.text = 'Score: ' + hud.score;
	},

	update: function() {
		if(this.sprite.y >= this.game.world.height) {
			this.dieAndRepeat();
		}
	},

	setStartPos: function(x,y) {
		this.startXPos = x;
		this.startYPos = y;
	},

	dieAndRepeat: function() {
		this.sprite.kill();
		this.sprite.reset(this.startXPos, this.startYPos);
		this.deathCounter += 1;
		console.log(this.deathCounter);
		this.deathSound.play('',0,0.1);
	}

};