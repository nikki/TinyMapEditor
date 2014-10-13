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
                destTile = this.getTile(e);
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

            this.drawTool = function() {
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
                    destTile = this.getTile(e);
                    map.clearRect(destTile.row * tileSize, destTile.col * tileSize, tileSize, tileSize);
                }
            }
        },
        drawMap : function() {
            var i, j;

            map.fillStyle = 'black';
            for (i = 0; i < width; i++) {
                for (j = 0; j < width; j++) {
                    if (alpha[i][j] === 1) {
                        map.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
                    } else if (typeof alpha[i][j] === 'object') {
                        map.putImageData(tiles[i][j], j * tileSize, i * tileSize); // temp fix to colour collision layer black
                    }
                }
            }
        },
        clearMap : function(e) {
            if (e.target.id === 'clear') {
                map.clearRect(0, 0, map.canvas.width, map.canvas.height);
                this.destroy();
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

                for (x = 0; x < width; x++) { // tiles across
                    tiles[x] = [];
                    alpha[x] = [];

                    for (y = 0; y < height; y++) { // tiles down
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
                            alpha[x][y] = this.sortPartial(alpha[x][y]);
                            tiles[x][y] = pixels; // (temporarily) used for drawing map
                            /*
                            alpha[x][y] = {
                                imageData : pixels, // (temporarily) used for drawing map
                                alphaData : this.sortPartial(alpha[x][y])
                            }
                            */
                        }
                    }
                }

                this.outputJSON();
                this.drawMap();
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
            doc.getElementsByTagName('textarea')[0].value = JSON.stringify(alpha);
        },
        bindEvents : function() {
            var _this = this;

            win.addEventListener('click', function(e) {
                _this.setTile(e);
                _this.getTile(e);
                _this.eraseTile(e);
                _this.drawTool();
                _this.clearMap(e);
                _this.buildMap(e);
            }, false);

            sprite.addEventListener('load', function() {
                map.canvas.width = width * tileSize;
                map.canvas.height = height * tileSize;
                pal.canvas.width = this.width;
                pal.canvas.height = this.height;
                pal.drawImage(this, 0, 0);
            }, false);
        },
        init : function() {
            sprite.src = 'assets/tilemap_32a.png';
            this.bindEvents();
            this.drawTool();
        },
        destroy : function() {
            clearInterval(draw);
            player = draw = null;
            alpha = [];
        }
    };