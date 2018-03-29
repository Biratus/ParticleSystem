var ctx;
var velCtx;
var e,e1;
var timeout;

const width=400,height=400;
const inputCanvasWidth=100,inputCanvasHeight=100;
const FrameRate=10;

const baseX=1;
const baseY=0;
const baseSide=Math.sqrt(Math.pow(-baseX*inputCanvasWidth/2,2)+Math.pow(-baseY*inputCanvasHeight/2,2));

window.onload=function() {
    let c=document.createElement("canvas");
    c.width=width;c.height=height;
    document.body.insertBefore(c,document.getElementById("values"));
    ctx=c.getContext("2d");
    
    e = new Emitter(width/2,height/2);
    
    //init parameters
    let spanRadVal=parseInt($("#spawnRadius").val());
    e.particleParam.spawnRadius={"minx":-width*spanRadVal/100,"miny":-height*spanRadVal/100,"maxx":width*spanRadVal/100,"maxy":height*spanRadVal/100}
    e.particleParam.speedRandom=parseFloat($("#speedRandom").val());
    e.particleParam.speed=parseFloat($("#speed").val());
    e.addParticleRate=parseFloat($("#emitUpRate").val());
    e.particlePerFrame=parseFloat($("#partAddRate").val());
    e.particleParam.directionRandom=parseFloat($("#directionRandom").val());
    e.particleParam.direction=0;
    //slider change
    $("[type='range']").on("change",function(event){
        let val=parseFloat(event.currentTarget.value);
        if($("#spawnRadius").is(event.currentTarget)) {
            e.particleParam.spawnRadius={"minx":-width*val/100,"miny":-height*val/100,"maxx":width*val/100,"maxy":height*val/100};
        } else if($("#speedRandom").is(event.currentTarget)) {
            e.particleParam.speedRandom=val;
        } else if($("#speed").is(event.currentTarget)) {
            e.particleParam.speed=val;
        } else if($("#emitUpRate").is(event.currentTarget)) {
            e.addParticleRate=val;
        } else if($("#partAddRate").is(event.currentTarget)) {
            e.particlePerFrame=val;
        } else if($("#directionRandom").is(event.currentTarget)) {
            e.particleParam.directionRandom=val*Math.PI/180;
        } else if($("#direction").is(event.currentTarget)) {
            e.particleParam.direction=val*Math.PI/180;
        }
        $("#val_"+event.currentTarget.id).text(val);
        updateVelCanvas();
    });
    //canvas click
    /*$("#velocityCanvas").on("click",function(event) {
        
        let vX=event.offsetX-inputCanvasWidth/2,vY=event.offsetY-inputCanvasHeight/2;
        console.log("vX"+vX+" vY"+vY);
        let toPtSide=Math.sqrt(Math.pow(0-vX,2)+Math.pow(0-vY,2));
        let opposite=Math.sqrt(Math.pow(vX-baseX*inputCanvasWidth/2,2)+Math.pow(vY-baseY*inputCanvasHeight/2,2));
        console.log("topt"+toPtSide+" opp:"+opposite);
        let angle=Math.acos((toPtSide*toPtSide + baseSide*baseSide - opposite*opposite) / (2 * toPtSide * baseSide));
        console.log("cos"+Math.cos(angle)+"sin "+Math.sin(angle));
         angle=Math.atan2(Math.cos(angle),Math.sin(angle));
        //let angle=Math.atan2(vX,-vY);
        console.log(angle+"="+angle*(180/Math.PI));

        e.particleParam.direction=angle;
        updateVelCanvas();
        velCtx.fillStyle="#0000ff";
        velCtx.moveTo(vX+inputCanvasWidth/2,vY+inputCanvasHeight/2);
        velCtx.arc(vX+inputCanvasWidth/2,vY+inputCanvasHeight/2,2,0,Math.PI*2);
        velCtx.stroke();

    });*/
    //canvas display
    let velC = document.getElementById("velocityCanvas");
    velC.width=inputCanvasWidth;
    velC.height=inputCanvasHeight;
    velCtx=velC.getContext("2d");
    updateVelCanvas();

    e.start();
    //update();
}

function stop() {
    clearTimeout(timeout);
}

function update() {
    ctx.clearRect(0,0,width,height);
    ctx.fillStyle="#000000";
    ctx.fillRect(0,0,width,height);

    //e.update();
    
    //timeout=setTimeout(update,FrameRate);
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

    //baseLine
    velCtx.strokeStyle="#00ff00";//green
        velCtx.beginPath();
        velCtx.moveTo(inputCanvasWidth/2,inputCanvasHeight/2);
        velCtx.lineTo(baseX*inputCanvasWidth+inputCanvasWidth/2
                      ,baseY*inputCanvasHeight+inputCanvasHeight/2);
        velCtx.stroke();
    //direction
    if(e.particleParam.direction===undefined) {
        velCtx.fillStyle="#0000ff";
        velCtx.arc(inputCanvasWidth/2,inputCanvasHeight/2,inputCanvasHeight/3,0,Math.PI*2);
        velCtx.stroke();
    } else {
        //main dir
        velCtx.strokeStyle="#000000";//black
        velCtx.beginPath();
        velCtx.moveTo(inputCanvasWidth/2,inputCanvasHeight/2);
        velCtx.lineTo(Math.cos(e.particleParam.direction)*inputCanvasWidth+inputCanvasWidth/2
                      ,-Math.sin(e.particleParam.direction)*inputCanvasHeight+inputCanvasHeight/2);
        velCtx.stroke();
        
        //min dir
        velCtx.strokeStyle="#ff0000";//Red
        velCtx.beginPath();
        velCtx.moveTo(inputCanvasWidth/2,inputCanvasHeight/2);
        velCtx.lineTo(Math.cos(e.particleParam.direction-e.particleParam.directionRandom)*inputCanvasWidth+inputCanvasWidth/2
                      ,-Math.sin(e.particleParam.direction-e.particleParam.directionRandom)*inputCanvasHeight+inputCanvasHeight/2);
        velCtx.stroke();

        //max dir
        velCtx.strokeStyle="#0000ff";//blue
        velCtx.beginPath();
        velCtx.moveTo(inputCanvasWidth/2,inputCanvasHeight/2);
        velCtx.lineTo(Math.cos(e.particleParam.direction+e.particleParam.directionRandom)*inputCanvasWidth+inputCanvasWidth/2
                      ,-Math.sin(e.particleParam.direction+e.particleParam.directionRandom)*inputCanvasHeight+inputCanvasHeight/2);
        velCtx.stroke();   
    }


    velCtx.beginPath();
    velCtx.moveTo(inputCanvasWidth/2,inputCanvasHeight/2-inputCanvasHeight/20);
    velCtx.lineTo(inputCanvasWidth/2,inputCanvasHeight/2+inputCanvasHeight/20);
    velCtx.stroke();
    velCtx.beginPath();
    velCtx.moveTo(inputCanvasWidth/2-inputCanvasWidth/20,inputCanvasHeight/2);
    velCtx.lineTo(inputCanvasWidth/2+inputCanvasWidth/20,inputCanvasHeight/2);
    velCtx.stroke();
}


function random(min,max) {
    return Math.random() * (max - min) + min;
}