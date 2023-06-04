class DebugWindow {
    constructor(x=0, y=0, width=1, height=1, fontSize=14) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.fontSize = fontSize;
      this.values = [];
    }
  
    add(label, valueRef) {
      this.values.push({ label, valueRef });
    }
  
    display() {

      //text features
      colorMode(RGB,255,255,255);
      fill(255); 
      noStroke(0);
      textSize(this.fontSize);
  
      let yOffset = this.y + this.fontSize;
      for (let i = 0; i < this.values.length; i++) {
        const { label, valueRef } = this.values[i];
        const value = typeof valueRef === 'function' ? valueRef() : valueRef;
        const displayText = `${label}: ${value}`;
        text(displayText, this.x + 5, yOffset);
        yOffset += this.fontSize;
      }
    }
  }
  