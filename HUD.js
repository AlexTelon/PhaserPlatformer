
HUD = function(game) {
	this.game = game;
	this.score = 0;
	this.scoreText = null;
};

HUD.prototype = {

	create: function() {
		this.scoreText = this.game.add.text(16, 16, '0/2 coins - Deaths: 0', { fontSize: '32px', fill: '#FFF' });
	}

};