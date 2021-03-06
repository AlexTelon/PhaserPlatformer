/**
 OK, this is not optimal maybe since we are creating a log of dependencies from keys to level and player..
 **/

Keys = function(game, level, player) {

	this.game = game;
	this.level = level;
	this.player= player;
	// Key thingies
	this.cursors = null;
	this.flipWorld = null;
};

Keys.prototype = {

	create: function (player) {
		this.player = player;

		this.cursors = this.game.input.keyboard.createCursorKeys();

		// Keys
		this.flipWorld = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.flipWorld.onDown.add(this.level.flipMap, this.level);
		this.jump = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		this.crouch = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		this.crouch.onUp.add(this.crouchReleased, this);
		this.crouch.onDown.add(this.crouchDown, this);


	},

	update: function() {
		// TODO keys should maybe only handle keys and let the player move itself?
		this.player.body.velocity.x = 0;
		var jumping = false;
		if (this.jump.isDown || this.cursors.up.isDown) {
			jumping = true;
		}


		if(this.cursors.left.isDown)
		{
			this.player.body.moveLeft(300);

			if (jumping) {
				this.player.animations.play('leftFly');
			}
			else
				this.player.animations.play('left');
		}
		else if(this.cursors.right.isDown)
		{
			this.player.body.moveRight(300);

			if (jumping) {
				this.player.animations.play('rightFly');
			}
			else
				this.player.animations.play('right');
		}
		else
		{
			this.player.animations.stop();
			this.player.frame = 4;
		}

		if (this.cursors.down.isDown) {
		}
		//  Allow the player to jump if they are touching the ground.
		if (jumping && checkIfCanJump(this.player))
		{
			this.player.body.moveUp(305);
		}

		// gives the user more options to steer the player in the air
		this.player.body.data.gravityScale = 1;
		if (this.cursors.up.isDown || this.jump.isDown) {
			this.player.body.data.gravityScale = 0.8;
		}

	},

	crouchReleased: function() {
		this.player.scale.y = 1;
		this.player.body.setRectangle(32,48,0,0,0);
		this.player.body.setCollisionGroup(this.level.playerCollisionGroup);
	},

	crouchDown: function() {
		this.player.scale.y = 0.5;
		this.player.body.setRectangle(32, 32, 0, 0, 0);
		this.player.body.setCollisionGroup(this.level.playerCollisionGroup);
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
