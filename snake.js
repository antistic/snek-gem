/*jshint browser: true, jquery: true*/
var canvas, context,
    snakeCell, foodCell,
    grid = {
        cellSize: 16,
        height: 16,
        width: 25
    },
    game = {
        timer: null,
        direction: 'E',
        food: [],
        score: 0,
        apples: 0,
    },
    inventory = {
        apples: 0
    },
    snake;

CanvasRenderingContext2D.prototype.drawInCell = function (image, X, Y) {
    // draws image in a gridcell
    this.drawImage(image, X * grid.cellSize, Y * grid.cellSize);
};

CanvasRenderingContext2D.prototype.clearCell = function (colour, X, Y) {
    // clears a gridcell
    this.fillStyle = colour;
    this.fillRect(X * grid.cellSize, Y * grid.cellSize, grid.cellSize, grid.cellSize);
};

CanvasRenderingContext2D.prototype.fillAll = function (canvas, colour) {
    // fills the whole canvas with a colour
    this.fillStyle = colour;
    this.fillRect(0, 0, canvas.width, canvas.height);
};

var saveGame = function () {
    localStorage.saveData = JSON.stringify(inventory);
};

var loadGame = function () {
    if (localStorage.saveData !== undefined) {
        inventory = JSON.parse(localStorage.saveData);
    }

    addMessage("Game Loaded");
};

var opp = function (dir) {
    switch (dir) {
    case "N":
        return "S";
    case "S":
        return "N";
    case "W":
        return "E";
    case "E":
        return "W";
    }
};

function Coord(x, y) {
    this.x = x;
    this.y = y;

    this.N = function () {
        return new Coord(this.x, this.y - 1);
    };
    this.E = function () {
        return new Coord(this.x + 1, this.y);
    };
    this.S = function () {
        return new Coord(this.x, this.y + 1);
    };
    this.W = function () {
        return new Coord(this.x - 1, this.y);
    };
}

var coordInArray = function (coord, coordArray) {
    var cx = coord.x,
        cy = coord.y;
    for (var i = 0; i < coordArray.length; i++) {
        if ((cx === coordArray[i].x) && (cy === coordArray[i].y)) {
            return i;
        }
    }

    return -1;
};

var addMessage = function (message) {
    $('#messages').prepend('<p>' + message + '</p>');
};

var randomCoord = function (coordArray) {
    var newCoord;

    newCoord = new Coord(Math.floor(Math.random() * grid.width),
        Math.floor(Math.random() * grid.height));

    if (coordInArray(newCoord, coordArray) !== (-1)) {
        newCoord = randomCoord(coordArray);
    }

    return newCoord;
};

function Snek(bodyList, direction) {
    this.body = bodyList;
    var dir = direction;

    this.drawSnek = function (ctx) {
        for (var i = 0; i < this.body.length; i++) {
            ctx.drawInCell(snakeCell, this.body[i].x, this.body[i].y);
        }
    };

    this.changeDir = function (newDir) {
        if (dir === opp(newDir)) {
            return;
        } else {
            dir = newDir;
        }
    };

    this.move = function (ctx) {
        var newHead;
        switch (dir) {
        case 'N':
            newHead = this.body[0].N();
            break;
        case 'E':
            newHead = this.body[0].E();
            break;
        case 'S':
            newHead = this.body[0].S();
            break;
        case 'W':
            newHead = this.body[0].W();
            break;
        default:
            throw "Error: not a direction";
        }

        // if you crashed into the wall
        if (newHead.x < 0 || newHead.x >= grid.width || newHead.y < 0 || newHead.y >= grid.height) {
            gameOver();
            return;
        }

        // if you didn't have food
        var foodCollision = coordInArray(newHead, game.food);
        if (foodCollision === (-1)) {
            var end = this.body.pop();
            ctx.clearCell("black", end.x, end.y);
        } else {
            // if you had food
            game.score++;
            inventory.apples++;
            saveGame();
            // remove from foodlist
            game.food.splice(foodCollision, 1);
            game.makeFood(context, snake.body.concat(newHead));
        }

        // if you crashed into yourself
        if (coordInArray(newHead, this.body) !== -1) {
            gameOver();
            return;
        }

        // add newhead to the snake
        this.body.unshift(newHead);

        // draw new head
        ctx.drawInCell(snakeCell, newHead.x, newHead.y);
    };
}

var makeBlockImg = function (colour) {
    var cvs = document.createElement('canvas'),
        ctx = cvs.getContext('2d');

    cvs.width = grid.cellSize;
    cvs.height = grid.cellSize;

    ctx.fillStyle = colour;
    ctx.fillRect(1, 1, grid.cellSize - 2, grid.cellSize - 2);

    var newImg = new Image();
    newImg.src = cvs.toDataURL("image/png");

    return newImg;
};

var gameOver = function () {
    clearInterval(game.timer);
    saveGame();
    addMessage('Game over. Score: ' + game.score);

    $('#game').append('<div id="gameOverOverlay"><p>gem over <span>click or press arrow keys</span></p></div>');

    $('#gameOverOverlay').height(canvas.height);
    $('#gameOverOverlay').width(canvas.width);

    context.fillAll("black");

    game.timer = null;

    $('#gameOverOverlay').click(function () {
        init();
    });

    // short delay so that keymashing doesn't restart immediately
    setTimeout(function () {
        document.onkeydown = function () {
            init();
        };
    }, 200);
};

game.makeFood = function (ctx, coordArray) {
    var foodCoord = randomCoord(coordArray);
    game.food.push(foodCoord);
    ctx.drawInCell(foodCell, foodCoord.x, foodCoord.y);
};

var setup = function () {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    canvas.height = grid.cellSize * grid.height;
    canvas.width = grid.cellSize * grid.width;


    // sizes
    $('#info').width(canvas.width);
    $('#messages').height(canvas.height);

    snakeCell = makeBlockImg("white");
    foodCell = makeBlockImg("white");

    loadGame();
};

var init = function () {
    document.onclick = null;
    document.onkeydown = movementHandler;

    $('#gameOverOverlay').remove();
    context.fillAll(canvas, "Black");

    game.direction = 'E';
    game.score = 0;
    updateInfoBar();
    snake = new Snek([new Coord(11, 10), new Coord(10, 10), new Coord(9, 10)],
        "E");
    snake.drawSnek(context);
    game.food = [];
    game.makeFood(context, snake.body);

    if (game.timer === null) {
        game.timer = window.setInterval(function () {
            Tick();
        }, 200);
    }
};

var updateInfoBar = function () {
    $('#apples').text("Apples: " + inventory.apples);
    $('#score').text("Score: " + game.score);
};

var movementHandler = function (e) {
    e = e || window.event;
    switch (e.keyCode) {
    case 38:
        game.direction = "N";
        break;
    case 40:
        game.direction = "S";
        break;
    case 37:
        game.direction = "W";
        break;
    case 39:
        game.direction = "E";
        break;
    }
};

var Tick = function () {
    snake.changeDir(game.direction);
    snake.move(context);
    updateInfoBar();
};

document.addEventListener("DOMContentLoaded", function () {
    setup();
    init();
});
