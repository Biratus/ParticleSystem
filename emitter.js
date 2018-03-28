function Emitter(x,y) {
    this.particles=[];
    this.x=x;this.y=y;

    this.particlePerFrame=5;
    this.addParticleRate=10;
    this.timeoutAddParticle;

    this.particleParam={
        spawnRadius:{"minx":-1,"miny":-1,"maxx":1,"maxy":1},
        velocity:{"x":0,"y":0},
        velocityRandom:1
    };

    this.start=function() {
        //TODO emitter update in here
        this.addParticles();
    }

    this.addParticle=function() {
        let p= new Particle(this.x,this.y,
                            this.particleParam.spawnRadius,
                           this.randomVelocity());
        p.bindUpdateEvent(function(){
            this.opacity-=0.01; 
        });
        p.bindEndingCondition(function(){
            return this.opacity<=0; 
        });
        this.particles.push(p);
    }

    this.update=function() {
        for(let i=this.particles.length-1;i>=0;i--) {
            let p=this.particles[i];
            p.update();
            p.show();
            if(p.toDelete) this.particles.splice(i,1);
        }

        /*this.y-=1.5;
        if(this.y<-10) clearTimeout(this.timeoutAddParticle);*/
    }

    this.addParticles=function() {
        for(let i=0;i<this.particlePerFrame;i++) this.addParticle();
        
        this.timeoutAddParticle=setTimeout(function(l) {
            l.addParticles();
        },this.addParticleRate,this);
    }
    
    this.randomVelocity=function() {
        return {"x":this.particleParam.velocity.x+random(-1*this.particleParam.velocityRandom,this.particleParam.velocityRandom),"y":this.particleParam.velocity.y+random(-1*this.particleParam.velocityRandom,this.particleParam.velocityRandom)};
    }
}
