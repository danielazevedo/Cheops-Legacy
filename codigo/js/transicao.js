"use strict";


(function()
{
    window.addEventListener("load", main);
}());


function main(){

    var nivel = sessionStorage.nivel_atual;
    var num = nivel%2;
    document.getElementById("nivel").innerHTML = "Nivel " + nivel;

    document.body.style.background = "url(../imagens/corredor"+num+".png) no-repeat center center fixed";
    document.body.style.backgroundSize = "100% 100%";

    setTimeout(function(){

        location.href = "../html/MotorDeJogo.html";

    },2000);

}
