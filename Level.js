
Level = function(game) {

	this.game = game;
	this.stars = null;

	this.map = null;
	this.layer = null;
};

Level.prototype = {

	preload: function() {
		game.load.tilemap('map', 'assets/tilemaps/maps/collision_test.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
		game.load.image('walls_1x2', 'assets/tilemaps/tiles/walls_1x2.png');
		game.load.image('tiles2', 'assets/tilemaps/tiles/tiles2.png');
	},

	create: function() {
		game.physics.startSystem(Phaser.Physics.P2JS);

		game.stage.backgroundColor = '#2d2d2d';

		map = game.add.tilemap('map');

		map.addTilesetImage('ground_1x1');
		map.addTilesetImage('walls_1x2');
		map.addTilesetImage('tiles2');

		layer = map.createLayer('Tile Layer 1');

		layer.resizeWorld();

		//  Set the tiles for collision.
		//  Do this BEFORE generating the p2 bodies below.
		map.setCollisionBetween(1, 12);

		//  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
		//  This call returns an array of body objects which you can perform addition actions on if
		//  required. There is also a parameter to control optimising the map build.
		game.physics.p2.convertTilemap(map, layer);

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

	update: function() {
	//	this.game.physics.p2.collide(this.stars, level.layer);
	}

};