/*jshint browser: true, jquery: true*/

var game;

document.addEventListener("DOMContentLoaded", function () {
    game = new Game();
    game.setup();
});

function Game() {
    var self = this,
        items;

    this.snakeGame = null;

    this.unlocked = [];
    this.unlockable = ['shop'];
    this.inventory = {
        apples: 0
    };

    this.setup = function () {
        game.loadGame();

        var $canvas = $('#canvas');

        self.snakeGame = new SnakeGame($canvas[0]);
        self.snakeGame.setup();

        items = new Items();
        items.setup();
    };

    this.saveGame = function () {
        localStorage.inventory = JSON.stringify(self.inventory);
        localStorage.unlocked = JSON.stringify(self.unlocked);
        localStorage.unlockable = JSON.stringify(self.unlockable);
    };

    this.loadGame = function () {
        try {
            self.inventory = JSON.parse(localStorage.inventory);
            self.unlocked = JSON.parse(localStorage.unlocked);
            self.unlockable = JSON.parse(localStorage.unlockable);
        } catch (e) {
            // don't do anything if it doesn't work - it'll take default values
        }

        self.addMessage("Game Loaded");
    };

    this.updateInfoBar = function () {
        $('#apples').text("Apples: " + self.inventory.apples);
        $('#score').text("Score: " + self.snakeGame.score);
    };

    this.addMessage = function (message) {
        $('#messages').prepend('<p>' + message + '</p>');
    };

    this.checkEmptyShop = function () {
        if (self.unlockable.length === 0) {
            $('#items').append("<p id='empty'>There's nothing to buy...</p>");
        }
    };
}
