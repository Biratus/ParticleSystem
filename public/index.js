var ctx;
var velCtx;
var emitters=[];

const opacityChange=0.01;
const brightnessChange=0.7;

var width=400,height=400;
const inputCanvasWidth=200,inputCanvasHeight=200;
const FrameRate=60;

const baseX=1;
const baseY=0;
const baseSide=Math.sqrt(Math.pow(-baseX*inputCanvasWidth/2,2)+Math.pow(-baseY*inputCanvasHeight/2,2));

window.onload=function() {
    //canvas particle display
    let c=document.getElementById("canvas");
    $("#canvas").width(width);
    $("#canvas").height(height);
    c.width=width;
    c.height=c.width;
    ctx=c.getContext("2d");

    //canvas parameters display
    let velC = document.getElementById("velocityCanvas");
    velC.width=inputCanvasWidth;
    velC.height=inputCanvasHeight;
    velCtx=velC.getContext("2d");

    let e1=new Emitter(width/2,height/2);

    emitters.push(e1);

    //init parameters
    reset();
    changeOpacity();
    changeBrightness();

    //slider change
    $("[type='range']").on("change",function(event){
        let val=parseFloat($(this).val());
        if($(this).is("#spawnRadius")) {
            changeSpawnRadius(val);
            updateVelCanvas();
        } else if($(this).is("#speedRandom")) {
            changeSpeedRandom(val);
        } else if($(this).is("#speed")) {
            changeSpeed(val);
        } else if($(this).is("#emitUpRate")) {
            changeSpawnParticleRate(val);
        } else if($(this).is("#partAddRate")) {
            changeParticlePerFrame(val);
        } else if($(this).is("#directionRandom")) {
            changeDirectionRandom(val);
            updateVelCanvas();
        } else if($(this).is("#direction")) {
            changeDirection(val);
            updateVelCanvas();
        } else if($(this).is("#brightnessCoef")) {
            brightnessCoef=val;
        } else if($(this).is("#opacityCoef")) {
            opacityCoef=val; 
        } else if($(this).is("#width")) {
            changeWidth(val);
        } else if($(this).is("#widthRandom")) {
            changeWidthRandom(val);
        }
        $("#val_"+$(this).attr('id')).text(val);
    });

    /*
    update particles functions change
    */
    //Opacity
    $("#opacityCheck").on("change",function(event){
        changeOpacity();
    });
    $("#opacitySelect").on("change",function(event){
        changeOpacity();
    });
    //Brighness
    $("#brightnessCheck").on("change",function(event){
        changeBrightness();
    });
    $("#brightnessSelect").on("change",function(event){
        changeBrightness();
    });
    /*
    Black and White
    */
    $("#baw").on("change",function(event){
        if($(this).is(":checked")) {
            toWhiteAndBlack();
        } 
        else {
            cahngeColor($("#rangeColorPicker").val());
        }
    });

    $("#fill").on("change",function(event){
        if($(this).is(":checked")) {
            particleParam.fill=true;
        } 
        else {
            particleParam.fill=false;
        }
    });

    $("#rndColor").on("change",function(event){
        if($(this).is(":checked")) {
            changeColor(-1);
        } 
        else {
            changeColor($("#rangeColorPicker").val());
        }
    });

    $(function () {
        $('[data-toggle="popover"]').popover({
            container: 'body'
        });
    });

    $("#rangeColorPicker").css("background",colorPickerGradient("webkit"));
    $("#rangeColorPicker").on("change",function(event) {
        changeColor($(this).val());
    })

    e.start();
}

function stop() {
    clearInterval(e.intervalUpdate);
}

