class Camera2D {
    constructor(_w = width, _h = height) {
        this.x = 0;
        this.y = 0;
        this.desiredX = 0;
        this.desiredY = 0;
        this.scale = 1;
        this.desiredScale = 1;
        this.scaleInterpolationSpeed = 0.1;
        this.positionInterpolationSpeed = 0.1;
        this.dragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;

        this.graphics = createGraphics(_w, _h);

        this.maxUnboundedImageLimit = 5;

    }

    setResolution(w,h){
        this.graphics = createGraphics(w,h);
    }

    showUnboundedImage(pg, {
        xOffset = -width*0.5, 
        yOffset = -height*0.5, 
        imageWidth = width, 
        imageHeight = height,
        moduloWidth = width,
        moduloHeight = height
        }={}) {
            
        let horizontalModuloOffset = moduloWidth * floor(this.x / float(moduloWidth));
        let verticalModuloOffset = moduloHeight * floor(this.y / float(moduloHeight));

        let xCount = this.graphics.width / float(pg.width * this.scale);
        let yCount = this.graphics.height / float(pg.height * this.scale);
        xCount = constrain(ceil(max(xCount, yCount) * 0.5), 0, this.maxUnboundedImageLimit);
        
        /*
        this.graphics.fill(255);
        this.graphics.stroke(0);
        this.graphics.text("xCount: " + xCount, 100, 80);
        this.graphics.text("yCount: " + yCount, 100, 100);
        this.graphics.text("pgwidth: " + pg.width, 100, 120);
        this.graphics.text("pgwidth/this.scale: " + pg.width * this.scale, 100, 140);
        */

        for (let y = -xCount; y <= xCount; y++) {
            for (let x = -xCount; x <= xCount; x++) {
                image(pg,
                    imageWidth * x + horizontalModuloOffset + xOffset,
                    imageHeight * y + verticalModuloOffset + yOffset,
                    imageWidth, imageHeight);
            }
        }


    }

    update() {
        this.graphics.clear();


        this.scale = lerp(this.scale, this.desiredScale, this.scaleInterpolationSpeed);
        this.x = lerp(this.x, this.desiredX, this.positionInterpolationSpeed);
        this.y = lerp(this.y, this.desiredY, this.positionInterpolationSpeed);


        //this.graphics.text(round(scaledWidth) + " # " + failSafe, width * 0.5, height * 0.5);
    
       // this.applyTransformations();
    }

    drawGrid(){
        this.graphics.strokeWeight(1);
        this.graphics.stroke(255,50);
        let failSafe = 10;
        let gridSize =  300;
        let checkSize = 100;
        const scaledWidth = this.graphics.width * this.scale;
        
        while (checkSize < scaledWidth) {
            this.drawGridLines(gridSize, this.x, this.y);
            checkSize = checkSize * 2;
            gridSize = gridSize * 0.5;
            failSafe--;
            if (failSafe <= 0) {
                break;
            }
        }
    }

    drawGridLines(_gridSize, offsetX, offsetY) {


        let scaledGridSize = _gridSize * this.scale;
        let scaledOffsetX = offsetX * this.scale;
        let scaledOffsetY = offsetY * this.scale;
        let xCount = 0;
        let yCount = 0;


        let halfWidth = this.graphics.width * 0.5;
        let halfHeight = this.graphics.height * 0.5;

        //im bad with math

        //vertical lines ||||||||
        //rightside
        for (let i = halfWidth + (-scaledOffsetX % -scaledGridSize); i < this.graphics.width; i += scaledGridSize) {
            this.graphics.line(i, 0, i, this.graphics.height);
        }
        xCount = 0;
        //leftside
        for (let i = halfWidth + (-scaledOffsetX % -scaledGridSize) - scaledGridSize; i > 0; i -= scaledGridSize) {
            this.graphics.line(i, 0, i, this.graphics.height);
        }

        //horizontal lines -------
        for (let i = halfHeight + (-scaledOffsetY % -scaledGridSize); i < this.graphics.height; i += scaledGridSize) {
            this.graphics.line(0, i, this.graphics.width, i);
        }
        yCount = 0;
        for (let i = halfHeight + (-scaledOffsetY % -scaledGridSize) - scaledGridSize; i > 0; i -= scaledGridSize) {
            this.graphics.line(0, i, this.graphics.width, i);
        }

    }



    applyTransformations() {
        translate(-this.x * this.scale,-this.y * this.scale);
        scale(this.scale);
    }

    mousePressed() {
        this.dragging = true;
        this.dragStartX = mouseX;
        this.dragStartY = mouseY;
    }

    mouseReleased() {
        this.dragging = false;
    }

    mouseDragged() {
        if (this.dragging) {
            let dx = (this.dragStartX - mouseX) / this.scale;
            let dy = (this.dragStartY - mouseY) / this.scale;
            this.desiredX += dx;
            this.desiredY += dy;
            this.dragStartX = mouseX;
            this.dragStartY = mouseY;
        }
    }

    mouseWheel(event) {
        let delta = event.deltaY;
        if (delta > 0) {
            this.desiredScale *= 1.1; // Zoom out
        } else if (delta < 0) {
            this.desiredScale *= 0.9; // Zoom in
        }
    }
    
}


//events
function mousePressed() {
    camera2d.mousePressed();
}

function mouseReleased() {
    camera2d.mouseReleased();
}

function mouseDragged() {
    camera2d.mouseDragged();
}

function mouseWheel(event) {
    camera2d.mouseWheel(event);
}