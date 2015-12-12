/*jshint browser: true, jquery: true*/
var unlocks = {
    shop: {
        name: 'shop',
        buttonText: 'buy a shop',
        price: [[5, 'apples']],
        viewInfo: {
            image: '/media/shop.png',
            text: "buy a shop. from where? a shop. which you are buying."
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

        $view.append('<p class="price"><strong>Price: </strong>' + priceText + '</p>');
        $view.append('<p class="description">' + item.viewInfo.text + '</p>');

        $view.addClass('show');
    }

    this.makeButton = function (item) {
        var $items = $('#items');

        var b = $("<button>", {
            name: unlocks[item].name,
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
                    unlocks[item].unlockAction();
                    $('#view').removeClass('show');
                    $('#messages').fadeIn(100);
                }
            },
            mouseenter: function () {
                $('#messages').fadeOut(100);
                viewInfo(unlocks[item]);
            },
            mouseleave: function () {
                $('#view').removeClass('show');
                $('#messages').fadeIn(100);
            }
        });

        $items.append(b);
    };

    this.setup = function () {
        self.makeButton('shop');
    };
}
