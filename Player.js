

Player = function(game) {

	this.game = game;
	this.player= null;
	this.cursors = null;
};

Player.prototype = {

	preload: function () {
		console.log("preload player");
		this.game.load.spritesheet('dude', 'assets/games/starstruck/dude.png', 32, 48);
	},

	create: function () {
		console.log("create player");

		this.player = game.add.sprite(100, 200, 'dude');
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
		this.game.camera.follow(this.player);
		return this.player;
	},

	collectStar: function(player, star) {
	    // Removes the star from the screen
	    star.kill();

	    //  Add and update the score
	    hud.score += 10;
	    hud.scoreText.text = 'Score: ' + hud.score;
	},

	update: function() {
	// nothing to do now that keyboard handling is in keys.js instead.
	},

	flip: function() {
		console.log("Filp player");
	}

};