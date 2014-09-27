/**
 OK, this is not optimal maybe since we are creating a log of dependencies from keys to level and player..
 **/

Keys = function(game, level, player) {

	this.game = game;
	this.level = level;
	this.player= player;

	// Key thingies
	this.cursors = null;
	this.jumpButton = null;
	this.flipWorld = null;
};

Keys.prototype = {

	create: function (player) {
		this.player = player;

		this.cursors = this.game.input.keyboard.createCursorKeys();

		// Keys
		this.flipWorld = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
//		this.flipWorld.onDown.add(this.player.flip, this.player);
		this.flipWorld.onDown.add(this.level.flipMap, this.level);
	},

	update: function() {
		this.player.body.velocity.x = 0;

		if(this.cursors.left.isDown)
		{
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
