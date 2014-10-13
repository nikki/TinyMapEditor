var tinyMapEditor = (function() {
    var win = window,
        doc = document,
        pal = doc.getElementById('palette').getContext('2d'),
        map = doc.getElementById('tileEditor').getContext('2d'),
        width = 10,
        height = 10,
        tileSize = 32,
        srcTile = 0,
        sprite = new Image(),
        tiles, // used for demo, not *really* needed atm
        alpha,

        player,
        draw,
        build = doc.getElementById('build'),
        test = doc.getElementById('test');

/* module */

    app.bindEvents();
    app.init();
    return app;

})();