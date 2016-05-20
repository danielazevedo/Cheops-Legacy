"use strict";


(function()
{
	window.addEventListener("load", main);
}());

function main(){
	playMain();
	var bbutton=document.getElementsByTagName('button')[0];
	var back=function(){
		updateSound();
		location.href="../html/Main.html";
	}
	bbutton.addEventListener('click', back);
}