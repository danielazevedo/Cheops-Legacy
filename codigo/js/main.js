
"use strict";

(function()
{
	//automatically called as soon as the javascript is loaded
	window.addEventListener("load", main);
}());


function main() {
	playSound();
	var leftButton=window.document.getElementById("left");
	var rightButton=window.document.getElementById("right");
	var firstButton= window.document.getElementById("first");
	var secondButton= window.document.getElementById("second");
	var thirdButton= window.document.getElementById("third");
	var bbutton=window.document.getElementById('logout');


	var array=["Leaderboard","Ajuda","Jogar","Definições","Créditos"];
	var click=false;
	leftButton.innerHTML=array[0];
	leftButton.value=array[0];
	firstButton.innerHTML=array[1];
	firstButton.value=array[1];
	secondButton.innerHTML=array[2];
	secondButton.value=array[2];
	thirdButton.innerHTML=array[3];
	thirdButton.value=array[3];
	rightButton.innerHTML=array[4];
	rightButton.value=array[4];




	var rotFunction=function(ev){
		rotation(ev,array,firstButton,secondButton,thirdButton,leftButton,rightButton);
	}


	var changehtml=function(ev){
		//updateSound();
		location.href=('../html/'+ev.target.value+'.html');
	}



	var back=function(){
		deleteInfo();
		location.href="../html/Login.html";
	}


	bbutton.addEventListener('click', back);
	firstButton.addEventListener('click', changehtml);
	secondButton.addEventListener('click', changehtml);
	thirdButton.addEventListener('click', changehtml);
	leftButton.addEventListener("mouseover",rotFunction);
	rightButton.addEventListener("mouseover",rotFunction);

}


function rotation(ev,array,firstButton,secondButton,thirdButton,leftButton, rightButton){
	var i=0;
	

	var name=ev.currentTarget.id;
	if(name=="left"){
		while(leftButton.value!=array[i]){
		i++;
	}
		rightButton.innerHTML=thirdButton.innerHTML;
		rightButton.value=thirdButton.innerHTML;
		thirdButton.innerHTML=secondButton.innerHTML;
		thirdButton.value=secondButton.value;
		secondButton.innerHTML=firstButton.innerHTML;
		secondButton.value=firstButton.value;
		firstButton.innerHTML=leftButton.innerHTML;
		firstButton.value=leftButton.innerHTML;

		i=Backward(array,i,leftButton);
	}
	else if(name=="right"){
		while(rightButton.value!=array[i]){
		i++;
	}
		leftButton.innerHTML=firstButton.innerHTML;
		leftButton.value=firstButton.value;
		firstButton.innerHTML=secondButton.innerHTML;
		firstButton.value=secondButton.value;
		secondButton.innerHTML=thirdButton.innerHTML;
		secondButton.value=thirdButton.value;
		thirdButton.innerHTML=rightButton.innerHTML;
		thirdButton.value=rightButton.value;
		i=Forward(array,i,rightButton);
	}


}

function Forward(array,i,button){
	if(i+1<=array.length-1){
		i++;
	}
	else if(i+1==array.length)
		i=0;


	button.innerHTML=array[i];
	button.value=array[i];
	return i;
}

function Backward(array,i,button){
	if(i-1>=0){
		i--;
	}
	else if(i-1<0)
		i=array.length-1;


	button.innerHTML=array[i];
	button.value=array[i];
	return i;
}