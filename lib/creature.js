

class Creature {
    constructor(_DNA={
        accelerationSpeed : random(0.8, 1.2),
        maxAcceleration : random(0.8, 1.2),
        maxSpeed : random(0.4, 0.6),
        health : 100.0,
        eyesight : random(100,400), //how far can it see
        hue : random(1), //color
        foodChainLevel : floor(random(1,3)),
        killSight : random(30,70)
    }) {
      this.DNA = _DNA;
      this.health = this.DNA.health;
      this.worldSize = createVector(100,100);

      this.position = createVector(random(this.worldSize.x),random(this.worldSize.y));
      this.rotation = createVector(random(2)-1,random(2)-1).normalize();
      this.rotationAngle = this.vectorToDegrees(this.rotation);
      this.acceleration = createVector(0,0);
      this.velocity = createVector(0,0);

      this.foodChainLevel = this.DNA.foodChainLevel;
      this.enableHunting = true;
      this.size = 5 + this.foodChainLevel * 2;
      this.setFoodChainLevel(this.DNA.foodChainLevel);

      this.targetPosition = createVector(0,0);

      let graphicsSize = max(max(max(this.size*2, this.DNA.eyesight*2), this.DNA.killSight*2) + 10, 10);
      this.graphics = createGraphics(graphicsSize, graphicsSize);
      this.graphics.textFont('monospace');
    }
    
    setFoodChainLevel(){
        this.foodChainLevel = this.DNA.foodChainLevel;
        this.size = 5 + this.foodChainLevel * 2;
        
    }

    getRGB(){
        colorMode(HSB, 1, 1, 1, 1);
        let col = color(this.DNA.hue, 1, 1, 1);
        let rgbCol = color(col); // Convert the color to RGB

        let r = red(rgbCol); // Extract the red component
        let g = green(rgbCol); // Extract the green component
        let b = blue(rgbCol); // Extract the blue component

        return [r, g, b];
    }

    addForce(v){
        this.rotation.add(v);
    }
    update(){

        //move forward
        this.rotation.normalize();
        this.acceleration.add(p5.Vector.mult(this.rotation,this.DNA.accelerationSpeed));
        
        this.targetPosition = this.position;

        this.health = (this.health - 0.01).toFixed(2);
        this.acceleration.limit(this.DNA.maxAcceleration);
        this.velocity.add(this.acceleration);
        this.acceleration.mult(0);
        this.velocity.mult(0.9);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
    }
  
    hunt(creatures){
        //loop throu all creatures in the ecosystem
        let closestPreyIndex = -1;
        let closestDist = 99999;

        for (let i = 0; i < creatures.length; i++) {
            let currentCreature = creatures[i];
            if(currentCreature.position.equals(this.position)){
                continue;
            }
            //calculate the distance
            let _dist = this.position.dist(currentCreature.position);
            if(_dist < this.DNA.eyesight && closestDist > _dist){
                closestDist = _dist;
                closestPreyIndex = i; //for now, dont care about the foodchain
            }
        }
        if(closestPreyIndex < 0){
            return;
        }
        //move towards the closest target
        let closestCreature = creatures[closestPreyIndex];
        if(this.foodChainLevel < closestCreature.foodChainLevel){
            //run away
            this.rotation.add(p5.Vector.sub(this.position, closestCreature.position ));
        }else if(this.foodChainLevel > closestCreature.foodChainLevel){
            //hunt
            this.targetPosition = closestCreature.position;
            this.rotation.add(p5.Vector.sub(closestCreature.position, this.position ));
            
            //check if you hunted the prey
            if(closestDist < this.DNA.killSight){
                return closestPreyIndex;
            }
        }
        //else just ignore him bruh

    }

    show(pg){

        this.graphics.clear();
        //this.graphics.background(random(1));
        this.graphics.colorMode(HSB,1,1,1);
        this.graphics.fill(this.DNA.hue,1,1);
        this.graphics.stroke(this.DNA.hue, 1,1);
        //pg.rect(this.position.x, this.position.y, 5, 10);
        this.graphics.push();
        this.graphics.translate(this.graphics.width*0.5, this.graphics.height*0.5);
        
        //health
        //this.graphics.stroke(0);
        //this.graphics.fill(0,0,1);
        //this.graphics.textAlign(CENTER);
        //this.graphics.textSize(10+this.size*2);
        //this.graphics.text(this.health, 0, -this.size*2);

        // + half_pi because in p5js, vector values are 90 degrees rotated to anticlockwise
        this.graphics.rotate(this.vectorToRadians(this.rotation) + HALF_PI);
        
        //direction line
        this.graphics.line(0,-this.size*3,0,0);
        
        //body
        this.graphics.triangle( 0,          -this.size, 
                                this.size,  this.size,
                                -this.size, this.size)

        //reach areas
        this.graphics.noFill();
        //this.graphics.stroke(this.DNA.foodChainLevel/2.0, 1, 1);
        this.graphics.stroke(0.33,1,1);
        this.graphics.ellipse(0, 0, this.DNA.eyesight*2);
        this.graphics.stroke(0,1,1);
        this.graphics.ellipse(0, 0, this.DNA.killSight*2);

        this.graphics.pop();

        //hunting target lines
        pg.line(this.position.x, this.position.y,
                this.targetPosition.x, this.targetPosition.y);

        //illusion of noBounds
        let _x = this.position.x - this.graphics.width*0.5;
        let _y = this.position.y - this.graphics.height*0.5;
        //draw 3x3 to so its borders can be seen from the other side
        //^ this stupid. why would you care about debug circle's beauty. no. it causes issues
        /*
        for (let y = -1; y <= 1; y++) {
            for (let x = -1; x <= 1; x++) {
                pg.image(this.graphics, 
                    _x + this.worldSize.x * x, 
                    _y + this.worldSize.y * y);
            }
        }
        */
        pg.image(this.graphics, _x, _y);
    }

    setRandomPosition(){
        this.position = createVector(random(this.worldSize.x),random(this.worldSize.y));
        this.rotation = createVector(random(2)-1,random(2)-1);
    }

    vectorToDegrees(vec){
        return degrees(atan2(vec.y, vec.x));
    }

    vectorToRadians(vec){
        return atan2(vec.y, vec.x);
    }
  }
  

























