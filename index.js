var ctx;
var velCtx;
var e,e1;
var timeout;

const width=400,height=400;
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
    e.start();
    update();
    $("[type='range']").on("change",function(event){
        let val=parseInt(event.currentTarget.value);
        if($("#spawnRadius").is(event.currentTarget)) {
            e.particleParam.spawnRadius={"minx":-1*val,"miny":-1*val,"maxx":val,"maxy":val}
        } else if($("#velocityRandom").is(event.currentTarget)) {
            e.particleParam.velocityRandom=val;
        } else if($("#emitUpRate").is(event.currentTarget)) {
            e.addParticleRate=val;
        } else if($("#partAddRate").is(event.currentTarget)) {
            e.particlePerFrame=val;
        }
        $("#val_"+event.currentTarget.id).text(val);
    });

    $("#velocityCanvas").on("click",function(event) {
        let vX=event.offsetX-50,vY=event.offsetY-50;
        
        e.particleParam.velocity.x=vX;
        e.particleParam.velocity.y=vY;
        velCtx.clearRect(0,0,100,100);
        drawCrossVelCanvas();
        velCtx.beginPath();
        velCtx.arc(event.offsetX,event.offsetY,2,0,2*Math.PI);
        velCtx.fill();

    });

    let velC = document.getElementById("velocityCanvas");
    velCtx=velC.getContext("2d");
    drawCrossVelCanvas();
}

function drawCrossVelCanvas() {
    velCtx.beginPath();
    velCtx.moveTo(50,45);
    velCtx.lineTo(50,55);
    velCtx.stroke();
    velCtx.beginPath();
    velCtx.moveTo(45,50);
    velCtx.lineTo(55,50);
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
    return Math.random() * (max - min + 1) + min;
}