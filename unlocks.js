/*jshint browser: true, jquery: true*/
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
            $('button[name="shop"]').remove();
        },
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

        $view.append('<img src="' + item.viewInfo.image + '"/>');

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

        $view.append(
            '<p class="price"><strong>Price: </strong>' +
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
        $view.empty();

        $view.append('<img src="' + item.viewInfo.image + '"/>');

        $view.append(
            '<p class="description">' +
            item.viewInfo.boughtText +
            '</p>'
        );

        $('#messages').fadeOut(100);
        $view.addClass('slowTransition');
        $view.addClass('show');

        setTimeout(function () {
            $view.removeClass('show');
            $('#messages').addClass('show');
        }, 4000);
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
    };
}
