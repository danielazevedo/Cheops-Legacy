"use strict";


(function()
{
    window.addEventListener("load", main);
}());


function main(){

    var value = getCookie("nivel");
    if (value != "nao existe") {
        var nivel = value[0];
    }

    document.getElementById("nivel").innerHTML = "Nivel " + nivel;

    setTimeout(function(){

        location.href = "../html/MotorDeJogo.html";

    },2000);

}

function getCookie(username) {
    var name = username + "=";
    var cookie;
    var c = document.cookie.split(';');
    for (let i = 0; i < c.length; i++) {
        cookie = c[i];
        while (cookie.charAt(0) == ' ') {//avança espaços em branco
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) == 0) {//se existir o username na cookie, retorna o valor
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "nao existe";
}