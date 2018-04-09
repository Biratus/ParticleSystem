function Emitter(x,y) {
    this.particles=[];
    this.x=x;this.y=y;

    this.timeoutAddParticle;
    this.deltaTime;
    this.lastTimeUpdate;

    this.updateFunctions={};
    this.endingConditions={};

    this.spawnParticleRateValue=10;

    Object.defineProperty(this,'spawnParticleRate',{
        set:function(newVal) {
            this.spawnParticleRateValue=newVal;
            clearInterval(this.timeoutAddParticle);
            this.timeoutAddParticle=setInterval(function(l) {
                l.addParticles();
            },this.spawnParticleRateValue,this);

        }
    });

    this.particlePerFrame=5;
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


        clearInterval(this.timeoutAddParticle);
        this.timeoutAddParticle=setInterval(function(l) {
            l.addParticles();
        },this.spawnParticleRateValue,this);
    }

    this.stop=function() {
        clearInterval(this.timeoutAddParticle);
    }

    this.addParticle=function() {
        let p= new Particle(this.x,this.y,
                            this.particleParam.spawnRadius,
                            this.randomDirection(),
                            random(this.particleParam.speed,this.particleParam.speed+this.particleParam.speedRandom));
        for(let i in this.updateFunctions) {
            if(this.updateFunctions[i]!=null) p.bindUpdateEvent(this.updateFunctions[i]);
        }
        for(let i in this.endingConditions) {
            if(this.endingConditions[i]!=null) p.bindEndingCondition(this.endingConditions[i]);
        }

        this.particles.push(p);
    }

    this.removeFunctionsFor=function(func) {
        this.updateFunctions[func]=null;
        this.endingConditions[func]=null;
    }

    this.update=function() {
        try {
            this.deltaTime=new Date().getTime()-this.lastTimeUpdate;
            this.lastTimeUpdate=new Date().getTime();

            let coef=width/10;
            this.particleParam.direction+=(Math.PI/2/1000)*this.deltaTime;
            this.x=width/2+Math.cos(this.particleParam.direction)*coef;
            this.y=height/2-Math.sin(this.particleParam.direction)*coef;

            for(let p of this.particles) {
                p.update(this.deltaTime);
                p.show();
            }
        } catch(ex) {
            console.error(ex);
        }

        this.particles=this.particles.filter(p => !p.toDelete);
    }

    this.addParticles=function() {
        for(let i=0;i<this.particlePerFrame;i++) this.addParticle();
    }

    this.randomDirection=function() {
        if(this.particleParam.direction===undefined) {
            return random(0,360)*Math.PI/180;
        }
        return random(this.particleParam.direction-this.particleParam.directionRandom,this.particleParam.direction+this.particleParam.directionRandom)
    }
}