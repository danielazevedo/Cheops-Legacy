"use strict";


(function()
{
	window.addEventListener("load", main);
}());


function main(){
	var bbutton=document.getElementsByTagName('button')[0];
	var back=function(){
		location.href="../html/Main.html";
	}
	bbutton.addEventListener('click', back);

	document.cookie="leaderboard=Daniel 3 10,Diniz 1 5,Paulo 6 1 ;expires=Thu, 01 Jan 2017 00:00:00 UTC";

	carrega_leaderboard();

}


function getCookie(nome){
	var name = nome + "=";
	var cookie;
	var c = document.cookie.split(';');
	for(let i=0;i< c.length;i++){
		cookie=c[i];
		while (cookie.charAt(0)==' ') {//avança espaços em branco
			cookie = cookie.substring(1);
		}
		if (cookie.indexOf(name) == 0) {//se existir o username na cookie, retorna o valor
			return cookie.substring(name.length,cookie.length);
		}
	}
	return "nao existe";


}



function createCookie(nome){

	//verifica se o utilizador ja existe
	var valor=getCookie(nome);
	if(valor!="nao existe"){
		alert("Nome de utilizador ja existente!");
		return 0;
	}
	else {
		document.cookie = nome + "="/* falta o nome de utilizador, nivel e tempo*/;
		alert('Cookie criada!');
		return 1;

	}


}


function  carrega_leaderboard(){
	var valor=getCookie("leaderboard");
	var pontuacoes,dados;
	var count=0;
	if(valor!="nao existe"){
		pontuacoes=valor.split(',');
		for(let i=0;i<pontuacoes.length;i++){
			dados=pontuacoes[i].split(' ');
			document.getElementsByClassName('name')[dados[1]-1].innerHTML=dados[0];
			document.getElementsByClassName('points')[dados[1]-1].innerHTML=dados[2]+"<br>";
			count++;
		}

	}

}