function updateVelCanvas() {
    velCtx.clearRect(0,0,inputCanvasWidth,inputCanvasHeight);

    //spawnRadius
    let valRad=$("#spawnRadius").val()*0.01;
    let xRad=(1-valRad)*inputCanvasWidth/2;
    let yRad=(1-valRad)*inputCanvasHeight/2;
    velCtx.strokeStyle="#ff0000";
    velCtx.strokeRect(xRad,yRad,inputCanvasWidth-2*xRad,inputCanvasHeight-2*yRad);

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

function reset() {
    e.particles=[];
    changeSpawnRadius(0);
    changeSpeedRandom(0);
    changeSpeed(100);
    changeSpawnParticleRate(200);
    changeParticlePerFrame(1);
    changeDirectionRandom(0);
    changeDirection(0);

    $("#opacityCheck").prop("checked",false);
    $("#brightnessCheck").prop("checked",false);
    $("#fill").prop("checked",true);

    particleParam={
        "color":180,"opacity":1,"brightness":50,"width":7,"widthRandom":0,"fill":true
    }

    changeOpacity();
    changeBrightness();
    toWhiteAndBlack();
    updateVelCanvas();

}

//type=moz || webkit
function colorPickerGradient(type) {
    let style="-"+type+"-linear-gradient(left";
    for(let i=0;i<360;i+=10) style+=",hsla("+i+",100%,50%,1)";
    style+=")";
    return style;
}

function random(min,max) {
    return Math.random() * (max - min) + min;
}

function randomize() {
    e.particles=[];

    changeSpawnRadius(randomRange("#spawnRadius"));
    changeSpeedRandom(Math.round(random(0,1))?randomRange("#speedRandom"):parseFloat($("#speedRandom").attr('min')));
    changeSpeed(randomRange("#speed"));
    changeSpawnParticleRate(randomRange("#emitUpRate"));
    changeParticlePerFrame(randomRange("#partAddRate"));
    changeDirectionRandom(Math.round(random(0,1))?randomRange("#directionRandom"):parseFloat($("#directionRandom").attr('min')));
    changeDirection(randomRange("#direction"));
    changeWidth(randomRange("#width"));
    changeWidthRandom(Math.round(random(0,1))?randomRange("#widthRandom"):parseFloat($("#widthRandom").attr('min')));

    let colorChoice=random(0,99);
    if(colorChoice<=33) {//black and white
        toWhiteAndBlack();
        $("#baw").prop("checked",true);
    } else if(colorChoice<=66) {//rndColor
        changeColor(-1);
        $("#rndColor").prop("checked",true);
        let brightness=Math.round(random(0,1));
        if(brightness) {
            $("#brightnessCheck").prop("checked",true);
            $("#brightnessSelect").val(Math.round(random(0,1))==0?-1:1);
            let delay=randomRange("#brightnessCoef");
            $("#brightnessCoef").val(delay);
            $("#val_brightnessCoef").text(delay);
            brightnessCoef=delay;
        } else {
            $("#brightnessCheck").prop("checked",false);
        }
        changeBrightness();
    } else {//specific color
        changeColor(randomRange("#rangeColorPicker"));
        let brightness=Math.round(random(0,1));
        if(brightness) {
            $("#brightnessCheck").prop("checked",true);
            $("#brightnessSelect").val(Math.round(random(0,1))==0?-1:1);
            let delay=randomRange("#brightnessCoef");
            $("#brightnessCoef").val(delay);
            $("#val_brightnessCoef").text(delay);
            brightnessCoef=delay;
        } else {
            $("#brightnessCheck").prop("checked",false);
        }
        changeBrightness();
    }
    //Opacity
    let opacity=Math.round(random(0,1));
    if(opacity) {
        $("#opacityCheck").prop("checked",true);
        $("#opacitySelect").val(Math.round(random(0,1))==0?-1:1);
        let delay=randomRange("#opacityCoef");
        $("#opacityCoef").val(delay);
        $("#val_opacityCoef").text(delay);
        opacityCoef=delay;
    } else {
        $("#opacityCheck").prop("checked",false);
    }
    changeOpacity();
    
    //fill
    if(Math.round(random(0,1))) particleParam.fill=true;
    else particleParam.fill=false;
    $("#fill").prop("checked",particleParam.fill);

    updateVelCanvas();
}

function randomRange(id) {
    let val=random($(id).attr('min'),$(id).attr('max'));
    if($(id).attr('step')%1>0) return parseFloat(val);
    val=Math.round(val);
    if(val<$(id).attr('min')) val=$(id).attr('min');
    else if(val>$(id).attr('max')) val=$(id).attr('max');
    return parseInt(val);
}