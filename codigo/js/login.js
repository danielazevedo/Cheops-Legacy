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

		if(verify_email(email) == 0 || verify_data(join_user, join_pass) == 0) {
			alert("ccc");
				return;
		}
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
		//document.cookie = user.nome + "=" + user.ToString();
		alert('Conta criada!');

		return 1;

	}


}

function verify_data( join_user, join_pass ) {
	if( join_user.length > 20 || join_user.length == 0)
		return 0;
	if( join_user.charAt(0).equals(" ") || join_user.charAt( join_user.length - 1 ).equals( " " ) || join_user.charAt( join_user.getIndex( " " ) +1 ).equals( " " ) )
		return 0;
	if( !(6<join_pass.length < 20) )
		return 0;

	return 1;
}

function verify_email( email ) {
	var domains = [
		/* Default domains included */
		"aol.com", "att.net", "comcast.net", "facebook.com", "gmail.com", "gmx.com", "googlemail.com",
		"google.com", "hotmail.com", "hotmail.co.uk", "mac.com", "me.com", "mail.com", "msn.com",
		"live.com", "sbcglobal.net", "verizon.net", "yahoo.com", "yahoo.co.uk",

		/* Other global domains */
		"email.com", "games.com" /* AOL */, "gmx.net", "hush.com", "hushmail.com", "icloud.com", "inbox.com",
		"lavabit.com", "love.com" /* AOL */, "outlook.com", "pobox.com", "rocketmail.com" /* Yahoo */,
		"safe-mail.net", "wow.com" /* AOL */, "ygm.com" /* AOL */, "ymail.com" /* Yahoo */, "zoho.com", "fastmail.fm",
		"yandex.com",

		/* United States ISP domains */
		"bellsouth.net", "charter.net", "comcast.net", "cox.net", "earthlink.net", "juno.com",

		/* British ISP domains */
		"btinternet.com", "virginmedia.com", "blueyonder.co.uk", "freeserve.co.uk", "live.co.uk",
		"ntlworld.com", "o2.co.uk", "orange.net", "sky.com", "talktalk.co.uk", "tiscali.co.uk",
		"virgin.net", "wanadoo.co.uk", "bt.com",

		/* Domains used in Asia */
		"sina.com", "qq.com", "naver.com", "hanmail.net", "daum.net", "nate.com", "yahoo.co.jp", "yahoo.co.kr", "yahoo.co.id", "yahoo.co.in", "yahoo.com.sg", "yahoo.com.ph",

		/* French ISP domains */
		"hotmail.fr", "live.fr", "laposte.net", "yahoo.fr", "wanadoo.fr", "orange.fr", "gmx.fr", "sfr.fr", "neuf.fr", "free.fr",

		/* German ISP domains */
		"gmx.de", "hotmail.de", "live.de", "online.de", "t-online.de" /* T-Mobile */, "web.de", "yahoo.de",

		/* Russian ISP domains */
		"mail.ru", "rambler.ru", "yandex.ru", "ya.ru", "list.ru",

		/* Belgian ISP domains */
		"hotmail.be", "live.be", "skynet.be", "voo.be", "tvcablenet.be", "telenet.be",

		/* Argentinian ISP domains */
		"hotmail.com.ar", "live.com.ar", "yahoo.com.ar", "fibertel.com.ar", "speedy.com.ar", "arnet.com.ar",

		/* Domains used in Mexico */
		"hotmail.com", "gmail.com", "yahoo.com.mx", "live.com.mx", "yahoo.com", "hotmail.es", "live.com", "hotmail.com.mx", "prodigy.net.mx", "msn.com"
	];
	if( email.getIndex( "@" ) == -1 || email.getIndex( "@" ) >= ( email.length - 2 ) || email.getIndex( "@" ) != email.lastIndexOf( "@" ) )
		return 0;
	if( domains.getIndex( email.substr( email.getIndex( "@" ) ) ) == -1 )
		return 0;
	return 1;
}