"use strict";


(function()
{
	window.addEventListener("load", main);
}());


function main() {
	var lbutton=document.getElementsByTagName('Button')[0];
	var jbutton=document.getElementsByTagName('Button')[1];


	imprime_cookies();


	lbutton.addEventListener("click", login);
	jbutton.addEventListener("click", join);


}


function join(){

	var join_user=document.getElementById('join_user').value;
	var join_pass=document.getElementById('join_pass').value;
	var email=document.getElementById('email').value;

	var def= new Definicoes(1,0,5);

	var user= new User(join_user,join_pass,email,1,def);
	var res=createCookie(user);

	document.getElementById('join_user').value="";
	document.getElementById('join_pass').value="";
	document.getElementById('email').value="";
	if(res==1) {

		location.href = "../html/Main.html";
	}
}

function login(){

	var log_user=document.getElementById('log_user').value;
	var log_pass=document.getElementById('log_pass').value;

	document.getElementById('log_user').value="";
	document.getElementById('log_pass').value="";

	var res=checkLogin(log_user,log_pass);//verifica se o utilizador existe e no caso de existir, se a pass corresponde

	if(res==1)
		location.href="../html/Main.html";
}

function getCookie(username){
	var name = username + "=";
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



function checkLogin(username, pass) {
	var array;
	var name = getCookie(username);
	if (name != "nao existe") {
		array = name.split(",");
		if (array[0] == pass) {
			alert("Login com sucesso");
			return 1;
		}
		else {
			alert("Username ou password invalidos");
			return 0;
		}
	}
	else {
		alert("Username ou password invalidos");
		return 0;
	}
}


function imprime_cookies() {
	var c = document.cookie.split(';');
	for (let i = 0; i < c.length; i++) {
		console.log(c[i]);
	}
}


function createCookie(user){

	//verifica se o utilizador ja existe
	var valor=getCookie(user.nome);
	if(valor!="nao existe"){
		alert("Nome de utilizador ja existente!");
		return 0;
	}
	else {
		document.cookie = user.nome + "=" + user.ToString();
		alert('Conta criada!');
		return 1;

	}


}