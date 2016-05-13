
"use strict";

(function()
{
    //automatically called as soon as the javascript is loaded
    window.addEventListener("load", main);
}());


function main() {
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



    var change=function(ev) {
        var v = ev.target.value;
        console.log(v);
        if (v != "back"){

            var str = "nivel=" + v + "; expires=Thu, 1 Dec 2017 12:00:00 UTC";
            console.log(str);
            document.cookie = str;
            location.href = "../html/MotorDeJogo.html";
    }
        else {

            location.href = "../html/Main.html";
        }
    }


    document.addEventListener('click',change);



}