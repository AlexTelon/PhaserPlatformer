
Level = function(game) {

	this.game = game;
	this.player = null;
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
		game.load.image('coin', 'assets/sprites/coin.png');
	},

	create: function() {
		game.physics.startSystem(Phaser.Physics.P2JS);

		//Setup both the world and the upside down world
		this.game.stage.backgroundColor = '#2d2d2d';
		this.map = this.game.add.tilemap('map');

		this.map.addTilesetImage('ground_1x1');
		this.map.addTilesetImage('coin');

		this.layer[1] = this.map.createLayer('level3UD');
		this.layer[1].resizeWorld();

		this.layer[0] = this.map.createLayer('level1');
		this.layer[0].resizeWorld();

		this.layer[0].alpha = 1;
		this.layer[1].alpha = 0.3;
		this.currentLayer = this.layer[0];

		game.physics.p2.restitution = 0;
		game.physics.p2.gravity.y = 500;
	},

	flipMap: function() {
		this.setUpMapSwitch();
	},

	// Ugly as we have to do some of our create() things here.
	setPlayer: function(player) {
		this.player = player;
		this.player.setStartPos(300,200);
	this.player.body.createBodyCallback();
		console.log(this.game.physics);
		//this.game.physics.collide(this.player, this.map);
		// setup overlap detection between the coin tile and player
		// this.player as a callback context might be wrong, only this instead?
		this.map.setTileLocationCallback(45,2,1,1, this.player.collectCoin, this.player, this.layer[0]);
		this.map.setTileLocationCallback(1,10,2,2, this.player.collectCoin, this.player, this.layer[0]);
		this.map.setTileLocationCallback(45,15,2,2, this.player.collectCoin, this.player, this.layer[1]);
		this.map.setTileLocationCallback(1,7,1,1, this.player.collectCoin, this.player, this.layer[1]);
		console.log("the location callback is in place")
		console.log(this.map.getTile(1,10,this.layer[0]));
		console.log("now we MUST figure out how these callbacks are to be triggerd");

		//  Set the tiles for collision.
		//  Do this BEFORE generating the p2 bodies below.
		this.map.setCollisionBetween(1, 12, true, this.currentLayer, true);

		//  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
		//  This call returns an array of body objects which you can perform addition actions on if
		//  required. There is also a parameter to control optimising the map build.
		this.mapObjects = this.game.physics.p2.convertTilemap(this.map, this.currentLayer);

		this.game.physics.p2.setImpactEvents(true);
	},

	update: function() {
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
		console.log(this.map.game);
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
	}
};
