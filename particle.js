function Particle(x,y,spawnRadius,direction,speed) {
    spawnRadius = spawnRadius || {"minx":-1,"miny":-1,"maxx":1,"maxy":1};
    this.x=x+random(spawnRadius.minx,spawnRadius.maxx);
    this.y=y+random(spawnRadius.miny,spawnRadius.maxy);
    
    this.opacity=1;
    
    this.speed=speed
    
    this.direction=direction || 0;
    
    this.toDelete=false;
    this.color=Math.floor(random(0,255))+","+Math.floor(random(0,255))+","+Math.floor(random(0,255));
    
    this.updateEvents=[];
    this.endingConditions=[];
    
    this.bindUpdateEvent=function(func) {
        this.updateEvents.push(func);
    }
    
    this.bindEndingCondition=function(func) {
        this.endingConditions.push(func);
    }

    this.show=function() {
       // ctx.fillStyle="rgba(255,255,255,"+this.opacity+")";
        ctx.fillStyle="rgba("+this.color+",1)";
        ctx.beginPath();
        ctx.arc(this.x,this.y,7,0,2*Math.PI);
        ctx.fill();
    }
    this.update=function() {
        this.x+=Math.cos(this.direction)*this.speed;
        this.y-=Math.sin(this.direction)*this.speed;
        
        for(let f of this.updateEvents) f.call(this);
        
        this.toDelete=this.endingCondition();
    }

    this.endingCondition=function() {
        let cancel = this.x<0 || this.x>width || this.y<0 || this.y>height;
        for(let f of this.endingConditions) cancel = cancel | f.call(this);
        return cancel;
    }
}