/*jshint browser: true, jquery: true*/
var inventory = {
        apples: 0
    },
    unlocked = [],
    snakeGame;

document.addEventListener("DOMContentLoaded", function () {
    loadGame();

    var $canvas = $('#canvas');
    snakeGame = new SnakeGame($canvas[0]);
    snakeGame.setup();
    snakeGame.init();

    var items = new Items();
    items.setup();
});

var saveGame = function () {
    localStorage.invData = JSON.stringify(inventory);
    localStorage.unlockData = JSON.stringify(unlocked);
};

var loadGame = function () {
    try {
        inventory = JSON.parse(localStorage.invData);
        unlocks = JSON.parse(localStorage.unlocked);
    } catch (e) {
        // don't do anything if it doesn't work - it'll take default values
    }

    addMessage("Game Loaded");
};

var updateInfoBar = function () {
    $('#apples').text("Apples: " + inventory.apples);
    $('#score').text("Score: " + game.score);
};


var addMessage = function (message) {
    $('#messages').prepend('<p>' + message + '</p>');
};
