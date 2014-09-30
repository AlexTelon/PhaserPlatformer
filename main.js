var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var player = null;
var level = null;
var hud = null;
var keys = null;

function preload()
{
	level = new Level(game);
	level.preload();

	player = new Player(game);
	player.preload();

	keys = new Keys(game, level, player); //this hurts a little to do.. If I have time I will look into this.

	hud = new HUD(game);
}

function create()
{
	level.create();
	player = player.create();
	level.setPlayer(player); // ugly, will refactor later
	keys.create(player.player); // we need to update player again so that player has a body.
	hud.create();

}

function update()
{
	level.update();
	player.update();
	keys.update();
}