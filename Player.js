

Player = function(game) {

	this.game = game;
	this.player= null;
	this.cursors = null;
	
};

Player.prototype = {

	preload: function () {
		this.game.load.spritesheet('dude', 'assets/games/starstruck/dude.png', 32, 48);
	},

	create: function () {

		this.player = game.add.sprite(100, 200, 'dude');

		this.game.physics.p2.enable(this.player);
		this.player.body.fixedRotation = true;
		this.player.body.gravity.y = 500;
	    this.player.body.collideWorldBounds = true;

		this.player.animations.add('left', [0, 1, 2, 3], 10, true);
		this.player.animations.add('turn', [4], 20, true);
		this.player.animations.add('right', [5, 6, 7, 8], 10, true);

	    this.cursors = this.game.input.keyboard.createCursorKeys();
		this.game.camera.follow(this.player);
	},

	collectStar: function(player, star) {
	    // Removes the star from the screen
	    star.kill();

	    //  Add and update the score
	    hud.score += 10;
	    hud.scoreText.text = 'Score: ' + hud.score;
	},

	update: function() {
		//  Collide the player and the stars with the platforms
    //	this.game.physics.p2.collide(this.player, level.platforms);

    //	this.game.physics.p2.overlap(this.player, level.stars, this.collectStar, null, this);

		this.player.body.velocity.x = 0;

	    if(this.cursors.left.isDown)
	    {
			console.log("left");
			this.player.body.moveLeft(250);

	    	this.player.animations.play('left');
	    }
	    else if(this.cursors.right.isDown)
	    {
			this.player.body.moveRight(250);

	    	this.player.animations.play('right');
	    }
	    else
	    {
	    	this.player.animations.stop();
	    	this.player.frame = 4;
	    }

	    //  Allow the player to jump if they are touching the ground.
	    if (this.cursors.up.isDown && checkIfCanJump(this.player))
	    {
			this.player.body.moveUp(300);
	    }
	}

};

function checkIfCanJump(player) {

	var yAxis = p2.vec2.fromValues(0, 1);
	var result = false;

	for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++)
	{
		var c = game.physics.p2.world.narrowphase.contactEquations[i];

		if (c.bodyA === player.body.data || c.bodyB === player.body.data)
		{
			var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
			if (c.bodyA === player.body.data) d *= -1;
			if (d > 0.5) result = true;
		}
	}

	return result;

}