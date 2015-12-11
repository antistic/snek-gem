/*jshint browser: true, jquery: true*/
var inventory = {
    apples: 0
};

document.addEventListener("DOMContentLoaded", function () {
    setup();
    init();
});

var saveGame = function () {
    localStorage.invData = JSON.stringify(inventory);
    localStorage.unlockData = JSON.stringify(unlocks);
};

var loadGame = function () {
    try {
        inventory = JSON.parse(localStorage.invData);
        unlocks = JSON.parse(localStorage.unlockData);
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

// what happens every tick
var Tick = function () {
    snake.changeDir(game.direction);
    snake.move(context);
    updateInfoBar();
};
