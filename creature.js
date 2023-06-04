

class Creature {
    constructor(_DNA={
        accelerationSpeed : random(0.8, 1.2),
        maxAcceleration : random(0.8, 1.2),
        maxSpeed : random(0.4, 0.6),
        health : 100.0,
        eyesight : random(300,700), //how far can it see
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
      this.size = 5 + this.foodChainLevel * 2;
      this.setFoodChainLevel(this.DNA.foodChainLevel);

      this.targetPosition = createVector(0,0);
    }
    
    setFoodChainLevel(){
        this.foodChainLevel = this.DNA.foodChainLevel;
        this.size = 5 + this.foodChainLevel * 2;
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
        pg.colorMode(HSB,1,1,1);
        pg.fill(this.DNA.hue,1,1);
        pg.stroke(this.DNA.hue, 1,1);
        //pg.rect(this.position.x, this.position.y, 5, 10);
        pg.push();
        pg.translate(this.position.x, this.position.y);
        // + half_pi because in p5js, vector values are 90 degrees rotated to anticlockwise
        pg.rotate(this.vectorToRadians(this.rotation) + HALF_PI);
        pg.line(0,-this.size*3,0,0);
        pg.triangle(0,          -this.size, 
                    this.size,  this.size,
                    -this.size, this.size)
        pg.noFill();
        pg.stroke(this.DNA.foodChainLevel/2.0, 1, 1);
        pg.ellipse(0, 0, this.DNA.eyesight*2);
        pg.ellipse(0, 0, this.DNA.killSight*2);
        pg.pop();
        pg.line(this.position.x, this.position.y,
                this.targetPosition.x, this.targetPosition.y);
        pg.stroke(0);
        pg.fill(0,0,1);
        pg.textAlign(CENTER);
        pg.textSize(10+this.size*2);
        pg.text(this.health, this.position.x, this.position.y - this.size*2);
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
  

























