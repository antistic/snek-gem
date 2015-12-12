/*jshint browser: true, jquery: true*/
var unlocks = {
    shop: {
        name: 'shop',
        buttonText: 'buy a shop',
        price: 1,
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
    var self = this;

    function viewInfo(item) {
        var $view = $('#view');
        $view.empty();

        $view.append('<img src="' + item.viewInfo.image + '"/>');
        $view.append('<p class="price"><strong>Price: </strong>' + item.price + '</p>');
        $view.append('<p class="description">' + item.viewInfo.text + '</p>');

        $view.addClass('show');
    }

    this.makeButton = function (item) {
        var $items = $('#items');

        var b = $("<button>", {
            name: unlocks[item].name,
            text: unlocks[item].buttonText,
            click: function () {
                if (game.inventory.apples >= unlocks[item].price) {
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
