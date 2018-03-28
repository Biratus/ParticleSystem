var ctx;
var velCtx;
var e,e1;
var timeout;

const width=400,height=400;
const inputCanvasWidth=100,inputCanvasHeight=100;
const FrameRate=10;

window.onload=function() {
    let c=document.createElement("canvas");
    c.width=width;c.height=height;
    document.body.insertBefore(c,document.getElementById("values"));
    c.style.border="1px solid red";
    ctx=c.getContext("2d");
    //e = new Emitter(2*width/3,height);
    e = new Emitter(width/2,height/2);
//    e1=new Emitter(width/3,height);
//    e1.start();
    $("[type='range']").each(function(i,elt){
        let val=parseFloat(elt.value);
        e.particleParam.spawnRadius={"minx":-width*val/100,"miny":-height*val/100,"maxx":width*val/100,"maxy":height*val/100};
         e.particleParam.speedRandom=val;
        e.addParticleRate=val;
        e.particlePerFrame=val;
         e.particleParam.directionRandom=val;
    });
    $("[type='range']").on("change",function(event){
        let val=parseFloat(event.currentTarget.value);
        if($("#spawnRadius").is(event.currentTarget)) {
            e.particleParam.spawnRadius={"minx":-width*val/100,"miny":-height*val/100,"maxx":width*val/100,"maxy":height*val/100}
        } else if($("#speedRandom").is(event.currentTarget)) {
            e.particleParam.speedRandom=val;
        } else if($("#speed").is(event.currentTarget)) {
            e.particleParam.speed=val;
        } else if($("#emitUpRate").is(event.currentTarget)) {
            e.addParticleRate=val;
        } else if($("#partAddRate").is(event.currentTarget)) {
            e.particlePerFrame=val;
        } else if($("#directionRandom").is(event.currentTarget)) {
            e.particleParam.directionRandom=val;
        }
        $("#val_"+event.currentTarget.id).text(val);
        updateVelCanvas();
    });

    $("#velocityCanvas").on("click",function(event) {
        let vX=event.offsetX-inputCanvasWidth/2,vY=event.offsetY-inputCanvasHeight/2;
        
        e.particleParam.direction.x=vX/inputCanvasWidth;
        e.particleParam.direction.y=vY/inputCanvasHeight;
        updateVelCanvas();

    });

    let velC = document.getElementById("velocityCanvas");
    velC.width=inputCanvasWidth;
    velC.height=inputCanvasHeight;
    velCtx=velC.getContext("2d");
    updateVelCanvas();
    
    e.start();
    update();
}

function updateVelCanvas() {
    velCtx.clearRect(0,0,inputCanvasWidth,inputCanvasHeight);
     //spawnRadius
    let valRad=$("#spawnRadius").val();
    let xRad=inputCanvasWidth/2-valRad*inputCanvasWidth/100;
    let yRad=inputCanvasHeight/2-valRad*inputCanvasHeight/100;
    velCtx.fillStyle="#ff0000";
    velCtx.fillRect(xRad,yRad,valRad*inputCanvasWidth/50,valRad*inputCanvasHeight/50);
    velCtx.fillStyle="#ffffff";
    velCtx.fillRect(xRad+1,yRad+1,valRad*inputCanvasWidth/50-2,valRad*inputCanvasHeight/50-2);
    
    //direction
    //min dir
    velCtx.strokeStyle="#ff0000";
    velCtx.beginPath();
    velCtx.moveTo(inputCanvasWidth/2,inputCanvasHeight/2);
    velCtx.lineTo((e.particleParam.direction.x-e.particleParam.directionRandom)*inputCanvasWidth+inputCanvasWidth/2,(e.particleParam.direction.y-e.particleParam.directionRandom)*inputCanvasHeight+inputCanvasHeight/2);
    velCtx.stroke();
    
    //max dir
    velCtx.strokeStyle="#ffff00";
    velCtx.beginPath();
    velCtx.moveTo(inputCanvasWidth/2,inputCanvasHeight/2);
    velCtx.lineTo((e.particleParam.direction.x+e.particleParam.directionRandom)*inputCanvasWidth+inputCanvasWidth/2,(e.particleParam.direction.y+e.particleParam.directionRandom)*inputCanvasHeight+inputCanvasHeight/2);
    velCtx.stroke();
    
    
    velCtx.beginPath();
    velCtx.moveTo(inputCanvasWidth/2,inputCanvasHeight/2-inputCanvasHeight/20);
    velCtx.lineTo(inputCanvasWidth/2,inputCanvasHeight/2+inputCanvasHeight/20);
    velCtx.stroke();
    velCtx.beginPath();
    velCtx.moveTo(inputCanvasWidth/2-inputCanvasWidth/20,inputCanvasHeight/2);
    velCtx.lineTo(inputCanvasWidth/2+inputCanvasWidth/20,inputCanvasHeight/2);
    velCtx.stroke();

}

function stop() {
    clearTimeout(timeout);
}

function update() {
    ctx.clearRect(0,0,width,height);
    ctx.fillStyle="#000000";
    ctx.fillRect(0,0,width,height);

    e.update();
    //e1.update();

    timeout=setTimeout(update,FrameRate);
}

function random(min,max) {
    return Math.random() * (max - min) + min;
}