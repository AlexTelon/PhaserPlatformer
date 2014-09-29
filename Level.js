
Level = function(game) {

	this.game = game;
	this.stars = null;
	this.map = null;
	this.layer = [];
	this.currentLayer = null;
	this.gravityDir = 1;
	this.flipSwitch = false;

	this.mapObjects = null;
};

Level.prototype = {

	preload: function() {
		console.log("preload level");
		console.log("WE LOAD A NEW MAP");
		game.load.tilemap('map', 'level1.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
		game.load.image('coin', 'assets/sprites/coin.png');
	},

	create: function() {
		console.log("create level");

		game.physics.startSystem(Phaser.Physics.P2JS);

		//Setup the world and the upside down world

		this.game.stage.backgroundColor = '#2d2d2d';
		this.map = this.game.add.tilemap('map');

		this.map.addTilesetImage('ground_1x1');
		this.map.addTilesetImage('coin');

		this.layer[1] = this.map.createLayer('upsideDown');
		this.layer[1].resizeWorld();

		this.layer[0] = this.map.createLayer('Tile Layer 1');
		this.layer[0].resizeWorld();

		this.layer[0].alpha = 1;
		this.layer[1].alpha = 0.1;
		this.currentLayer = this.layer[0];

		//  Set the tiles for collision.
		//  Do this BEFORE generating the p2 bodies below.
		this.map.setCollisionBetween(1, 12, true, this.currentLayer, true);

		//  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
		//  This call returns an array of body objects which you can perform addition actions on if
		//  required. There is also a parameter to control optimising the map build.
		this.mapObjects = this.game.physics.p2.convertTilemap(this.map, this.currentLayer);

		game.physics.p2.restitution = 0;
		game.physics.p2.gravity.y = 500;

		// create a group for stars
		this.stars = game.add.group();
		this.stars.enableBody = true;
		this.game.physics.p2.enable(this.stars);

		//  Here we'll create 12 of them evenly spaced apart
		for (var i = 0; i < 12; i++)
		{
			//  Create a star inside of the 'stars' group
			var star = this.stars.create(i * 70, 0, 'star');
			//  Let gravity do its thing
			star.body.gravity.y = 700;

			//  This just gives each star a slightly random bounce value
			star.body.bounce.y = 0.7 + Math.random() * 0.2;
		}
	},

	flipMap: function() {
		this.setUpMapSwitch();
	},

	update: function() {
	},

	setUpMapSwitch: function() {
		console.log("SetUpMapSwitch");
		this.mapObjects.forEach(function(obj) {
			// TODO this might be really inefficent..
			// And I thinkg setCollisionBetween(1,12,false...) should do this instead.
			obj.clearShapes();
		});
		//console.log("mapObjects");
		//console.log(this.mapObjects);

		this.game.stage.backgroundColor = '#2d2d2d';

		this.map.removeAllLayers();
		this.map.destroy();
		//this.layer // do something here to remove old sprites

		this.map = this.game.add.tilemap('map');
		console.log(this.map.game);
		this.map.addTilesetImage('ground_1x1');
		if(this.flipSwitch) {
			//this.layer = this.map.createBlankLayer();
			this.currentLayer = this.layer[1];
			this.layer[0].alpha = 0.1;
			this.layer[1].alpha = 1;
			this.flipSwitch = false;
		}
		else {
			this.currentLayer = this.layer[0];
			this.layer[0].alpha = 1;
			this.layer[1].alpha = 0.1;
			this.flipSwitch = true;
		}

		// clear old collisions first
		// wont work..
		//this.map.setCollisionBetween(1, 12, false, this.currentLayer, true);
		//  Set the tiles for collision.
		//  Do this BEFORE generating the p2 bodies below.
		this.map.setCollisionBetween(1, 12, true, this.currentLayer, true);

		//  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
		//  This call returns an array of body objects which you can perform addition actions on if
		//  required. There is also a parameter to control optimising the map build.
		this.mapObjects = this.game.physics.p2.convertTilemap(this.map, this.currentLayer);

	}
};
