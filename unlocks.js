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

    function viewInfo(imgURL, txt) {
        var $view = $('#view');
        $view.empty();

        $view.append('<img src="' + imgURL + '"/>');
        $view.append('<p>' + txt + '</p>');

        $view.addClass('show');
    }

    this.makeButton = function (item) {
        var $items = $('#items');

        var b = $("<button>", {
            name: unlocks[item].name,
            text: unlocks[item].buttonText,
            click: function () {
                unlocks[item].unlockAction();
                $('#view').removeClass('show');
                $('#messages').fadeIn(100);
            },
            mouseenter: function () {
                $('#messages').fadeOut(100);
                viewInfo(unlocks[item].viewInfo.image, unlocks[item].viewInfo.text);
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
