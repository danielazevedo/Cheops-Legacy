
"use strict";
const opacDisabled=0.2;
(function()
{
    //automatically called as soon as the javascript is loaded
    window.addEventListener("load", main);
}());


function main() {
    playSound();
    var bbutton=document.getElementById("back");

    var mais= document.getElementById("mais");
    var menos= document.getElementById("menos");
    var sound = document.getElementsByTagName('audio')[0];
    var p=document.getElementsByTagName('p')[0];
    p.innerHTML="0"+Math.round(sound.volume*100);



    var aumentaVolume= function(ev){
        altera_volume(ev,mais,menos);

    }

    var diminuiVolume= function(ev){
        altera_volume(ev,menos,mais);

    }
    mais.addEventListener("click",aumentaVolume);
    menos.addEventListener("click",diminuiVolume);


    var back=function(){
        updateSound();
        location.href="../html/Main.html";
    }
    bbutton.addEventListener('click', back);

}
function changeMusic(){
    var sound = document.getElementsByTagName('AUDIO')[0];
    var x = document.getElementById("select");
    var i = x.selectedIndex;
    console.log(i);
    sound.src="../audio/musica"+i+".mp4";
}
function altera_volume(ev,btnClicked, otherBtn){
    var sound = document.getElementsByTagName('audio')[0];
    if(btnClicked.id=="menos"){
        if(sound.volume-0.1 <= 0.1){
            btnClicked.disabled=true;
            btnClicked.style.opacity=opacDisabled;
        }
        else{

            otherBtn.disabled=false;
            otherBtn.style.opacity=1;
        }
        sound.volume-=0.1;

    }
    else if(btnClicked.id=="mais") {

        if (sound.volume+0.1 >=0.9) {

            btnClicked.disabled = true;
            btnClicked.style.opacity = opacDisabled;
        }
        else{

            otherBtn.disabled=false;
            otherBtn.style.opacity=1;
        }
        sound.volume+=0.1;

    }
    var p=document.getElementsByTagName('p')[0];
    if((Math.round(sound.volume*100) != 0 && (Math.round(sound.volume*100) != 100))){
        p.innerHTML="0"+Math.round(sound.volume*100);
    }
    else if((p.innerHTML=Math.round(sound.volume*100))==0)
        p.innerHTML='00'+Math.round(sound.volume*100);
    else
        p.innerHTML=Math.round(sound.volume*100);

    localStorage.volume=sound.volume;
}

