class DebugWindow {
    constructor(x = 0, y = 0, w = 100, h = 100, fontSize = 14) {
        this.x = x;
        this.y = y;
        this.size = createVector(w,h);
        this.g = createGraphics(this.size.x, this.size.y);
        this.fontSize = fontSize;
        this.values = [];

        //
        this.padding = 10;
        this.lineHeight = 1;
    }

    add(label, valueRef, isGraph = false) {
        if(isGraph){
            let graph = new DebugWindowGraph();
            this.values.push({ label, valueRef, isGraph, graph});
        }else{
            this.values.push({ label, valueRef, isGraph});
        }
    }

    update(){
        this.g.clear(); // Clear the graphics buffer
        //this.g.background(255,0,0);
        this.g.fill(255);
        this.g.stroke(0);
        this.g.strokeWeight(3);
        this.g.textSize(this.fontSize);
        
        let yOffset = this.fontSize + this.lineHeight;
        for (let i = 0; i < this.values.length; i++) {
          const { label, valueRef, isGraph, graph} = this.values[i];
          const value = typeof valueRef === 'function' ? valueRef() : valueRef;
          if(!isGraph){
            const displayText = `${label}: ${value}`;
            this.g.text(displayText, this.padding, yOffset);
            yOffset += this.fontSize + this.lineHeight;
          }else{
            graph.update(value);
            this.g.image(graph.g, this.padding, yOffset);
            yOffset+= graph.size.y+this.fontSize + this.lineHeight;
          }
        }
        
    }
    display() {
        this.update();
        image(this.g, this.x, this.y);
    }
      
}

class DebugWindowGraph {
    constructor(w = 300, h = 50) {
        this.size = createVector(w, h);
        this.g = createGraphics(this.size.x, this.size.y);
        this.valueHistory = [];
        this.historyLength = 100;
        this.maxValue = 0; // Initialize the maxValue to 0
    }

    addValue(value) {
        this.maxValue = max(value, this.maxValue);
        this.valueHistory.push(value);
        if (this.valueHistory.length > this.historyLength) {
            this.valueHistory.shift();
        }

        //make the maxvalue get closer to the last value bit by bit
        this.maxValue = lerp(this.maxValue, value, 0.01);
    }

    update(val) {
        this.g.background(0);
        this.g.fill(255);

        this.addValue(val);

        // Draw the graph
        let px = 0;
        let py = this.size.y - (this.valueHistory[0] / this.maxValue) * this.size.y;
        this.g.stroke(0, 255, 0);
        this.g.strokeWeight(1);
        for (let i = 0; i < this.valueHistory.length; i++) {
            let x = (i / this.valueHistory.length) * this.size.x; // Corrected this.size.w to this.size.x
            let y = this.size.y - (this.valueHistory[i] / this.maxValue) * this.size.y;
            this.g.line(px, py, x, y);
            this.g.point(x, y);

            px = x;
            py = y;
        }
    }
}

