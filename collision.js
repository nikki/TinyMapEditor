var collisionDemo = (function() {
    var pal,
        map,
        numTiles,        
        tileSize,
        alpha,
        testBtn,
        
        player,
        left = false,
        right = false,
        up = false,

        demo = {
            createChar : function() {
                this.height = 32;
                this.width = 16;
                this.x = (numTiles * tileSize) / 2 - (this.width / 2);
                this.y = 0;
                this.dx = 1;
                this.dy = 1;
                this.vel = 0;
                this.grav = 5;
            
                return this;
            },
            newChar : function(e) {
                if (e.target.id === 'test') {
                    player = new demo.createChar;
                    map.fillStyle = 'purple';
                    demo.update();
                }                
            },
            drawChar : function() {

                /*
                if (up) {
                    player.dy = -1;
                    player.grav *= 0.9;
                } else {
                    player.dy = 1;
                    player.grav = 10;
                }
*/  
                // map.clearRect(player.x, player.y, player.width, player.height);
                map.fillRect(player.x, player.y, player.width, player.height);
                // map.clearRect(player.x, player.y, 1, 1);
                // map.clearRect(player.dx === 1 ? player.x - player.width : player.x + player.width, player.dy === 1 ? player.y - player.height : player.y + player.height, player.width, player.height);
            
                player.x += player.dx * player.vel;
                player.y += player.dy * player.grav;
            
            },
            checkCollision : function() {
                var row = (player.y / tileSize | 0) + 1, // 1, not zero indexed
                    col = (player.x / tileSize | 0) + 1;
                    
                // console.log(alpha[row]);

                if (player.y < (numTiles * tileSize - player.height) && row >= 0 && col >= 0) {
                    if (alpha[row][col - 1] === 1) {
                        player.y = (row * tileSize) - player.height;
                    } else if (typeof alpha[row][col - 1] === 'object') {
                        player.y = (row * tileSize) - player.height;
                    }
                    
                    if (left && player.x > 0) {
                        if (alpha[row - 1][col - 1] === 1) {
                            player.vel = 0
                        } else {
                            player.dx = -1;
                            player.vel = 3;                            
                        }
                    } else if (right && player.x < numTiles * tileSize) {
                        if (alpha[row - 1][col] === 1) {
                            player.vel = 0
                        } else {
                            player.dx = 1;
                            player.vel = 3;                            
                        }
                    } else {
                        player.vel = 0;
                    }
                    
                    
                } else {
                    player.y = numTiles * tileSize - player.height;
                }
                /*
                if (player.x < (numTiles * tileSize - player.width) && row >= 0 && col >= 0) {
                    console.log(alpha[row][col]);
                }
                */
/*
                
                if (player.x > 0 && player.x < numTiles * tileSize - player.width && row >= 0 && col >= 0) {
                    if (left) {
                        

                        
                        player.dx = -1;
                        player.vel = 3;
                    } else if (right) {
                        player.dx = 1;
                        player.vel = 3;
                    } else {
                        player.vel = 0;
                    }
                }
 */               
                
                /*
                if (left && player.x > 0) {
                    player.dx = -1;
                    player.vel = 3;
                } else if (right && player.x < numTiles * tileSize - player.width) {
                    player.dx = 1;
                    player.vel = 3;
                } else {
                    player.vel = 0;
                }  
                
                */          
            },
            drawMap : function() { // lazy lazy lazy *tut*
                var i, j;
                
                ctx.fillStyle = 'black';
                
                for (i = 0; i < numTiles; i++) {
                    for (j = 0; j < numTiles; j++) {
                        if (alpha[i][j] === 1) {
                            map.fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
                        } else if (typeof alpha[i][j] === 'object') {
                            // console.log(alpha);
                            //map.putImageData(alpha[i][j].toString(), j * tileSize, i * tileSize, tileSize, tileSize);
                        }
                    }
                }
            },
            bindEvents : function() {
                testBtn.addEventListener('click', function(e) {
                    demo.newChar(e);
                }, false);
                
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
            init : function(obj) {
                pal = obj.pal;
                map = obj.map;
                numTiles = obj.numTiles;
                tileSize = obj.tileSize;
                alpha = obj.alpha;
                testBtn = obj.testBtn;

                demo.bindEvents();
                testBtn.disabled = false;
            }, 
            update : function() {
                return setInterval(function() {
                    map.canvas.width = map.canvas.width;
                    demo.drawMap();                     
                    demo.drawChar();
                    demo.checkCollision();                              
                }, 25);
            }
        };
    
    return demo.init;
    
})();