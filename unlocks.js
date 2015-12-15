var unlocks = {
    shop: {
        buttonText: 'buy a shop',
        price: [[5, 'apples']],
        viewInfo: {
            image: '/media/shop.png',
            text: "buy a shop. from where? a shop. which you are buying.",
            boughtText: "you bought a shop. or rather, access to one. you have to buy the things in it separately. lol"
        },
        unlockAction: function () {
            $('#shop').removeClass('notashop');
            $('#shop').prepend('<h2>Shop</h2>');
        },
        unlocks: 'appleColour'
    },
    appleColour: {
        buttonText: 'colour your apples',
        price: [[3, 'apples']],
        viewInfo: {
            image: '/media/apple.png',
            text: "colour your apples! now you won't ever confuse them with your snake again. what do you mean you were never confused. you were. you so  were.",
            boughtText: "despite the image, your apple is still square shaped. but at least it's red...?"
        },
        unlockAction: function () {
            game.snakeGame.redApple();
        }
    }
};

function Items() {
    var self = this,
        singular = {
            'apples': 'apple'
        };

    function viewInfo(item) {
        var $view = $('#view');
        $view.empty();

        var priceText = '';
        for (var i = 0; i < item.price.length; i++) {
            var cost = item.price[i][0],
                text;

            if (cost === 1) {
                text = singular[item.price[i][1]];
            } else {
                text = item.price[i][1];
            }

            priceText += cost + ' ' + text + ', ';
        }
        priceText = priceText.slice(0, -2);

        $view.append('<div class="imgContainer"><img src="' +
            item.viewInfo.image +
            '"/></div>');

        $view.append(
            '<p class="price"><strong>Price:&nbsp;</strong>' +
            priceText +
            '</p>'
        );
        $view.append(
            '<p class="description">' +
            item.viewInfo.text +
            '</p>'
        );

        $view.addClass('show');
        $('#messages').removeClass('show');
    }

    function boughtInfo(item) {
        var $view = $('#view');

        $view.removeClass('show');

        setTimeout(function () {
            $view.empty();
            $view.append('<div class="imgContainer"><img src="' +
                item.viewInfo.image +
                '"/></div>');
            $view.append(
                '<p class="description">' +
                item.viewInfo.boughtText +
                '</p>'
            );

            $view.addClass('show');
            $('#messages').removeClass('show');

            $view.addClass('slowTransition');

            setTimeout(function () {
                $view.removeClass('show');
                $('#messages').addClass('show');

                setTimeout(function () {
                    $view.removeClass('slowTransition');
                });
            }, 5000);
        }, 500);
    }

    this.makeButton = function (item) {
        var $items = $('#items');

        var b = $("<button>", {
            name: item,
            text: unlocks[item].buttonText,
            click: function () {
                var price = unlocks[item].price,
                    canBuy = true;

                for (var i = 0; i < price.length; i++) {
                    if (game.inventory[price[i][1]] < price[i][0]) {
                        canBuy = false;
                        break;
                    }
                }
                if (canBuy) {
                    for (i = 0; i < price.length; i++) {
                        game.inventory[price[i][1]] -= price[i][0];
                    }
                    unlocks[item].unlockAction();
                    newUnlockable(unlocks[item].unlocks);
                    game.unlocked.push(item);

                    var index = game.unlockable.indexOf(item);
                    if (index > -1) {
                        game.unlockable.splice(index, 1);
                    }

                    $(this).mouseleave = null;
                    boughtInfo(unlocks[item]);

                    game.saveGame();
                    game.checkEmptyShop();

                    $(this).remove();
                } else {
                    game.addMessage("Can't buy. You're too poor.");
                    $('#view').removeClass('show');
                    $('#messages').addClass('show');
                }
            },
            mouseenter: function () {
                viewInfo(unlocks[item]);
            },
            mouseleave: function () {
                $('#view').removeClass('show');
                $('#messages').addClass('show');
            }
        });

        $items.append(b);
    };

    function newUnlockable(item) {
        if (item === undefined) {
            return;
        } else {
            $('#empty').remove();
            game.unlockable.push(item);
            self.makeButton(item);
        }
    }

    this.setup = function () {
        for (var i = 0; i < game.unlocked.length; i++) {
            unlocks[game.unlocked[i]].unlockAction();
        }

        for (i = 0; i < game.unlockable.length; i++) {
            self.makeButton(game.unlockable[i]);
        }

        game.checkEmptyShop();
    };
}
