var tileEditor = (function() {
    var doc = document,
        pal = doc.getElementById('palette').getContext('2d'),
        map = doc.getElementById('tileEditor').getContext('2d'),
        tiles = [],
        numTiles = 10,
        tileSize = 32,
        srcTile = 0,        
        sprite = new Image(),
        
        app = {
            getTile : function(e) {
                if (e.target.nodeName === 'CANVAS') {
                    var row = (e.offsetX / tileSize | 0),  // not zero indexed, zero used or empty tile
                        col = (e.offsetY / tileSize | 0);
                    
                    if (e.target.id === 'palette') srcTile = { row : row, /* row your boat*/ col : col };
                    return { row : row, col : col };                     
                }
            },
            setTile : function(e) {
                var destTile;
                
                if (e.target.id === 'tileEditor' && srcTile) {
                    destTile = app.getTile(e);
                    
                    map.clearRect(destTile.row * tileSize, destTile.col * tileSize, tileSize, tileSize);
                    map.drawImage(sprite, srcTile.row * tileSize, srcTile.col * tileSize, tileSize, tileSize, destTile.row * tileSize, destTile.col * tileSize, tileSize, tileSize);
                }
            },
            drawTool : function(e) {
                var rect = document.createElement('canvas');
                    ctx = rect.getContext('2d');
                    
                rect.width = rect.height = tileSize;
                //rect.style.position = 'absolute';
                //rect.style.left = e.layerX + 'px';
                //rect.style.top = e.layerY + 'px';

                ctx.drawImage(sprite, srcTile.row * tileSize, srcTile.col * tileSize, tileSize, tileSize, 0, 0, tileSize, tileSize);                
                doc.body.appendChild(rect);

                app.drawTool = function(e) {
                    rect.width = tileSize; // clears rect
                    
                    if (srcTile) {
                        ctx.drawImage(sprite, srcTile.row * tileSize, srcTile.col * tileSize, tileSize, tileSize, 0, 0, tileSize, tileSize);
                    } else {
                        ctx.fillStyle = 'black';
                        ctx.fillRect(0, 0, tileSize, tileSize);
                    }
                    
                    // rect.style.left = e.layerX + 'px';
                    // rect.style.top = e.layerY + 'px';            
                }          
            },
            eraseTile : function(e) {
                var destTile;

                if (e.target.id === 'erase' && srcTile) {
                    srcTile = 0;
                } else if (e.target.id === 'tileEditor' && !srcTile) {
                    destTile = app.getTile(e);
                    map.clearRect(destTile.row * tileSize, destTile.col * tileSize, tileSize, tileSize);                    
                }
            },
            clearMap : function(e) {
                if (e.target.id === 'clear') {
                    map.canvas.width = map.canvas.width;
                }
            },         
            buildMap : function(e) {
                if (e.target.id === 'build') {
                    var alpha = [],  // collision map
                        // tiles = [],  // graphical tiles (not currently needed, can be used to create standard tile map)
                        temp = [],
                        pixels,
                        len,
                        x, y, z;

                    for (x = 0; x < numTiles; x++) { // tiles across
                        // tiles[x] = [];
                        alpha[x] = [];
                        for (y = 0; y < numTiles; y++) { // tiles down
                            pixels = map.getImageData(y * tileSize, x * tileSize, tileSize, tileSize),
                            len = pixels.data.length;

                            // tiles[x][y] = pixels; // store tile data
                            alpha[x][y] = [];
                        
                            for (z = 0; z < len; z += 4) {
                                alpha[x][y][z / 4] = pixels.data[z + 3]; // store alpha data
                            }

                            if (alpha[x][y].indexOf(0) === -1) { // solid tile
                                alpha[x][y] = 1;
                            } else if (alpha[x][y].indexOf(255) === -1) { // transparent tile
                                alpha[x][y] = 0;
                            } else { // partial alpha, build pixel map
                                alpha[x][y] = app.sortPartial(alpha[x][y]);
                            }
                        }
                    }
                    
                    console.log(alpha);
                    
                }      
            },
            sortPartial : function(arr) {
                var len = arr.length,
                    temp = [],
                    i, j;
                    
                for (i = 0; i < tileSize; i++) {
                    temp[i] = [];
                    for (j = 0; j < len; j++) {
                        if (j % tileSize === j) {
                            temp[i][j] = arr[j * tileSize + i];
                        }
                    }
                    
                    temp[i] = temp[i].indexOf(255); 
                    
                }

                return temp;
            },
            bindEvents : function() {
                window.addEventListener('click', function(e) {
                    app.getTile(e);
                    app.setTile(e);
                    app.eraseTile(e);
                    app.drawTool(e);
                    app.clearMap(e);
                    app.buildMap(e);
                }, false);

                window.addEventListener('dragstart', function(e) {
                    // app.setTile(e);
                }, false);
                
                sprite.addEventListener('load', function() {
                    map.canvas.width = map.canvas.height = numTiles * tileSize;
                    pal.canvas.width = this.width;
                    pal.canvas.height = this.height;
                    pal.drawImage(this, 0, 0);
                });
            },
            init : function() {
                sprite.src = 'tilemap_32a.png';
                
                app.bindEvents();
            }
        };
    
    app.init();

})();