var tinyMapEditor = (function() {
    var doc = document,
        pal = doc.getElementById('palette').getContext('2d'),
        map = doc.getElementById('tileEditor').getContext('2d'),
        buildBtn = doc.getElementById('build'),     
        numTiles = 10,
        tileSize = 32,
        srcTile = 0,        
        sprite = new Image(),
        
        // tiles, // will be used for graphic tiles layer
        alpha,
        player,
        draw,
        left = false,
        right = false,
        up = false,

        app = {
            getTile : function(e) {
                if (e.target.nodeName === 'CANVAS') {
                    var row = (e.offsetX / tileSize | 0),
                        col = (e.offsetY / tileSize | 0);
                    
                    if (e.target.id === 'palette') srcTile = { row : row, col : col };
                    return { row : row, col : col };                     
                }
            },
            setTile : function(e) {
                var destTile;
                
                if (e.target.id === 'tileEditor' && srcTile && !draw) {
                    destTile = app.getTile(e);
                    map.clearRect(destTile.row * tileSize, destTile.col * tileSize, tileSize, tileSize);
                    map.drawImage(sprite, srcTile.row * tileSize, srcTile.col * tileSize, tileSize, tileSize, destTile.row * tileSize, destTile.col * tileSize, tileSize, tileSize);
                }
            },
            drawTool : function(e) {
                var rect = doc.createElement('canvas'),
                    ctx = rect.getContext('2d'),
                    eraser = function() {
                        ctx.fillStyle = 'red';
                        ctx.fillRect(0, 0, tileSize, tileSize);
                        ctx.fillStyle = 'white';
                        ctx.fillRect(2, 2, tileSize - 4, tileSize - 4);                        
                        ctx.strokeStyle = 'red';
                        ctx.lineWidth = 2;
                        ctx.moveTo(tileSize, 0);
                        ctx.lineTo(0, tileSize);
                        ctx.stroke();                        
                    };
  
                rect.width = rect.height = tileSize;
                rect.id = 'sample';
                srcTile ? ctx.drawImage(sprite, srcTile.row * tileSize, srcTile.col * tileSize, tileSize, tileSize, 0, 0, tileSize, tileSize) : eraser();  
                doc.getElementById('container').children[3].appendChild(rect);

                app.drawTool = function(e) {
                    rect.width = tileSize;
                    srcTile ? ctx.drawImage(sprite, srcTile.row * tileSize, srcTile.col * tileSize, tileSize, tileSize, 0, 0, tileSize, tileSize) : eraser();        
                }          
            },
            eraseTile : function(e) {
                var destTile;
                if (!draw) {
                    if (e.target.id === 'erase' && srcTile) {
                        srcTile = 0;
                    } else if (e.target.id === 'tileEditor' && !srcTile) {
                        destTile = app.getTile(e);
                        map.clearRect(destTile.row * tileSize, destTile.col * tileSize, tileSize, tileSize);                    
                    }
                }
            },
            clearMap : function(e) {
                if (e.target.id === 'clear') {
                    map.canvas.width = map.canvas.width;
                    buildBtn.disabled = false;
                    demo.destroy();
                }
            },         
            buildMap : function(e) {
                if (e.target.id === 'build') {
                    var obj = {},
                        pixels,
                        len,
                        x, y, z;
                    
                    // tiles = [];  // graphical tiles (not currently needed, can be used to create standard tile map)
                    alpha = []; // collision map

                    for (x = 0; x < numTiles; x++) { // tiles across
                        // tiles[x] = [];
                        alpha[x] = [];
                        
                        for (y = 0; y < numTiles; y++) { // tiles down
                            pixels = map.getImageData(y * tileSize, x * tileSize, tileSize, tileSize),
                            len = pixels.data.length;

                            // tiles[x][y] = pixels; // store ALL tile data
                            alpha[x][y] = [];
                        
                            for (z = 0; z < len; z += 4) {
                                pixels.data[z] = 0;
                                pixels.data[z + 1] = 0;
                                pixels.data[z + 2] = 0;
                                alpha[x][y][z / 4] = pixels.data[z + 3]; // store alpha data only
                            }

                            if (alpha[x][y].indexOf(0) === -1) { // solid tile
                                alpha[x][y] = 1;
                            } else if (alpha[x][y].indexOf(255) === -1) { // transparent tile
                                alpha[x][y] = 0;
                            } else { // partial alpha, build pixel map
                                alpha[x][y] = {
                                    tiles : pixels, // (temporarily) used for drawing map
                                    collision : app.sortPartial(alpha[x][y]) 
                                }
                            }
                        }
                    }
                    
                    demo.init();
                    build.disabled = true;
                    
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
        },

        demo = {
            createChar : function() {
                this.height = 32;
                this.width = 16;
                this.x = (numTiles * tileSize) / 2 - (this.width / 2);
                this.y = 0;
                this.dx = 1;
                this.dy = 1;
                this.vel = 3;
                this.grav = 10;

                return this;
            },
            drawChar : function() {
                map.fillStyle = 'purple';
                map.fillRect(player.x, player.y, player.width, player.height);            
                
                player.x += player.dx * player.vel;
                player.y += player.dy * player.grav;
            },
            checkCollision : function() {
                var row = (player.y / tileSize | 0),
                    col = (player.x / tileSize | 0);
                
                if (player.y < numTiles * tileSize - player.height && row >= 0 && col >= 0) {
                    console.log(row);
                    if (typeof alpha[row + 1][col] === 'object') {
                        console.log((row + 1) * tileSize - player.height - (tileSize - alpha[row + 1][col].collision[player.x % tileSize]), player.y);
                        player.y = (row + 1) * tileSize - player.height - (tileSize - alpha[row + 1][col].collision[player.x % tileSize]);
                    } else if (alpha[row + 1][col] === 1) {
                        player.y = (row + 1) * tileSize - player.height;                      
                    } else if (alpha[row + 1][col] === 0 && alpha[row + 1][col + 1] === 1 && player.x > (col + 1) * tileSize - player.width) {
                        player.y = (row + 1) * tileSize - player.height;
                    }
                } else {
                    player.y = numTiles * tileSize - player.height;
                }

                if (left && player.x > 0) {
                    player.dx = -1;
                    if (alpha[row][col] === 1) {
                        player.vel = 0;
                    } else {
                        player.vel = 3;
                    }                  
                } else if (right && player.x < numTiles * tileSize - player.width) {
                    player.dx = 1;
                    if (alpha[row][col + 1] === 1) {
                        if (player.x >= (col + 1) * tileSize - player.width) {
                            player.vel = 0; 
                        } else {
                            player.vel = 3;
                        }
                    } else {
                        player.vel = 3;                            
                    }             
                } else {
                    player.vel = 0;
                }
            },
            drawMap : function() {
                var i, j;

                map.fillStyle = 'black';
                for (i = 0; i < numTiles; i++) {
                    for (j = 0; j < numTiles; j++) {
                        if (alpha[i][j] === 1) {
                            map.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
                        } else if (typeof alpha[i][j] === 'object') {
                            map.putImageData(alpha[i][j].tiles, j * tileSize, i * tileSize);
                        }
                    }
                }
            },
            bindEvents : function() {
                window.addEventListener('keydown', function(e) {
                    switch (e.keyCode) {
                        case 37:
                            left = true;
                            break;
                        case 38:
                            up = true;
                            break;
                        case 39:
                            right = true;
                            break;    
                    }
                }, false);

                window.addEventListener('keyup', function(e) {              
                    switch (e.keyCode) {
                        case 37:
                            left = false;
                            break;
                        case 38:
                            up = false;
                            break;
                        case 39:
                            right = false;
                            break;
                    }           
                }, false);        
            },
            init : function() {
                player = new demo.createChar;            
                draw = setInterval(function() {
                    demo.update();
                }, 25);
            },
            update : function() {
                map.canvas.width = map.canvas.width;
                demo.drawMap();                     
                demo.drawChar();
                demo.checkCollision();                
            },
            destroy : function() {
                clearInterval(draw);
                player = draw = null;
                alpha = [];
            }
        }

    app.init();
    demo.bindEvents();    
    
    return app;

})();