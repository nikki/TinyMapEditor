var tinyMapEditor = (function() {
    var win = window,
        doc = document,
        pal = doc.getElementById('palette').getContext('2d'),
		tileEditor = doc.getElementById('tileEditor'),
        map = tileEditor.getContext('2d'),
		selectedTile = doc.getElementById('selectedTile'),
        width = 10,
        height = 10,
        tileSize = 32,
        tileZoom = 1,
        srcTile = 0,
        sprite = new Image(),
        tiles, // used for demo, not *really* needed atm
        alpha,

        player,
        draw,
        build = doc.getElementById('build'),
        test = doc.getElementById('test'),
		tileInput = doc.getElementById('tileInput'),
		
		widthInput = document.getElementById('width'),
        heightInput = document.getElementById('height'),
        tileSizeInput = document.getElementById('tileSize'),
		tileZoomInput = document.getElementById('tileZoom');
		
	const STORAGE_PREFIX = 'TinyMapEditor.';
	const storage = {
		get: k => {
			const json = localStorage[STORAGE_PREFIX + k];
			return json && JSON.parse(json);
		},
		put: (k, v) => localStorage[STORAGE_PREFIX + k] = JSON.stringify(v)
	};

    var app = {
        getTile : function(e) {
            if (e.target.nodeName === 'CANVAS') {
                var row = e.layerX / tileSize / tileZoom | 0,
                    col = e.layerY / tileSize / tileZoom | 0;

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
            var ctx = selectedTile.getContext('2d'),
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
				
			selectedTile.style.zoom = tileZoom;

            selectedTile.width = selectedTile.height = tileSize;

            srcTile ? ctx.drawImage(sprite, srcTile.row * tileSize, srcTile.col * tileSize, tileSize, tileSize, 0, 0, tileSize, tileSize) : eraser();
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
            var i, j, invert = document.getElementById('invert').checked ? 0 : 1;

            map.fillStyle = 'black';
            for (i = 0; i < width; i++) {
                for (j = 0; j < height; j++) {
                    if (alpha[i][j] === invert) {
                        map.fillRect(i * tileSize, j * tileSize, tileSize, tileSize);
                    } else if (typeof alpha[i][j] === 'object') {
                        // map.putImageData(tiles[i][j], i * tileSize, j * tileSize); // temp fix to colour collision layer black
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
                        pixels = map.getImageData(x * tileSize, y * tileSize, tileSize, tileSize);
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
            var output = '',
                invert = document.getElementById('invert').checked;

            if (invert) {
                alpha.forEach(function(arr) {
                    arr.forEach(function(item, index) {
                        // using bitwise not to flip values
                        if (typeof item === 'number') arr[index] = Math.abs(~-item);
                    });
                });
            }

            // output = (output.split('],'));
            // output = output.concat('],');

            output = JSON.stringify(alpha);
            doc.getElementsByTagName('textarea')[0].value = output;
        },
		
		updateSizeVariables : function() {
			const inputToNumber = el => +el.value || 1;
			
			width = inputToNumber(widthInput);
			height = inputToNumber(heightInput);
			tileSize = inputToNumber(tileSizeInput);
			tileZoom = inputToNumber(tileZoomInput);

			storage.put('mapSize', {
				mapWidth: width,
				mapHeight: height,
				tileSize,
				tileZoom
			});
		},

        bindEvents : function() {
            var _this = this;


            /**
             * Window events
             */

            win.addEventListener('click', function(e) {
                _this.setTile(e);
                _this.getTile(e);
                _this.eraseTile(e);
                _this.drawTool();
                _this.clearMap(e);
                _this.buildMap(e);
            }, false);
			
			/***
			 * Tile editor events
			 */
			 
			const handleTileEditorMouseEvent = e => {
				if (e.buttons != 1) return;
				_this.setTile(e);
                _this.eraseTile(e);
			};
			tileEditor.addEventListener('mousedown', handleTileEditorMouseEvent);
			tileEditor.addEventListener('mousemove', handleTileEditorMouseEvent);
			
            /**
             * Image load event
             */

            sprite.addEventListener('load', function() {
                pal.canvas.width = this.width;
                pal.canvas.height = this.height;
				pal.canvas.style.zoom = tileZoom;
                pal.drawImage(this, 0, 0);
            }, false);


            /**
             * Input change events
             */
			 
			[widthInput, heightInput, tileSizeInput, tileZoomInput].forEach(input => {
				input.addEventListener('change', function() {
					_this.destroy();
					_this.init();
				}, false);				
			});

			/**
			 * Tileset file event
			 */
			tileInput.addEventListener('change', () => {
				if (!tileInput.files.length) return;
				
				const file = tileInput.files[0];
						 
				const fr = new FileReader();
				fr.onload = function () {
					sprite.src = fr.result;
					storage.put('tileSet', {
						name: file.name,
						src: sprite.src
					});
				}
				fr.readAsDataURL(file);
			 });
			 
        },

        init : function() {
			this.updateSizeVariables();
			
			const storedTileSet = storage.get('tileSet');
			sprite.src = storedTileSet && storedTileSet.src || 'assets/tilemap_32a.png';
			
            map.canvas.width = width * tileSize;
            map.canvas.height = height * tileSize;
			map.canvas.style.zoom = tileZoom;
			
            this.drawTool();
        },

        destroy : function() {
            clearInterval(draw);
            alpha = [];
        }
    };



    app.bindEvents();
    app.init();
    return app;

})();
