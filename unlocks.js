/*jshint browser: true, jquery: true*/
var unlocks = {
    shop: {
        unlocked: 0,
        name: 'shop',
        buttonText: 'yo this is shop',
        price: 1,
        viewInfo: {
            image: '/media/shop.png',
            text: "It's a shop. More specifically, access to the shop. Unfortunately you don't get to buy the whole shop."
        },
        boughtInfo: {
            text: "Hang on. Where did you buy this from?"
        }
    }
};

var unlock = function (unlockItem) {
    switch (unlockItem) {
    case 'shop':
        unlockShop();
        break;
    }
};

var unlockShop = function () {
    $('#shop').removeClass('notashop');

    $('#shop').prepend('<h2>Shop</h2>');
    $('button[name="shop"]').remove();
};

var viewInfo = function (imgURL, txt) {
    var $view = $('#view');
    $view.empty();

    $view.append('<img src="' + imgURL + '"/>');
    $view.append('<p>' + txt + '</p>');

    $view.addClass('show');
};

var makeButton = function (item) {
    var $items = $('#items');

    var b = document.createElement('button');
    b.setAttribute('name', unlocks[item].name);
    $(b).text(unlocks[item].buttonText);

    $(b).click(function () {
        unlock(unlocks[item].name);
        $('#view').removeClass('show');
        $('#messages').fadeIn(100);
    });

    $(b).hover(function () {
        $('#messages').fadeOut(100);
        viewInfo(unlocks[item].viewInfo.image, unlocks[item].viewInfo.text);
    }, function () {
        $('#view').removeClass('show');
        $('#messages').fadeIn(100);
    });

    $items.append(b);
};
