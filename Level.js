
Level = function(game, player) {

	this.game = game;
	this.player = player;
	this.map = null;
	this.layer = [];
	this.currentLayer = null;
	this.flipSwitch = false;

	this.mapObjects = null;
};

Level.prototype = {

	preload: function() {
		game.load.tilemap('map', 'levels.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
		game.load.spritesheet('coin', 'assets/sprites/coin.png', 32, 32);

		game.load.image('stars', 'assets/misc/starfield.jpg');
		game.load.spritesheet('ship', 'assets/sprites/humstar.png', 32, 32);
		game.load.image('panda', 'assets/sprites/spinObj_01.png');
		game.load.image('sweet', 'assets/sprites/spinObj_06.png');

		game.physics.startSystem(Phaser.Physics.P2JS);
	},

	create: function() {

		// so we get collision callbacks
		this.game.physics.p2.setImpactEvents(true);
		this.game.physics.p2.restitution = 0;
		this.game.physics.p2.gravity.y = 500;


		//  Create our collision groups. One for the player, one for the pandas
		this.playerCollisionGroup = game.physics.p2.createCollisionGroup();

		//  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
		//  (which we do) - what this does is adjust the bounds to use its own collision group.
		game.physics.p2.updateBoundsCollisionGroup();


		//  Create our ship sprite
		ship = game.add.sprite(200, 200, 'ship');
		ship.scale.set(2);
		ship.smoothed = false;
		ship.animations.add('fly', [0,1,2,3,4,5], 10, true);
		ship.play('fly');

		game.physics.p2.enable(ship, false);
		ship.body.setCircle(28);
		ship.body.fixedRotation = true;

		//  Set the ships collision group
		ship.body.setCollisionGroup(this.playerCollisionGroup);
		this.player.sprite.body.setCollisionGroup(this.playerCollisionGroup);

		//  The ship will collide with the pandas, and when it strikes one the hitPanda callback will fire, causing it to alpha out a bit
		//  When pandas collide with each other, nothing happens to them.
	//	ship.body.collides(pandaCollisionGroup, hitPanda, this);

		game.camera.follow(ship);

		cursors = game.input.keyboard.createCursorKeys();

		this.player.setStartPos(300,200);

		//Setup both the different levels

		this.game.stage.backgroundColor = '#2d2d2d';
		this.map = this.game.add.tilemap('map');

		this.map.addTilesetImage('ground_1x1');
		this.map.addTilesetImage('coin');

		this.layer[1] = this.map.createLayer('level2UD');
		this.layer[1].resizeWorld();

		this.layer[0] = this.map.createLayer('level2');
		this.layer[0].resizeWorld();

		this.layer[0].alpha = 1;
		this.layer[1].alpha = 0.3;
		this.currentLayer = this.layer[0];

		//  Set the tiles for collision.
		//  Do this BEFORE generating the p2 bodies below.
		this.map.setCollisionBetween(1, 12, true, this.currentLayer, true);

		//  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
		//  This call returns an array of body objects which you can perform addition actions on if
		//  required. There is also a parameter to control optimising the map build.
		this.mapObjects = this.game.physics.p2.convertTilemap(this.map, this.currentLayer);

		this.mapCollisionGroup = this.game.physics.p2.createCollisionGroup();

		this.mapObjects.forEach(function(body) {
			body.setCollisionGroup(this.mapCollisionGroup);
			body.collides([this.mapCollisionGroup, this.playerCollisionGroup]);
		//	this.mapGroup.addBody(body);
			//body.setCollision(this.playerCollisionGroup);
		}, this);

		ship.body.collides(this.mapCollisionGroup);
		this.player.sprite.body.collides(this.mapCollisionGroup);

		// Setup all collisions
	//	this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
//		this.game.physics.p2.updateBoundsCollisionGroup();


		this.coinGroup = this.game.add.group();
		this.coinGroup.enableBody = true;
		//this.coinGroup.physicsBodyType = Phaser.Physics.P2JS;

		// Använd nedanstående grej för att skapa coin sprites och gör sedan normala collisioner med dem! :)
		this.map.createFromObjects('level2OBJ', 26, 'coin', 0, true, false, this.coinGroup);

		this.coinCollisionGroup = this.game.physics.p2.createCollisionGroup();

		for (var i = 0; i < this.coinGroup.length; i++) {
			var coin = this.coinGroup.getAt(i);
			console.log(coin.body);
			console.log(this.playerCollisionGroup);
			console.log(coin.body.setCollisionGroup);
		//	coin.body.setCollisionGroup(this.coinCollisionGroup);
		//	coin.body.collides(this.playerCollisionGroup);
		}

		//  Add animations to all of the coin sprites
		this.coinGroup.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5], 10, true);
		this.coinGroup.callAll('animations.play', 'animations', 'spin');
		//this.coinGroup.callAll('body.setCollisionGroup', this, this.mapCollisionGroup);
		//this.coinGroup.callAll('body.collides', this, this.playerCollisionGroup);


		//this.player.sprite.body.collides(this.coinCollisionGroup, function() {console.log("coin");}, this);
		//ship.body.collides(this.coinCollisionGroup);


	},

	flipMap: function() {
		this.setUpMapSwitch();
	},

	update: function() {

		ship.body.setZeroVelocity();

		if (cursors.left.isDown)
		{
			ship.body.moveLeft(200);
		}
		else if (cursors.right.isDown)
		{
			ship.body.moveRight(200);
		}

		if (cursors.up.isDown)
		{
			ship.body.moveUp(200);
		}
		else if (cursors.down.isDown)
		{
			ship.body.moveDown(200);
		}

	},

	setUpMapSwitch: function() {
		this.mapObjects.forEach(function(obj) {
			// TODO this might be really inefficent..
			// And I thinkg setCollisionBetween(1,12,false...) should do this instead.
			obj.clearShapes();
		});

		this.game.stage.backgroundColor = '#2d2d2d';

		// TODO this probably is the bottleneck, flipping the map makes the game REALLY slow after a while.
		this.map = this.game.add.tilemap('map');
		this.map.addTilesetImage('ground_1x1');
		if(this.flipSwitch) {
			this.currentLayer = this.layer[0];
			this.layer[0].alpha = 1;
			this.layer[1].alpha = 0.3;
			this.flipSwitch = false;
		}
		else {
			this.currentLayer = this.layer[1];
			this.layer[0].alpha = 0.3;
			this.layer[1].alpha = 1;
			this.flipSwitch = true;
		}

		//  Set the tiles for collision.
		//  Do this BEFORE generating the p2 bodies below.
		this.map.setCollisionBetween(1, 12, true, this.currentLayer, true);

		//  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
		//  This call returns an array of body objects which you can perform addition actions on if
		//  required. There is also a parameter to control optimising the map build.
		this.mapObjects = this.game.physics.p2.convertTilemap(this.map, this.currentLayer);

		this.mapObjects.forEach(function(body) {
			body.setCollisionGroup(this.mapCollisionGroup);
			body.collides([this.mapCollisionGroup, this.playerCollisionGroup]);
			//	this.mapGroup.addBody(body);
			//body.setCollision(this.playerCollisionGroup);
		}, this);
	}

};

function hitPanda(body1, body2) {

	//  body1 is the space ship (as it's the body that owns the callback)
	//  body2 is the body it impacted with, in this case our panda
	//  As body2 is a Phaser.Physics.P2.Body object, you access its own (the sprite) via the sprite property:
	body2.sprite.alpha -= 0.1;

}