    var demo = {
        createChar : function() {
            this.height = 16;
            this.width = 8;
            this.x = (numTiles * tileSize) / 2 - (this.width / 2);
            this.y = 0;
            this.dx = 1;
            this.dy = 1;
            this.vel = 5;
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
                col = (player.x / tileSize | 0),
                keys = demo.keys;

            if (row < numTiles) {
                if (row === numTiles - 1 && typeof alpha[row][col] != 'object') {
                    if (!alpha[row][col] && !alpha[row][col + 1]) {
                        player.y = numTiles * tileSize - player.height;
                    } else {
                        player.vel = 0;
                        player.y = numTiles * tileSize - player.height;
                    }
                } else if (typeof alpha[row][col] === 'object') {
                    player.y = (row + 1) * tileSize - player.height - (tileSize - alpha[row][col][player.x % tileSize] + 1);
                } else if (typeof alpha[row + 1][col] === 'object') {
                    player.y = (row + 2) * tileSize - player.height - (tileSize - alpha[row + 1][col][player.x % tileSize] + 1);
                } else if (alpha[row + 1][col] === 1) {
                    player.y = (row + 1) * tileSize - player.height;                      
                } else if (alpha[row + 1][col] === 0 && alpha[row + 1][col + 1] === 1 && player.x > (col + 1) * tileSize - player.width) {
                    player.y = (row + 1) * tileSize - player.height;
                }
            } else {
                player.y = numTiles * tileSize - player.height;
            }

            if (keys.left && player.x > 0) {
                player.dx = -1;
                if (alpha[row][col] === 1) {
                    player.vel = 0;
                } else {
                    player.vel = 3;
                }                  
            } else if (keys.right && player.x < numTiles * tileSize - player.width) {
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
                        map.putImageData(tiles[i][j], j * tileSize, i * tileSize); // temp fix to colour collision layer black
                    }
                }
            }
        },
        testMap : function(e) {
            if (e.target.id === 'test' && !draw) {
                demo.init();
                test.disabled = true;
                build.disabled = true;
            }
        },
        keys : {
            left : false,
            right : false,
            up : false
        },
        bindEvents : function() {
            var keys = demo.keys;
        
            win.addEventListener('keydown', function(e) {
                switch (e.keyCode) {
                    case 37:
                        keys.left = true;
                        break;
                    case 38:
                        keys.up = true;
                        e.preventDefault();
                        break;
                    case 39:
                        keys.right = true;
                        break;    
                }
            }, false);

            win.addEventListener('keyup', function(e) {              
                switch (e.keyCode) {
                    case 37:
                        keys.left = false;
                        break;
                    case 38:
                        keys.up = false;
                        break;
                    case 39:
                        keys.right = false;
                        break;
                }           
            }, false);        
        },
        init : function() {
            player = new demo.createChar();            
            draw = setInterval(function() {
                demo.update();
            }, 25);
        },
        update : function() {
            map.clearRect(0, 0, map.canvas.width, map.canvas.height);
            demo.drawMap();                                
            demo.checkCollision();              
            demo.drawChar();                                                       
        },
        destroy : function() {
            clearInterval(draw);
            player = draw = null;
            alpha = [];
        }
    };