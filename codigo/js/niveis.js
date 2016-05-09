
"use strict";

(function()
{
    //automatically called as soon as the javascript is loaded
    window.addEventListener("load", main);
}());


function main() {
    var bbutton=document.getElementById('back');
    var back=function(){
        location.href="../html/Main.html";
    }
    bbutton.addEventListener('click', back);


}