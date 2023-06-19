



let canvasHolder = document.getElementById("canvas-holder");
let canvas;

let camera2d;
let debugWindow;
let EM;

let customFont;

//shaders
let drawBallsShader;

let checkBoxEnableWEBGL = document.getElementById("checkbox-enableWEBGL");
let enableWEBGL = checkBoxEnableWEBGL.checked;
checkBoxEnableWEBGL.addEventListener('change', function(event) {
    if (event.target.checked) {
      console.log('WEBGL enabled');
      enableWEBGL = true;
    } else {
        console.log('WEBGL disabled');
        enableWEBGL = false;
    }
});

let checkBoxEnableHunting = document.getElementById("checkbox-enableHunting");
checkBoxEnableHunting.addEventListener('change', function(event) {
    if (typeof EM === 'object' && EM instanceof EcosystemManager) {
        if (event.target.checked) {
            console.log('hunting enabled');
            EM.enableHunting = true;
        } else {
            console.log('hunting disabled');
            EM.enableHunting = false;
        }
    } else {
        console.log("Wait until the ecosystem manager is initialized");
    }
});


function preload() {
    customFont = loadFont('./fonts/Press_Start_2P/PressStart2P-Regular.ttf');

    // Load the shaders
    drawBallsShader = loadShader('./shaders/draw_balls.vert', './shaders/draw_balls.frag');
}
function setup() {
    canvas = createCanvas(100, 100, WEBGL);
    background(0, 255, 0);
    canvas.parent("canvas-holder");
    noSmooth();
    resizeCanvas(canvasHolder.clientWidth, canvasHolder.clientHeight);

    //ecosystem
    EM = new EcosystemManager(width*2, height*2);
    EM.enableHunting = checkBoxEnableHunting.checked;
    EM.addCreatures(200);

    camera2d = new Camera2D();
    //frameRate(5);



    debugWindow = new DebugWindow(- width * 0.5 + 10, - height * 0.5 + 10, 300, 300);
    debugWindow.g.textFont(customFont);
    debugWindow.add('FPS', () => frameRate().toFixed(2));
    debugWindow.add('FPS', () => frameRate().toFixed(2), true);
    debugWindow.add('::::::::::::::::::::', "");
    debugWindow.add('Cam X', () => camera2d.x.toFixed(2));
    debugWindow.add('Cam Y', () => camera2d.y.toFixed(2));
    debugWindow.add('Cam scale', () => camera2d.scale.toFixed(2));
    debugWindow.add('creature count', () => EM.creatures.length);

}


function draw() {
    background(0);

    if(!enableWEBGL){
    
        camera2d.update();
        push();
        camera2d.applyTransformations();
        EM.update();
        image(EM.graphics, -width*0.5, -height*0.5);
        pop();
    
    }else{
    
        camera2d.update();    
        EM.update();

        // Configure shader
        drawBallsShader.setUniform('resolution', [width, height]);
        drawBallsShader.setUniform('worldSize', [EM.worldSize.x, EM.worldSize.y]);
        drawBallsShader.setUniform('offsets', [camera2d.x, camera2d.y]);
        drawBallsShader.setUniform('zoom', camera2d.scale);
        let shaderDatas = EM.extractShaderDatas();
        drawBallsShader.setUniform('ballDatas', shaderDatas);
        drawBallsShader.setUniform('ballSize', 10);

        // Apply shader
        shader(drawBallsShader);
        // Draw rectangle
        rect(-width / 2, -height / 2, width, height);


        //////////REQUIRED workaround to reset 2d drawing behavior
        const gl = canvas.canvas.getContext('webgl');
        gl.disable(gl.DEPTH_TEST);
        resetShader();

    }
    debugWindow.display();

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









