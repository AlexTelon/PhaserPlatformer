

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
		this.game.load.spritesheet('dude', 'assets/games/starstruck/dude.png', 32, 48);
	},

	create: function () {

		this.sprite = game.add.sprite(this.startXPos, this.startYPos, 'dude');
		this.sprite.name = 'player';
		this.game.physics.p2.enable(this.sprite);
		this.sprite.body.fixedRotation = true;
		this.sprite.body.gravity.y = 500;
		this.sprite.checkWorldBounds = true;

		// The player dies if it hits the edges of the map.
		this.sprite.events.onOutOfBounds.add(this.handleEventualDeath, this);

		this.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
		this.sprite.animations.add('turn', [4], 20, true);
		this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);

		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_LOCKON);
		return this;
	},

	collectCoin: function () {
		// Right now this code could be in level directly. If no powerups or changes to the player
		// are to be made this should be moved there to reduce coupling between "classes"

		//  Add and update the score
		hud.score += 10;
		hud.scoreText.text = 'Score: ' + hud.score + ' Deaths: ' + this.deathCounter;
	},

	update: function() {
		// nothing to do now that keyboard handling is in keys.js instead.
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
		hud.scoreText.text = 'Score: ' + hud.score + ' Deaths: ' + this.deathCounter;
	},

	handleEventualDeath: function() {
		//TODO change so we wont die buy jumping to high, and add animation
		// Right now only kill directly, TODO add animation later
		this.dieAndRepeat();
	}


};