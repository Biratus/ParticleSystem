var particleParam={
    "color":360,"opacity":1,"brightness":50,"width":7,"widthRandom":0,"fill":true
};
function Particle(x,y,spawnRadius,direction,speed) {
    spawnRadius = spawnRadius || {"minx":-1,"miny":-1,"maxx":1,"maxy":1};
    this.x=x+random(spawnRadius.minx,spawnRadius.maxx);
    this.y=y+random(spawnRadius.miny,spawnRadius.maxy);

    this.opacity=particleParam.opacity;
    this.brightness=particleParam.brightness;
    this.colorValue;
    this.fill=particleParam.fill;
    
    this.color=(particleParam.color<0)?random(0,360):particleParam.color;
    
    this.width=random(particleParam.width,particleParam.width+particleParam.widthRandom);

    this.speed=speed

    this.direction=direction || 0;

    this.toDelete=false;

    this.updateEvents=[];
    this.endingConditions=[];

    this.bindUpdateEvent=function(func) {
        this.updateEvents.push(func);
    }

    this.bindEndingCondition=function(func) {
        this.endingConditions.push(func);
    }

    this.show=function() {
        ctx.fillStyle=this.colorHsl();
        ctx.strokeStyle=this.colorHsl();
        ctx.lineWidth=2;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.width,0,2*Math.PI);
        if(this.fill) ctx.fill();
        else ctx.stroke();
    }
    this.update=function(dt) {
        this.x+=((Math.cos(this.direction)*this.speed)/1000)*dt;
        this.y-=((Math.sin(this.direction)*this.speed)/1000)*dt;

        for(let f of this.updateEvents) f.call(this,dt);

        this.toDelete=this.endingCondition();
    }

    this.endingCondition=function() {
        let cancel = this.x+this.width/2<0 || this.x-this.width/2>width || this.y+this.width/2<0 || this.y-this.width/2>height;
        for(let f of this.endingConditions) cancel = cancel | f.call(this);
        return cancel;
    }

    this.colorHsl=function() {
        return "hsla("+this.color+",100%,"+this.brightness+"%,"+this.opacity+")";
    }
}