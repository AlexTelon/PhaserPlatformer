var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var player = null;
var level = null;
var hud = null;
var keys = null;

function preload()
{
	player = new Player(game);
	player.preload();

	level = new Level(game, player);
	level.preload();

	keys = new Keys(game, level, player); //this hurts a little to do.. If I have time I will look into this.

	hud = new HUD(game);
}

function create()
{
	// must run player before level
	player.create();
	level.create();
	keys.create(player.sprite); // we need to update player again so that player has a body.
	hud.create();
}

function update()
{
	level.update();
	player.update();
	keys.update();
}