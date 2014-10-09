var dudegame =dudegame || {};

dudegame.game = new Phaser.Game(800, 600, Phaser.AUTO, '');

var game = dudegame.game;
dudegame.player = null;
var level = null;
var hud = null;
dudegame.keys = null;
//var level1 = null;

// take a step back and rearange stuff after how states work, okey?
// right now the player.sprite.body disapears when we reach the creation part of level 1 down in create below.
// maybe this fila should NOT be a state, but every level, a mainmenue and a pause screen should. Then we could
// do a preload and a boot state too, but then the level/player/HUD/key -code would be back at one these files..

/*
 Kanske lättast att ge upp att ha tangenterna i en egen "klass" Det blir enklare så och det är inte så mycket logik.
 */

dudegame.game.state.add('Preload',dudegame.Preload); // loads all the data/files
dudegame.game.state.add('MainMenu',dudegame.MainMenu); // just a simple MainMenu
dudegame.game.state.add('Player',dudegame.Player); // just a simple MainMenu
dudegame.game.state.add('level1',dudegame.level1); // loads player?
dudegame.game.state.add('level2',dudegame.level2);
dudegame.game.state.add('level3',dudegame.level3);

dudegame.game.state.start('Preload');



/*
// must run player before level
dudegame.player = dudegame.player.create();
//keys.create(dudegame.player.sprite); // we need to update player again so that player has a body.

game.state.add('level1', dudegame.level1);
//level1 = new dudegame.level1(game,player);
game.state.start('level1',false,false);
//level.create();
// level below is null
dudegame.keys = new Keys(dudegame.game, this.level, dudegame.player.sprite); //this hurts a little to do.. If I have time I will look into this.
dudegame.keys.create(dudegame.player.sprite);

hud = new HUD(game);
hud.create();
*/