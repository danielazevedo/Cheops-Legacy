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
}