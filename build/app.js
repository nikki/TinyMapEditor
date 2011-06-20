    var app = {
        getTile : function(e) {
            if (e.target.nodeName === 'CANVAS') {
                var row = e.layerX / tileSize | 0,
                    col = e.layerY / tileSize | 0;

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
        drawTool : function() {
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
            doc.getElementById('selected').appendChild(rect);
            eraser();

            app.drawTool = function() {
                rect.width = tileSize;
                srcTile ? ctx.drawImage(sprite, srcTile.row * tileSize, srcTile.col * tileSize, tileSize, tileSize, 0, 0, tileSize, tileSize) : eraser();       
            };          
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
                map.clearRect(0, 0, map.canvas.width, map.canvas.height);
                demo.destroy();
                test.disabled = true;
                build.disabled = false;
            }
        },         
        buildMap : function(e) {
            if (e.target.id === 'build') {
                var obj = {},
                    pixels,
                    len,
                    x, y, z;
            
                tiles = []; // graphical tiles (not currently needed, can be used to create standard tile map)
                alpha = []; // collision map

                for (x = 0; x < numTiles; x++) { // tiles across
                    tiles[x] = [];
                    alpha[x] = [];
                
                    for (y = 0; y < numTiles; y++) { // tiles down
                        pixels = map.getImageData(y * tileSize, x * tileSize, tileSize, tileSize);
                        len = pixels.data.length;
                    
                        tiles[x][y] = pixels; // store ALL tile data
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
                            alpha[x][y] = app.sortPartial(alpha[x][y]);
                            tiles[x][y] = pixels; // (temporarily) used for drawing map
                            /*
                            alpha[x][y] = {
                                imageData : pixels, // (temporarily) used for drawing map
                                alphaData : app.sortPartial(alpha[x][y]) 
                            }
                            */
                        }
                    }
                }
            
                app.outputJSON();
                demo.drawMap();
                test.disabled = false;
            
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
        outputJSON : function() {
            var output = {
                layerName : 'collision', // TODO
                tileSize : tileSize,
                imgSrc : sprite.src,
                mapData : alpha
            };
        
            output = 'var collisionMap = ' + JSON.stringify(output);
            doc.getElementsByTagName('textarea')[0].value = output;
        },
        bindEvents : function() {
            win.addEventListener('click', function(e) {
                app.setTile(e);                      
                app.getTile(e);                      
                app.eraseTile(e);
                app.drawTool();   
                app.clearMap(e);
                app.buildMap(e);
                demo.testMap(e);
            }, false);
                        
            sprite.addEventListener('load', function() {
                map.canvas.width = map.canvas.height = numTiles * tileSize;
                pal.canvas.width = this.width;
                pal.canvas.height = this.height;
                pal.drawImage(this, 0, 0);
            }, false);        
        },
        init : function() {
            sprite.src = 'assets/tilemap_32a.png';
            app.bindEvents();
            app.drawTool();
        }
    };