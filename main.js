/*jshint browser: true, jquery: true*/

document.addEventListener("DOMContentLoaded", function () {
    var game = new Game();
    game.loadGame();

    var snakeGame;
    var $canvas = $('#canvas');
    snakeGame = new SnakeGame($canvas[0]);
    snakeGame.setup();
    snakeGame.init();

    var items = new Items();
    items.setup();
});

function Game() {
    var inventory = {
            apples: 0
        },
        unlocked = [];

    this.saveGame = function () {
        localStorage.invData = JSON.stringify(inventory);
        localStorage.unlockData = JSON.stringify(unlocked);
    };

    this.loadGame = function () {
        try {
            inventory = JSON.parse(localStorage.invData);
            unlocks = JSON.parse(localStorage.unlocked);
        } catch (e) {
            // don't do anything if it doesn't work - it'll take default values
        }

        addMessage("Game Loaded");
    };

    this.updateInfoBar = function () {
        $('#apples').text("Apples: " + inventory.apples);
        $('#score').text("Score: " + game.score);
    };

    this.addMessage = function (message) {
        $('#messages').prepend('<p>' + message + '</p>');
    };
}
