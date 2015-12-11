/*jshint browser: true, jquery: true*/
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
}
