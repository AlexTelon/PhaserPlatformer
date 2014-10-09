var dudegame = dudegame || {};

dudegame.level1 = function(){};

dudegame.level1.prototype = {

	init: function() {
		this.game = dudegame.game;
		this.player = dudegame.player;
	//	dudegame.level1.player = dudegame.player;
		this.map = null;
		this.layer = [];
		this.currentLayer = null;
		this.flipSwitch = false;
		this.mapObjects = null;

		this.cursors = this.game.input.keyboard.createCursorKeys();
	},

	preload: function() {
		game.load.tilemap('map', 'levels.json', null, Phaser.Tilemap.TILED_JSON);
	},

	create: function() {

		//this.game.physics.startSystem(Phaser.Physics.P2JS);
		// so we get collision callbacks
		this.game.physics.p2.setImpactEvents(true);
		this.game.physics.p2.restitution = 0;
		this.game.physics.p2.gravity.y = 500;


		//  Create our collision groups. One for the player, one for the pandas
		this.playerCollisionGroup = game.physics.p2.createCollisionGroup();

		//  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
		//  (which we do) - what this does is adjust the bounds to use its own collision group.
		game.physics.p2.updateBoundsCollisionGroup();

		dudegame.player.sprite.body.setCollisionGroup(this.playerCollisionGroup);

		dudegame.player.setStartPos(100,200);
		//Setup the different levels

		this.sky = game.add.tileSprite(0, 0, 800, 600, 'sky');
		this.sky.fixedToCamera = true;
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
		}, this);

		dudegame.player.sprite.body.collides(this.mapCollisionGroup);

		this.coinGroup = this.game.add.group();
		this.coinGroup.enableBody = true;
		this.coinGroup.physicsBodyType = Phaser.Physics.P2JS;

		// Använd nedanstående grej för att skapa coin sprites och gör sedan normala collisioner med dem! :)
		this.map.createFromObjects('level2OBJ', 26, 'coin', 0, true, false, this.coinGroup);

		for (var i = 0; i < this.coinGroup.length; i++) {
			var coin = this.coinGroup.getAt(i).body;
			coin.setCollisionGroup(this.mapCollisionGroup);
			coin.static = true;
		}

		//  Add animations to all of the coin sprites
		this.coinGroup.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5], 10, true);
		this.coinGroup.callAll('animations.play', 'animations', 'spin');

		game.physics.p2.setPostBroadphaseCallback(checkCollision, this);

		this.coinSound = this.game.add.audio('coin');
		this.music = this.game.add.audio('music');
		this.music.play('',0,0,true);

		this.playerGroup = game.add.group();
		this.playerGroup.add(dudegame.player.sprite);

		// flip the world key
		this.flipWorld = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.flipWorld.onDown.add(this.flipMap, this);

	},

	flipMap: function() {
		this.setUpMapSwitch();
	},

	update: function() {

		// the level itself keeps track of if the player has fallen of a ledge,
		// this because some levels might not want/need this logic so it does not
		// have to be in player.
		if(this.player.sprite.y >= this.game.world.height) {
			this.player.handleEventualDeath();
		}

		dudegame.keys.update();
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
		}, this);
	}
};

function checkCollision(body1, body2) {

	//  To explain - the post broadphase event has collected together all potential collision pairs in the world
	//  It doesn't mean they WILL collide, just that they might do.

	//  This callback is sent each collision pair of bodies. It's up to you how you compare them.
	//  If you return true then the pair will carry on into the narrow phase, potentially colliding.
	//  If you return false they will be removed from the narrow phase check all together.

	//  In this simple example if one of the bodies is our space ship,
	//  and the other body is the green pepper sprite (frame ID 4) then we DON'T allow the collision to happen.
	//  Usually you would use a collision mask for something this simple, but it demonstates use.

	// only player vs world can happen, so both cant be null.
	if (body1.sprite != null && body2.sprite != null) {
		if ((body1.sprite.name === 'player' && body2.sprite.name === 'coin' ) || (body2.sprite.name === 'player' && body1.sprite.name === 'coin')) {
			dudegame.player.collectCoin();
			this.coinSound.play();

			if (body2.sprite.name === 'coin') {
				body2.sprite.kill();
			} else {
				body1.sprite.kill();
			}
			return false;
		}
	}
	return true;

}