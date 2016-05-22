"use strict";


(function()
{
	window.addEventListener("load", main);
}());


function main(){
	playSound();
	var bbutton=document.getElementsByTagName('button')[0];
	var back=function(){
		updateSound();
		location.href="../html/Main.html";
	}
	bbutton.addEventListener('click', back);


	carrega_leaderboard();

}





function  carrega_leaderboard(){
	var pontuacoes,dados;
	var count=0;
	for(var i=0;i<10;i++){
		pontuacoes=localStorage.getItem("lvl"+i);
		if(pontuacoes!=null){
			dados=pontuacoes.split(" ");
			document.getElementsByClassName('name')[i-1].innerHTML=dados[0];
			document.getElementsByClassName('points')[i-1].innerHTML=dados[1]+"<br>";
		}
		


	}

}