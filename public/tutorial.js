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
        opacityChecked();
        $("#opacityCheck").on("change",function(event){
            changeOpacity();
            opacityChecked();
        });

        $(this).tooltip('hide');
        $(this).tooltip('dispose');
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
        $("#canvas").on("dblclick",function(event){
            goFullScreen();
        });
    }}
];

var currTutoIndex=5;

function startTutorial() {

    $('[data-toggle="popover"]').tooltip('hide');

    for(let obj of chronology) {
        $(obj.id).on('show.bs.tooltip',function(){
            console.log('show'+obj.id);
            $(obj.id).one(obj.event,function() {
                obj.eventFunc.call(this);


            });
            $(obj.id).on('hide.bs.tooltip',function() {
                console.log('hide'+chronology[currTutoIndex].id);
                currTutoIndex++;
                if(currTutoIndex<chronology.length) {
                    $(chronology[currTutoIndex].id).tooltip('show');
                } else chronoEnd();
            });
        });


    }

    $(chronology[currTutoIndex].id).tooltip("show");


}

function opacityChecked() {
    /*for(let i in chronology) {
        console.log('i:'+chronology[i].id);
        if(chronology[i].id=="#opacityCheck") {
            if(currTutoIndex==i) {
                $("#opacityCheck").tooltip('hide');
                $("#opacityCheck").tooltip('dispose');
                currTutoIndex++;
                $(chronology[currTutoIndex].id).tooltip('show');
            }
            else return;

        }
    }*/
}

function chronoEnd() {

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