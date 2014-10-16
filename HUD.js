
HUD = function(game) {
	this.game = game;
	this.score = 0;
	this.scoreText = null;
};

HUD.prototype = {

	create: function() {
		//	this.scoreText = this.game.add.text(32, 32, 'Coins collected: 0 of ', { fontSize: '32px', fill: '#FFF' });
	}

};