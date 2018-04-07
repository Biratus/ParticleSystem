function Emitter(x,y) {
    this.particles=[];
    this.x=x;this.y=y;

    this.particlePerFrame=5;
    this.addParticleRate=10;
    this.timeoutAddParticle;
    this.deltaTime;
    this.lastTimeUpdate;

    this.particleParam={
        spawnRadius:{"minx":-1,"miny":-1,"maxx":1,"maxy":1},
        speed:1,
        direction:0,
        directionRandom:0.5,
        speedRandom:1
    };

    this.start=function() {
        this.addParticles();
        this.deltaTime=1000/FrameRate;
        this.lastTimeUpdate=new Date().getTime();
        this.intervalUpdate=setInterval(function(emit){emit.update();},1000/FrameRate,this);
    }

    this.addParticle=function() {
        let p= new Particle(this.x,this.y,
                            this.particleParam.spawnRadius,
                            this.randomDirection(),
                            random(this.particleParam.speed,this.particleParam.speed+this.particleParam.speedRandom));
        p.bindUpdateEvent(function(){
            //this.opacity-=0.005; 
        });
        p.bindEndingCondition(function(){
            return false;//this.opacity<=0; 
        });
        this.particles.push(p);
    }

    this.update=function() {
        this.deltaTime=new Date().getTime()-this.lastTimeUpdate;
        this.lastTimeUpdate=new Date().getTime();

        ctx.clearRect(0,0,width,height);
        ctx.fillStyle="#000000";
        ctx.fillRect(0,0,width,height);
        this.particles.sort(function(a,b) {
            let colA=a.color.split(",").reduce((acc,c)=>acc+c,0);
            let colB=b.color.split(",").reduce((acc,c)=>acc+c,0);
            return colA-colB;
        });
        for(let p of this.particles) {
            p.update(this.deltaTime);
            p.show();
        }

        this.particles=this.particles.filter(p => !p.toDelete);
    }

    this.addParticles=function() {
        for(let i=0;i<this.particlePerFrame;i++) this.addParticle();

        this.timeoutAddParticle=setTimeout(function(l) {
            l.addParticles();
        },this.addParticleRate,this);
    }

    this.randomDirection=function() {
        if(this.particleParam.direction===undefined) {
            return random(0,360)*Math.PI/180;
        }
        return random(this.particleParam.direction-this.particleParam.directionRandom,this.particleParam.direction+this.particleParam.directionRandom)
    }
}
