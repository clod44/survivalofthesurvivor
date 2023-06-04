


class EcosystemManager{

    constructor(worldSizeX = 500, worldSizeY = 500){
        this.worldSize = createVector(worldSizeX, worldSizeY);
        this.graphics = createGraphics(worldSizeX, worldSizeY); 
        this.creatures = [];
        this.mutationRate = 0.1;
        this.turnAwayForce = 1;
    }

    addCreatures(count = 1){
        for (let i = 0; i < count; i++) {
            let newCreature = new Creature();
            newCreature.worldSize = createVector(this.worldSize.x, this.worldSize.y);
            newCreature.setRandomPosition();
            this.creatures.push(newCreature)
        }
    }

    resetGraphics(){
        this.graphics.colorMode(RGB,255,255,255);
        this.graphics.clear();
        this.graphics.background(20);
        this.graphics.noFill();
        this.graphics.strokeWeight(1);
        this.graphics.stroke(255);
        this.graphics.rect(0,0,this.worldSize.x, this.worldSize.y);
    }

    update(){
        
        this.resetGraphics();

        let corpseIndexes = [];
        for (let i = 0; i < this.creatures.length; i++) {
            let c = this.creatures[i];        
            c.update();
            
            if(c.health < 0){
                //if its dead
                corpseIndexes.push(i);
                continue;
            }
            
            //breed for some random probability
            if(random(1000)<1) this.creatures.push(this.evolveNewFrom(c));
            
            //if its alive. check if it can hunt
            let huntedDownCreatureIndex = c.hunt(this.creatures);
            if(huntedDownCreatureIndex != undefined){
                corpseIndexes.push(huntedDownCreatureIndex);
                //breed yourself
                this.creatures.push(this.evolveNewFrom(c));
            }
            
            c.position.x = (c.position.x + this.worldSize.x) % this.worldSize.x;
            c.position.y = (c.position.y + this.worldSize.y) % this.worldSize.y;

            /*
            //world boundry check
            // Calculate forces based on distance from boundary edges
            let forceX = 0;
            let forceY = 0;

            // Calculate forces based on x-axis distance
            let distanceX = constrain(this.bufferZoneWidth - c.position.x, 0, this.bufferZoneWidth);
            forceX = map(distanceX, 0, this.bufferZoneWidth, 0, this.turnAwayForce);
            let distanceXRight = constrain(c.position.x - (this.worldSize.x - this.bufferZoneWidth), 0, this.bufferZoneWidth);
            forceX -= map(distanceXRight, 0, this.bufferZoneWidth, 0, this.turnAwayForce);

            // Calculate forces based on y-axis distance
            let distanceY = constrain(this.bufferZoneWidth - c.position.y, 0, this.bufferZoneWidth);
            forceY = map(distanceY, 0, this.bufferZoneWidth, 0, this.turnAwayForce);
            let distanceYBottom = constrain(c.position.y - (this.worldSize.y - this.bufferZoneWidth), 0, this.bufferZoneWidth);
            forceY -= map(distanceYBottom, 0, this.bufferZoneWidth, 0, this.turnAwayForce);

            // Apply the forces to turn away from the boundary
            c.rotation.add(createVector(forceX, forceY));
            */
           
            c.show(this.graphics); 
        }

        //remove dead creatures from the ecosystem
        this.creatures = this.creatures.filter((element, index) => !corpseIndexes.includes(index));
    }


    evolve(creature){

        creature.DNA = {
            acceleration:       creature.DNA.acceleration       + random(-0.01, 0.01),
            maxAcceleration:    creature.DNA.maxAcceleration    + random(-0.01, 0.01),
            maxSpeed:           creature.DNA.maxSpeed           + random(-0.01, 0.01),
            health:             creature.DNA.health             + random(-0.01, 0.01),
            eyesight:           creature.DNA.eyesight           + random(-0.01, 0.01),
            hue:                creature.DNA.hue                + random(-0.01, 0.01),
            foodChainLevel:     creature.DNA.foodChainLevel     ,//+ floor(random(1.1)),
            killSight:          creature.DNA.killSight          + random(-0.01, 0.01)  
        }
    }
    evolveNewFrom(creature){
        return new Creature({
            acceleration:       creature.DNA.acceleration       + random(-0.01, 0.01),
            maxAcceleration:    creature.DNA.maxAcceleration    + random(-0.01, 0.01),
            maxSpeed:           creature.DNA.maxSpeed           + random(-0.01, 0.01),
            health:             creature.DNA.health             + random(-0.01, 0.01),
            eyesight:           creature.DNA.eyesight           + random(-0.01, 0.01),
            hue:                creature.DNA.hue                + random(-0.1, 0.1),
            foodChainLevel:     creature.DNA.foodChainLevel     ,//+ floor(random(1.1)),
            killSight:          creature.DNA.killSight          + random(-0.01, 0.01)

          });
    }    

    deepCopy(obj){
        return JSON.parse(JSON.stringify(obj));   
    }


}






















