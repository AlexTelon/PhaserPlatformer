
Level = function(game, player) {

	this.game = game;
	this.player = player;
	this.map = null;
	this.layer = [];
	this.currentLayer = null;
	this.flipSwitch = false;
	this.collectedCoins = 0;
	this.currentLevel = 1;
	this.changeOfLevel = false;
	this.mapObjects = null;
};

Level.prototype = {

	preload: function() {
		game.load.tilemap('map', 'levels.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
		game.load.image('platformer_tiles_2x', 'assets/tilemaps/tiles/platformer_tiles_2x.png');
		game.load.spritesheet('coin', 'assets/sprites/coin.png', 32, 32);

		game.load.image('sky', 'assets/skies/sky4.png');

		game.load.audio('coin', 'assets/audio/SoundEffects/p-ping.mp3');
		game.load.audio('music', 'assets/audio/sd-ingame1.wav');

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

		this.player.sprite.body.setCollisionGroup(this.playerCollisionGroup);

		this.sky = game.add.tileSprite(0, 0, 800, 600, 'sky');
		this.sky.fixedToCamera = true;

		this.coinGroup = this.game.add.group();
		this.coinGroup.enableBody = true;
		this.coinGroup.physicsBodyType = Phaser.Physics.P2JS;

		// here we will put the player position sprite from the map
		this.playerPositionGroup = this.game.add.group();

		this.map = this.game.add.tilemap('map');
		this.map.addTilesetImage('ground_1x1');
		this.map.addTilesetImage('platformer_tiles_2x');
		this.map.addTilesetImage('coin');

		//Setup the different levels
		this.setupLevel();

		game.physics.p2.setPostBroadphaseCallback(checkCollision, this);

		this.coinSound = this.game.add.audio('coin');
		this.music = this.game.add.audio('music');
		this.music.play('',0,0.0,true);

		this.playerGroup = game.add.group();
		this.playerGroup.add(this.player.sprite);

	},

	flipMap: function() {
		this.setUpMapSwitch();
	},

	update: function() {
		if(this.changeOfLevel) {
			this.changeOfLevel = false;
			this.setupLevel();
		}
	},

	setUpMapSwitch: function() {

		if (this.mapObjects !== null) {
			this.mapObjects.forEach(function (body) {
				body.remove;
				body.removeFromWorld();
			});
		}

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
		this.map.setCollisionBetween(1, 144, true, this.currentLayer, true);

		//  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
		//  This call returns an array of body objects which you can perform addition actions on if
		//  required. There is also a parameter to control optimising the map build.
		this.mapObjects = this.game.physics.p2.convertTilemap(this.map, this.currentLayer);

		this.mapObjects.forEach(function(body) {
			body.setCollisionGroup(this.mapCollisionGroup);
			body.collides([this.mapCollisionGroup, this.playerCollisionGroup]);
		}, this);
	},

	setupLevel: function() {

		if (this.mapObjects !== null) {
			this.mapObjects.forEach(function (body) {
				body.removeFromWorld();
			});
		}

		console.log(this.layer.length);
		if(this.layer.length != 0) {
			this.layer[0].renderable = false;
			this.layer[1].renderable = false;
			this.layer[0].visible = false;
			this.layer[1].visible = false;
		}

		this.map.destroy();
		this.map = this.game.add.tilemap('map');
		this.map.addTilesetImage('platformer_tiles_2x');
		this.map.addTilesetImage('ground_1x1');
		this.map.addTilesetImage('coin');

		var level = 'A' + this.currentLevel.toString();
		var levelUD = level + 'UD';
		var levelOBJ = level + 'OBJ';

		this.layer[0] = this.map.createLayer(level);
		this.layer[1] = this.map.createLayer(levelUD);
		this.map.createFromObjects(levelOBJ, 26, 'coin', 0, true, false, this.coinGroup);
		this.map.createFromObjects(levelOBJ, 145, 'coin', 0, true, false, this.playerPositionGroup);

		for (var i = 0; i < this.playerPositionGroup.length; i++) {
			var sprite = this.playerPositionGroup.getAt(i);
			if (sprite.name == 'playerPos') {
				console.log(sprite);
				this.player.setStartPos(sprite.x, sprite.y);
				// reset the players position for every new map
				this.player.sprite.reset(sprite.x, sprite.y);
				sprite.kill();
			}
		}

		this.layer[1].resizeWorld();
		this.layer[0].resizeWorld();

		this.layer[0].alpha = 1;
		this.layer[1].alpha = 0.3;
		this.currentLayer = this.layer[0];

		//  Set the tiles for collision.
		//  Do this BEFORE generating the p2 bodies below.
		this.map.setCollisionBetween(1, 144, true, this.currentLayer, true);

		//  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
		//  This call returns an array of body objects which you can perform addition actions on if
		//  required. There is also a parameter to control optimising the map build.
		this.mapObjects = this.game.physics.p2.convertTilemap(this.map, this.currentLayer);

		this.mapCollisionGroup = this.game.physics.p2.createCollisionGroup();

		this.mapObjects.forEach(function(body) {

			body.setCollisionGroup(this.mapCollisionGroup);
			body.collides([this.mapCollisionGroup, this.playerCollisionGroup]);
		}, this);

		this.player.sprite.body.collides(this.mapCollisionGroup);

		for (var i = 0; i < this.coinGroup.length; i++) {
			var coin = this.coinGroup.getAt(i).body;
				coin.setCollisionGroup(this.mapCollisionGroup);
				coin.static = true;
		}

		//  Add animations to all of the coin sprites
		this.coinGroup.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5], 10, true);
		this.coinGroup.callAll('animations.play', 'animations', 'spin');
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
			this.player.collectCoin();
			this.coinSound.play();
			this.collectedCoins++;
			if(this.collectedCoins == 2) {
				this.collectedCoins = 0;
				this.currentLevel++;
				this.changeOfLevel = true;
			}

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

