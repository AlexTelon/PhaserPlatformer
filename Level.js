
Level = function(game) {

	this.game = game;
	this.stars = null;
	this.map = null;
	this.layer = null;
	this.gravityDir = 1;
	this.flipSwitch = false;
};

Level.prototype = {

	preload: function() {
		console.log("preload level");
		game.load.tilemap('map', 'tile_collision_test.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
		game.load.image('walls_1x2', 'assets/tilemaps/tiles/walls_1x2.png');
		game.load.image('tiles2', 'assets/tilemaps/tiles/tiles2.png');
	},

	create: function() {
		console.log("create level");

		game.physics.startSystem(Phaser.Physics.P2JS);

		setUpMapSwitch();

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
		setUpMapSwitch();
	},

	update: function() {
	}
};


function setUpMapSwitch() {
	console.log("SetUpMapSwitch");
	this.game.stage.backgroundColor = '#2d2d2d';

	this.map = this.game.add.tilemap('map');
	this.map.removeAllLayers();
	this.map.destroy();
	this.layer

	this.map = this.game.add.tilemap('map');

	this.map.addTilesetImage('ground_1x1');

	if(this.flipSwitch) {
		this.layer = this.map.createLayer('upsideDown');
		this.flipSwitch = false;
	}
	else {
		this.layer = this.map.createLayer('Tile Layer 1');
		this.flipSwitch = true;
	}
	this.layer.resizeWorld();

	//  Set the tiles for collision.
	//  Do this BEFORE generating the p2 bodies below.
	this.map.setCollisionBetween(1, 12, true, this.layer, true);

	//  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
	//  This call returns an array of body objects which you can perform addition actions on if
	//  required. There is also a parameter to control optimising the map build.
	this.game.physics.p2.convertTilemap(this.map, this.layer);
}