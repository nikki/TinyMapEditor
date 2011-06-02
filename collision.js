var collisionDemo = (function() {
    var doc = document,
        canvas = doc.getElementsByTagName('canvas'),
        ctx = [ canvas[0].getContext('2d'), 
                canvas[1].getContext('2d'), 
                canvas[2].getContext('2d') ],
        tileSize = 16,
        left = false,
        right = false,
        down = false,

        demo = {
            createChar : function() {
                this.height = 32;
                this.width = 16;
                this.x = 50;
                this.y = 50;
                this.dx = 1;
                this.dy = 1;
                this.grav = 100;
            
                return this;
            },
            drawChar : function(obj) {
                var player = obj.player,
                    num = obj.num,
                    colour = obj.colour;

                if (left) player.dx = -1;
                if (right) player.dx = 1;

                ctx[num].fillStyle = colour;        
                ctx[num].fillRect(player.x, player.y, player.width, player.height);
                ctx[num].clearRect(player.x - player.width, player.y, player.width, player.height);

            },
            drawMap : function(obj) {
                var i, j, 
                    lenI = obj.map.length,
                    lenJ = obj.map[0].length,
                    map = obj.map,
                    num = obj.num,
                    colour = obj.colour;

                ctx[num].fillStyle = colour;
            
                for (i = 0; i < lenI; i++) {            
                    for (j = 0; j < lenJ; j++) {
                        if (map[i][j]) {
                            ctx[num].fillRect(j * tileSize, i * tileSize, tileSize, tileSize);
                        }
                    }
                } 
            },
            checkCollision : function(obj) {
                var i, j, 
                    lenI = obj.map.length,
                    lenJ = obj.map[0].length;
                
                for (i = 0; i < lenI; i++) {            
                    for (j = 0; j < lenJ; j++) {
                        if (obj.map[i][j]) {

                        }
                    }
                }
            
            
            
            
            
                /*
            
                collisionCheck: function(bArray){
                  for(var i=0,len=bArray.length; i<len; ++i){
                    for(var j=0,len2=bArray[i].length; j<len2; ++j){
                      if(!bArray[i][j].getType()) continue;
                      var x = bArray[i][j].getX(), y = bArray[i][j].getY();
                      var x2 = x+blockSize, y2 = y+blockSize;
                      var overlapping = (x2>this.x) && (x<(this.x+this.width)) && (y2>this.y) && (y<(this.y+this.height));
                      if (overlapping) this.x = 0; // I don't know why you'd do this, but it's what you have
                    }
                  }
                  // Should this function return anything?
                }
            
            
            
            
            
                */
            
            },
            bindEvents : function() {
                window.addEventListener('click', function(e) {
                
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
            demo_1 : function() {
                var mapObj = {
                        num : 0,
                        colour : 'red',
                        map : [[0,0,0,0,0,0,0,0,0,0],
                               [0,0,0,0,0,0,0,0,0,0],
                               [0,0,0,0,0,0,0,0,0,0],
                               [0,0,0,0,0,0,0,0,0,0],
                               [0,0,0,0,0,0,0,0,0,0],
                               [1,0,0,0,0,0,0,0,0,0],
                               [1,1,0,0,0,0,0,0,0,0],
                               [1,1,1,0,0,0,0,0,0,0],
                               [1,0,1,1,0,0,0,0,0,0],
                               [1,1,1,1,1,1,1,1,1,1]]                
                    },
                    charObj = {
                        num : 0,
                        colour : 'blue',
                        player : new demo.createChar
                    };
            

            
                demo.drawMap(mapObj);
            
                setInterval(function() {
                    demo.drawChar(charObj);
                }, 25);
            
            
            
            },
            demo_2 : function() {
                var obj = {
                    num : 1,
                    colour : 'green',
                    map : [[0,0,0,0,0,0,0,0,0,0],
                           [0,0,0,0,0,0,0,0,0,0],
                           [0,0,0,0,0,0,0,0,0,0],
                           [0,0,0,0,0,0,0,0,0,0],
                           [0,0,0,0,0,0,0,0,0,0],
                           [1,0,0,0,0,0,0,0,0,0],
                           [1,1,0,0,0,0,0,0,0,0],
                           [1,1,1,0,0,0,0,0,0,0],
                           [1,0,1,1,0,0,0,0,0,0],
                           [1,1,1,1,1,1,1,1,1,1]]
                };
            
                demo.drawMap(obj);
            },
            demo_3 : function() {
            
            
            
            
            
                var obj = {
                    num : 2,
                    colour : 'blue',
                    map : [[0,0,0,0,0,0,0,0,0,0],
                           [0,0,0,0,0,0,0,0,0,0],
                           [0,0,0,0,0,0,0,0,0,0],
                           [0,0,0,0,0,0,0,0,0,0],
                           [0,0,0,0,0,0,0,0,0,0],
                           [1,0,0,0,0,0,0,0,0,0],
                           [1,1,0,0,0,0,0,0,0,0],
                           [1,1,1,0,0,0,0,0,0,0],
                           [1,0,1,1,0,0,0,0,0,0],
                           [1,1,1,1,1,1,1,1,1,1]]
                };
            
                demo.drawMap(obj);
            },
            init : function() {
                demo.bindEvents();
                demo.demo_1();
                demo.demo_2();
                demo.demo_3();
                demo.update();
            
            
            
            }, 
            update : function() {

            
            
            
            }
        };
    
    demo.init();
    return demo;
    
})();