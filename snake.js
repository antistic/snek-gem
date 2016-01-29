function SnakeGame(canvas) {
    var self = this,
        context,
        snekCell, foodCell,
        grid = {
            cellSize: 16,
            height: 16,
            width: 25
        },
        info = {
            timer: {
                timer: null,
            },
            direction: 'E',
            food: [],
            tickSpeed: 500,
            paused: false,
        },
        snek;

    this.score = 0;

    /* Drawing fun */
    function drawInCell(image, X, Y) {
        // draws image in a gridcell
        context.drawImage(image, X * grid.cellSize, Y * grid.cellSize);
    }

    function clearCell(colour, X, Y) {
        // clears a gridcell
        context.fillStyle = colour;
        context.fillRect(X * grid.cellSize, Y * grid.cellSize, grid.cellSize, grid.cellSize);
    }

    function fillAll(colour) {
        // fills the whole canvas with a colour
        context.fillStyle = colour;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    function makeBlockImg(colour) {
        var cvs = document.createElement('canvas'),
            ctx = cvs.getContext('2d');

        cvs.width = grid.cellSize;
        cvs.height = grid.cellSize;

        ctx.fillStyle = colour;
        ctx.fillRect(1, 1, grid.cellSize - 2, grid.cellSize - 2);

        var newImg = new Image();
        newImg.src = cvs.toDataURL("image/png");

        return newImg;
    }

    /* Coordinate fun */
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

    function opposite(dir) {
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
    }

    function findCoordInArray(coord, coordArray) {
        var x = coord.x,
            y = coord.y;
        for (var i = 0; i < coordArray.length; i++) {
            if ((x === coordArray[i].x) && (y === coordArray[i].y)) {
                return i;
            }
        }

        return -1;
    }

    function randomCoord(coordArray) {
        // gets a random coordinate in the grid
        // that isn't in coordArray
        var newCoord;

        newCoord = new Coord(Math.floor(Math.random() * grid.width),
            Math.floor(Math.random() * grid.height));

        if (findCoordInArray(newCoord, coordArray) !== (-1)) {
            newCoord = randomCoord(coordArray);
        }

        return newCoord;
    }

    /* Snake business */
    function Snek(bodyList, direction) {
        // coordinates of all the snek body parts
        this.body = bodyList;

        // the direction it's moving in currently
        var dir = direction;

        this.drawSnek = function () {
            for (var i = 0; i < this.body.length; i++) {
                drawInCell(snekCell, this.body[i].x, this.body[i].y);
            }
        };

        this.changeDir = function (newDir) {
            if (dir === opposite(newDir)) {
                return;
            } else {
                dir = newDir;
            }
        };

        this.move = function () {
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
            var foodCollision = findCoordInArray(newHead, info.food);
            if (foodCollision === (-1)) {
                var end = this.body.pop();
                clearCell("black", end.x, end.y);
            } else {
                // if you had food
                self.score++;
                game.inventory.apples++;
                game.saveGame();
                // remove from foodlist
                info.food.splice(foodCollision, 1);
                makeFood(snek.body.concat(newHead));
            }

            // if you crashed into yourself
            if (findCoordInArray(newHead, this.body) !== -1) {
                gameOver();
                return;
            }

            // add newhead to the snek
            this.body.unshift(newHead);

            // draw new head
            drawInCell(snekCell, newHead.x, newHead.y);
        };
    }

    /* actual snake game shenanigans */
    function makeFood(coordArray) {
        var foodCoord = randomCoord(coordArray);
        info.food.push(foodCoord);
        drawInCell(foodCell, foodCoord.x, foodCoord.y);
    }

    this.setup = function () {
        context = canvas.getContext('2d');
        canvas.height = grid.cellSize * grid.height;
        canvas.width = grid.cellSize * grid.width;

        // sizes
        $('#info').width(canvas.width);
        $('#mainInfo').height(canvas.height);
        $('#view').height(canvas.height);

        snekCell = makeBlockImg("white");
        foodCell = makeBlockImg("white");

        // starting visuals
        fillAll("black");
        $('#game').append('<div class="gameOverlay"><p>stert gem<span>click or press space</span></p></div>');
        $('.gameOverlay').height(canvas.height);
        $('.gameOverlay').width(canvas.width);
        game.updateInfoBar();

        // starting controls
        $('.gameOverlay').click(function () {
            self.init();
        });

        window.addEventListener('keydown', blockDefault, false);
        window.addEventListener('keydown', restartHandler, false);
    };

    this.init = function () {
        // amend key functions
        window.removeEventListener('keydown', restartHandler);
        window.addEventListener('keydown', movementHandler, false);

        // reset variables
        info.direction = 'E';
        self.score = 0;
        info.food = [];
        snek = new Snek([new Coord(11, 10),
                         new Coord(10, 10),
                         new Coord(9, 10)], "E");

        // reset/refresh visuals
        fillAll("Black");
        $('.gameOverlay').remove();
        snek.drawSnek();
        makeFood(snek.body);
        game.updateInfoBar();

        // restart timer
        if (info.timer.timer === null) {
            info.timer.restartTimer();
            info.paused = false;
        }
    };

    function movementHandler(e) {
        e = e || window.event;
        switch (e.keyCode) {
        case 38:
            info.direction = "N";
            break;
        case 40:
            info.direction = "S";
            break;
        case 37:
            info.direction = "W";
            break;
        case 39:
            info.direction = "E";
            break;
        }
    }

    function restartHandler(e) {
        // restart on space
        if (e.keyCode === 32) {
            self.init();
        }
    }

    function blockDefault(e) {
        // don't let arrow keys/space move the screen about
        if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }

    function gameOver() {
        info.timer.stopTimer();

        // safety first
        game.saveGame();

        // tell 'em they failed
        game.addMessage('Game over. Score: ' + self.score);

        $('#game').append('<div class="gameOverlay"><p>gem over <span>click or press space</span></p></div>');
        $('.gameOverlay').height(canvas.height);
        $('.gameOverlay').width(canvas.width);

        // restart mechanics
        $('.gameOverlay').click(function () {
            self.init();
        });

        window.removeEventListener('keydown', movementHandler);
        window.addEventListener('keydown', restartHandler, false);
    }

    // what happens every tick
    this.tick = function () {
        snek.changeDir(info.direction);
        snek.move(context);
        game.updateInfoBar();
    };

    /* Unlockable actions!! */
    this.redApple = function () {
        foodCell = makeBlockImg("red");

        //make current food red
        for (var i = 0; i < info.food.length; i++) {
            drawInCell(foodCell, info.food[i].x, info.food[i].y);
        }
    };

    this.changeSpeed = function (speed) {
        info.tickSpeed = speed;
        info.timer.restartTimer();
    };

        clearInterval(timer);
        timer = window.setInterval(function () {
            self.tick();
        }, tickSpeed);
    };
}