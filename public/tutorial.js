var chronology=[
    {id:"#rangeColorPicker",event:"mousedown",eventFunc:function(){
        setSuggestion(227,this,"Let's try blue!");
        $(this).one('mouseup',function(){
            $(this).tooltip('hide');
            $(this).tooltip('dispose');
        });
    }},
    {id:"#speed",event:"mousedown",eventFunc:function(){
        setSuggestion(165,this,"Make it faster");

        $(this).one('mouseup',function(){
            $(this).tooltip('hide');
            $(this).tooltip('dispose');
        });
    }},
    {id:"#speedRandom",event:"mousedown",eventFunc:function(){
        setSuggestion(50,this,"Just this few");

        $(this).one('mouseup',function(){
            $(this).tooltip('hide');
            $(this).tooltip('dispose');
        });
    }},
    {id:"#directionRandom",event:"mousedown",eventFunc:function(){
        setSuggestion(40,this,"Spread the angle");

        $(this).one('mouseup',function(){
            $(this).tooltip('hide');
            $(this).tooltip('dispose');
        });
    }},
    {id:"#emitUpRate",event:"mousedown",eventFunc:function(){
        setSuggestion(50,this,"More often");

        $(this).one('mouseup',function(){
            $(this).tooltip('hide');
            $(this).tooltip('dispose');
        });
    }},
    {id:"#partAddRate",event:"mousedown",eventFunc:function(){
        setSuggestion(6,this,"More particles!");

        $(this).one('mouseup',function(){
            $(this).tooltip('hide');
            $(this).tooltip('dispose');
        });
    }},
    {id:"#opacityCheck",event:"change",eventFunc:function(){
        changeOpacity();
        $("#opacityCheck").on("change",function(event){
            changeOpacity();
        });

        $(this).tooltip('hide');
        $(this).tooltip('dispose');
        next();
    }},
    {id:"#widthRandom",event:"mousedown",eventFunc:function(){
        setSuggestion(20,this,"Up up up!");

        $(this).one('mouseup',function(){
            $(this).tooltip('hide');
            $(this).tooltip('dispose');
        });
    }},
    {id:"#canvas",event:"dblclick",eventFunc:function(){
        goFullScreen();
        $(this).tooltip('hide');
        $(this).tooltip('dispose');
        next();
        $("#canvas").on("dblclick",function(event){
            goFullScreen();
        });
    }},
    {id:"#fullscreen",event:"dblclick",eventFunc:function(){
        quitFullScreen();
        $(this).tooltip('hide');
        $(this).tooltip('dispose');
        $("#fullscreen").on("dblclick",function(event){
           quitFullScreen();
        });
        setTimeout(next,1000);
    }}
];

var currTutoIndex=7;

function startTutorial() {

    $('[data-toggle="popover"]').tooltip('hide');

    for(let obj of chronology) {
        $(obj.id).on('show.bs.tooltip',function(){
            $(obj.id).one(obj.event,function() {
                obj.eventFunc.call(this);

                $(obj.id).on('hide.bs.tooltip',function() {
                    next();
                });

            });
        });
    }

    $(chronology[currTutoIndex].id).tooltip("show");


}

function next() {
    currTutoIndex++;
    if(currTutoIndex<chronology.length) {
        $(chronology[currTutoIndex].id).tooltip('show');
    } else chronoEnd();
}

function chronoEnd() {
    alert('Well done!\nYou completed the tutorial, you can now play around with different parameters or you can hit "Random parameters" and see what happens!');
}

function setSuggestion(val,elt,text) {
    $(elt).tooltip('dispose');
    $(elt).attr('data-original-title',text);
    $(elt).tooltip('show');
    $(elt).on('shown.bs.tooltip',function(){
        $('.tooltip').css('left',parseInt($('.tooltip').css('left')) + getOffset(elt,val) + 'px');
    });


}

function getOffset(elt,target) {
    let min=$(elt).attr('min');
    let max=$(elt).attr('max');
    let width=$(elt).width();

    let du =target-(max-min)/2;
    let dx=du*width*0.5/((max-min)/2);
    return dx;
}