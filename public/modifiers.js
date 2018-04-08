function changeSpawnRadius(val) {
    $("#spawnRadius").val(val);
    $("#val_spawnRadius").text(val);
    e.particleParam.spawnRadius={"minx":-width*val*0.01/2,"miny":-height*val*0.01/2,"maxx":width*val*0.01/2,"maxy":height*val*0.01/2};
}

function changeSpeedRandom(val) {
    $("#speedRandom").val(val);
    $("#val_speedRandom").text(val);
    e.particleParam.speedRandom=val;
}

function changeSpeed(val) {
    $("#speed").val(val);
    $("#val_speed").text(val);
    e.particleParam.speed=val;
}

function changeSpawnParticleRate(val) {
    $("#emitUpRate").val(val);
    $("#val_emitUpRate").text(val);
    e.spawnParticleRate=val;
}

function changeParticlePerFrame(val) {
    $("#partAddRate").val(val);
    $("#val_partAddRate").text(val);
    e.particlePerFrame=val;
}

function changeDirectionRandom(val) {
    $("#directionRandom").val(val);
    $("#val_directionRandom").text(val);
    e.particleParam.directionRandom=val*Math.PI/180;
}

function changeDirection(val) {
    $("#direction").val(val);
    $("#val_direction").text(val);
    e.particleParam.direction=val*Math.PI/180;
}

function changeWidth(val) {
    $("#width").val(val);
    $("#val_width").text(val);
    particleParam.width=val;
}
function changeWidthRandom(val) {
    $("#widthRandom").val(val);
    $("#val_widthRandom").text(val);
    particleParam.widthRandom=val;
}

function changeColor(val) {
    if(val<0) {
        $("#currColor").css("background","white");
        $("#baw").prop("checked",false);
        particleParam.brightness=50;
    }
    else {
        $("#rangeColorPicker").val(val);
        $("#currColor").css("background","hsla("+val+",100%,50%,1)");
        $("#baw").prop("checked",false);
        $("#rndColor").prop("checked",false);
    }
    particleParam.color=val;
}

var brightnessCoef=10;

function changeBrightness() {
    if($("#brightnessCheck").is(":checked")){
        e.updateFunctions.brightness=function(dt){
            this.brightness+=$("#brightnessSelect").val()*brightnessChange*dt/brightnessCoef;
            if(this.brightness>100) this.brightness=100;
        };
        if($("#brightnessSelect").val()>0) {//increasing
            e.endingConditions.brightness=function() {
                return false;
            }
            particleParam.brightness=0;
        } else {//decreasing
            e.endingConditions.brightness=function() {
                return this.brightness<=0;
            }
            particleParam.brightness=100;
        }
    } else {
        particleParam.brightness=50;
        e.removeFunctionsFor("brightness");
    }
}

var opacityCoef=20;

function changeOpacity() {
    if($("#opacityCheck").is(":checked")){
        e.updateFunctions.opacity=function(dt){
            this.opacity+=$("#opacitySelect").val()*opacityChange*dt/opacityCoef;
            if(this.opacity>1) this.opacity=1;
        };
        if($("#opacitySelect").val()>0) {//increasing
            e.endingConditions.opacity=function() {
                return false;
            }
            particleParam.opacity=0;
        } else {//decreasing
            e.endingConditions.opacity=function() {
                return this.opacity<=0;
            }
            particleParam.opacity=1;
        }
    } else {
        particleParam.opacity=1;
        e.removeFunctionsFor("opacity");
    }
}

function toWhiteAndBlack() {
    particleParam.color=360;
    $("#brightnessCheck").prop("checked",false);
    changeBrightness();
    particleParam.brightness=100;
    $("#currColor").css("background","white");
}