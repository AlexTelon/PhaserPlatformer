
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
		game.load.spritesheet('coin', 'assets/sprites/coin.png', 32, 32);
	},

	create: function() {
		game.physics.startSystem(Phaser.Physics.P2JS);

		// so we get collision callbacks
		this.game.physics.p2.setImpactEvents(true);

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

		// Setup all collisions
		this.mapCollisionGroup = this.game.physics.p2.createCollisionGroup();
		this.coinCollisionGroup = this.game.physics.p2.createCollisionGroup();
		this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
		this.game.physics.p2.updateBoundsCollisionGroup();

		this.mapGroup = this.game.add.group();
		this.mapGroup.enableBody = true;
		this.mapGroup.physicsBodyType = Phaser.Physics.P2JS;
		// Fortsätt här och försök efterfölja testStuff.html och hur de gör med pandorna och spelaren. Har ju bara missat
		// nåt litet här..
		this.mapGroup.

		this.mapObjects.forEach(function(body) {
			body.setCollisionGroup(this.mapCollisionGroup);
		}, this);

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
		this.coinGroup = this.game.add.group();
		this.coinGroup.enableBody = true;
		//this.coinGroup.physicsBodyType = Phaser.Physics.P2JS;

		// Använd nedanstående grej för att skapa coin sprites och gör sedan normala collisioner med dem! :)
		this.map.createFromObjects('level2OBJ', 26, 'coin', 0, true, false, this.coinGroup);

		//  Add animations to all of the coin sprites
		this.coinGroup.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5], 10, true);
		this.coinGroup.callAll('animations.play', 'animations', 'spin');


		console.log(this.coinGroup.children[0].body);
		console.log(this.coinCollisionGroup);
		this.player.player.body.setCollisionGroup(this.playerCollisionGroup);
		this.coinGroup.children[0].body.setCollisionGroup(this.coinCollisionGroup);
		this.player.player.body.collides(this.coinCollisionGroup, this.player.collectCoin);
		this.player.player.body.collides([this.mapCollisionGroup, this.playerCollisionGroup]);
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
