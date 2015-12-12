/*jshint browser: true, jquery: true*/

var game;

document.addEventListener("DOMContentLoaded", function () {
    game = new Game();
    game.setup();
});

function Game() {
    var self = this,
        snakeGame,
        items,
        unlocked = [];

    this.inventory = {
        apples: 0
    };

    this.setup = function () {
        game.loadGame();

        var $canvas = $('#canvas');
        snakeGame = new SnakeGame($canvas[0]);
        snakeGame.setup();
        snakeGame.init();

        items = new Items();
        items.setup();
    };

    this.saveGame = function () {
        localStorage.invData = JSON.stringify(self.inventory);
        localStorage.unlockData = JSON.stringify(unlocked);
    };

    this.loadGame = function () {
        try {
            self.inventory = JSON.parse(localStorage.invData);
            unlocked = JSON.parse(localStorage.unlocked);
        } catch (e) {
            // don't do anything if it doesn't work - it'll take default values
        }

        self.addMessage("Game Loaded");
    };

    this.updateInfoBar = function () {
        $('#apples').text("Apples: " + self.inventory.apples);
        $('#score').text("Score: " + snakeGame.score);
    };

    this.addMessage = function (message) {
        $('#messages').prepend('<p>' + message + '</p>');
    };
}
