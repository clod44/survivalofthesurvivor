






let canvasHolder = document.getElementById("canvas-holder");
let canvas; 

let camera2d;
let debugWindow;
let EM;

function setup(){
    canvas = createCanvas(100,100);
    background(0,255,0);
    canvas.parent("canvas-holder");
    noSmooth();
    resizeCanvas(canvasHolder.clientWidth, canvasHolder.clientHeight);

    //ecosystem
    EM = new EcosystemManager(3000, 3000);
    EM.addCreatures(10);

    camera2d = new Camera2D();
    //frameRate(5);

    debugWindow = new DebugWindow(10, 10);
    
    debugWindow.add('FPS', () => frameRate().toFixed(2));
    debugWindow.add('Cam X', () => camera2d.x.toFixed(2));
    debugWindow.add('Cam Y', () => camera2d.y.toFixed(2));
    debugWindow.add('Cam scale', () => camera2d.scale.toFixed(2));
}


function draw(){
    background(0);


    push();
    camera2d.update();
        
    //world content
    EM.update();
    
    // image(EM.graphics, 0, 0, EM.graphics.width, EM.graphics.height);  
      
    camera2d.showUnboundedImage(EM.graphics);


    camera2d.applyTransformations();
    pop();
    




    //grids
    image(camera2d.graphics, 0, 0, width, height);

    //debug window
    debugWindow.display();

}

function findLargestMultiple(X, Y, Z) {
    const quotient = Math.floor(Y / Z);
    const largestMultiple = quotient * Z;
    
    if (largestMultiple > X) {
      return largestMultiple - Z;
    }
    
    return largestMultiple;
  }
  
  
  
function windowResized() {
    resizeCanvas(canvasHolder.clientWidth, canvasHolder.clientHeight);
    
    camera2d = new Camera2D();
}



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









