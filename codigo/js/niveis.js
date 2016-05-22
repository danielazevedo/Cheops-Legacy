
"use strict";

(function()
{
    //automatically called as soon as the javascript is loaded
    window.addEventListener("load", main);
}());


function main() {
    playSound();
    var bbutton=document.getElementById('back');
    var b1 = document.getElementsByTagName('button')[0];
    var b2 = document.getElementsByTagName('button')[1];
    var b3 = document.getElementsByTagName('button')[2];
    var b4 = document.getElementsByTagName('button')[3];
    var b5 = document.getElementsByTagName('button')[4];
    var b6 = document.getElementsByTagName('button')[5];
    var b7 = document.getElementsByTagName('button')[6];
    var b8 = document.getElementsByTagName('button')[7];
    var b9 = document.getElementsByTagName('button')[8];
    var b10 = document.getElementsByTagName('button')[9];
    
    var nivelMax = sessionStorage.nivel;
    var opacDisabled = 0.5;
    
    for(var i=nivelMax; i<10; i++){
            document.getElementsByTagName('button')[i].style.opacity=opacDisabled;
            document.getElementsByTagName('button')[i].disabled=true;
        }

    var change=function(ev) {
        var v = ev.target.value;
        console.log(v);
        
        updateSound();
        if (v == "1" || v == "2" || v == "3" || v == "4" || v == "5" || v == "6" || v == "7" || v == "8" || v == "9" || v == "10"){
            sessionStorage.nivel_atual = v;
            location.href = "../html/MotorDeJogo.html";

    }
        else if(v =="back") {

            location.href = "../html/Main.html";
        }
    }


    document.addEventListener('click',change);



}
