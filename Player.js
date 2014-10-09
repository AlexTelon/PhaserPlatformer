var dudegame = dudegame || {};

dudegame.Player = function() {
	return this;
};

dudegame.Player.prototype = {

	init: function (game) {
		this.game = game;
		this.sprite= null;
		this.cursors = null;
		this.startXPos = 100;
		this.startYPos = 200;
		this.deathCounter = 0;
	},

	create: function () {

		this.sprite = game.add.sprite(this.startXPos, this.startYPos, 'dude');
		this.sprite.name = 'playerDerpa';
		this.game.physics.p2.enable(this.sprite);
		this.sprite.body.fixedRotation = true;
		this.sprite.body.gravity.y = 500;
		this.sprite.checkWorldBounds = true;

		this.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
		this.sprite.animations.add('turn', [4], 20, true);
		this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);

		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.game.camera.follow(this.sprite, Phaser.Camera.FOLLOW_LOCKON);

		this.deathSound = this.game.add.audio('death');
	},

	collectCoin: function () {
		// Right now this code could be in level directly. If no powerups or changes to the player
		// are to be made this should be moved there to reduce coupling between "classes"

		//  Add and update the score
		hud.score += 10;
		hud.scoreText.text = 'Score: ' + hud.score + ' Deaths: ' + this.deathCounter;
	},

	update: function() {
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
		this.deathSound.play();
		hud.scoreText.text = 'Score: ' + hud.score + ' Deaths: ' + this.deathCounter;
	},

	handleEventualDeath: function() {
		//TODO change so we wont die buy jumping to high, and add animation
		// Right now only kill directly, TODO add animation later
		this.dieAndRepeat();
	}


};