class Camera2D {
    constructor() {
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

        this.graphics = createGraphics(width, height);
    }

    showUnboundedImage(pg) {
        let horizontalModuloOffset = pg.width * floor(this.x / float(pg.width));
        let verticalModuloOffset = pg.height * floor(this.y / float(pg.height));
        //BASIC 3x3
        //tl t tr
        
        image(pg,
            -pg.width + horizontalModuloOffset,
            -pg.height + verticalModuloOffset);

        image(pg,
            0 + horizontalModuloOffset,
            -pg.height + verticalModuloOffset);

        image(pg,
            pg.width + horizontalModuloOffset,
            -pg.height + verticalModuloOffset);
        //l m r
        image(pg,
            -pg.width + horizontalModuloOffset,
            0 + verticalModuloOffset);

        image(pg,
            0 + horizontalModuloOffset,
            0 + verticalModuloOffset);

        image(pg,
            pg.width + horizontalModuloOffset,
            0 + verticalModuloOffset);
        //bl b br
        image(pg,
            -pg.width + horizontalModuloOffset,
            pg.height + verticalModuloOffset);

        image(pg,
            0 + horizontalModuloOffset,
            pg.height + verticalModuloOffset);

        image(pg,
            pg.width + horizontalModuloOffset,
            pg.height + verticalModuloOffset);



    }

    update() {
        this.scale = lerp(this.scale, this.desiredScale, this.scaleInterpolationSpeed);
        this.x = lerp(this.x, this.desiredX, this.positionInterpolationSpeed);
        this.y = lerp(this.y, this.desiredY, this.positionInterpolationSpeed);


        this.graphics.clear();
        this.graphics.strokeWeight(5);
        this.graphics.stroke(255, 0, 0);
        this.graphics.rect(0, 0, this.graphics.width, this.graphics.height);
        // Draw the grid lines
        this.graphics.stroke(255);
        this.graphics.noFill();
        this.graphics.strokeWeight(1);
        this.graphics.textAlign(LEFT, TOP);


        let failSafe = 5;
        let checkSize = 100;
        let gridSize = 300;
        const scaledWidth = this.graphics.width * this.scale;
        while (checkSize < scaledWidth) {
            this.graphics.stroke(255, 20);
            this.drawGridLines(gridSize, this.x, this.y);
            checkSize = checkSize * 2;
            gridSize = gridSize * 0.5;
            failSafe--;
            if (failSafe < 0) {
                break;
            }
        }

        text(scaledWidth + " - " + failSafe, width * 0.5, height * 0.5);


        this.applyTransformations();
    }

    drawGridLines(_gridSize, offsetX, offsetY) {
        let scaledGridSize = _gridSize * this.scale;
        let scaledOffsetX = offsetX * this.scale;
        let scaledOffsetY = offsetY * this.scale;
        let xCount = 0;
        let yCount = 0;


        let halfWidth = this.graphics.width * 0.5;
        let halfHeight = this.graphics.height * 0.5;

        //im bad with matt

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
        translate(width / 2 - this.x * this.scale, height / 2 - this.y * this.scale);
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
