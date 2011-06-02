var tileEditor = (function() {
    var doc = document,
        ctx = doc.createElement('canvas').getContext('2d'),
        map = doc.createElement('canvas').getContext('2d'),
        tileSize = 16,
        sprite = new Image(),
        x, y;

    sprite.src = 'tilemap_16a.png';
    sprite.onload = function() {
        var tiles = [],
            numTiles = (this.width * this.height / tileSize) / tileSize,
            pixels, 
            len,
            i, j;
            
        ctx.canvas.width = this.width;
        ctx.canvas.height = this.height;
        ctx.drawImage(this, 0, 0);
        
        pixels = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        len = pixels.data.length;
        
        
        // for (i = 0; i < numTiles; i++) {
            //ctx.drawImage(sprite, i % (numTiles / canvasWidth) * tileSize, i % canvasWidth * tileSize, tileSize, tileSize, i % (numTiles / canvasWidth) * tileSize, i % canvasWidth * tileSize, tileSize, tileSize); 
            
            
            //, i % canvasWidth * tileSize, i % numTiles / canvasWidth, tileSize, tileSize)


        // console.log((i * canvasWidth) % numTiles);


        //}

        //for (i = 0; i < len; i++) {
            // for (j = 0; j < tileSize; j += 4) {
                //tiles[i] = pixels.data[i];
                //console.log(i);
            // }
        //}
        /*
        for (i = 0; i < numTiles; i++) {
            tiles[i] = [];
            for (j = 0; j < len / numTiles; j += 4) {
                var rows = this.height / tileSize,
                    row = i % (numTiles / rows);

                // tiles[i][j] = pixels.data[j];
                // tiles[i][j + 1] = pixels.data[j + 1];
                // tiles[i][j + 2] = pixels.data[j + 2];
                tiles[i][j] = pixels.data[j + 3];
                
                // ctx.putImageData(tiles[i], 0, 0);                
                
            }
        }
        */
    }
    
    var pointer = function(e) {
        var rect = document.createElement('div');
        rect.style.width = tileSize + 'px';
        rect.style.height = tileSize + 'px';
        rect.style.backgroundColor = 'red';
        rect.style.position = 'absolute';
        rect.style.left = e.layerX + 'px';
        rect.style.top = e.layerY + 'px';        
        doc.body.appendChild(rect);
        
        pointer = function(e) {
            rect.style.backgroundColor = 'yellow';
            rect.style.left = e.layerX + 'px';
            rect.style.top = e.layerY + 'px';            
        }
    }
    
    window.addEventListener('click', function(e) {
        if (e.target == map.canvas) pointer(e);
        
        
        
        // console.log(e.offsetX, e.offsetY);
        console.log(e.target);

    }, false);

    window.addEventListener('mousemove', function(e) {
        // console.log(e);
        // pointer(e); 
    }, false);    
    
    
    
    
    // draw grid on map
    map.canvas.height = map.canvas.width = tileSize * 10;

    for (x = 0.5; x < tileSize * 10; x += tileSize) {
        map.moveTo(x, 0);
        map.lineTo(x, tileSize * 10);
    }
    
    for (y = 0.5; y < tileSize * 10; y += tileSize) {
        map.moveTo(0, y);
        map.lineTo(tileSize * 10, y);   
    }
    
    map.fillStyle = 'lightblue';
    map.fillRect(0, 0, map.canvas.height, map.canvas.width);
    map.strokeStyle = '#ddd';
    map.stroke(); 

    doc.body.appendChild(map.canvas);
    doc.body.appendChild(ctx.canvas);

})();