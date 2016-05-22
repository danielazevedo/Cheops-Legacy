"use strict";


(function()
{
	window.addEventListener("load", main);
}());

const url_check_name = "http://159.203.118.149/serverside/user/check_name.php";
const url_register = "http://159.203.118.149/serverside/user/register.php";
const url_login = "http://159.203.118.149/serverside/user/login.php";

function main() {
	//playSound();
	var lbutton=document.getElementsByTagName('Button')[0];
	var jbutton=document.getElementsByTagName('Button')[1];


	lbutton.addEventListener("click", login);
	jbutton.addEventListener("click", join);
	
	var pass_sec = function() {
		var value = join_pass.value.length;
		if( value < 6 )
			join_pass.style.color = 'red';
		else if( value < 9 )
			join_pass.style.color = '#ff8000';
		else if( value < 12 )
			join_pass.style.color = '#ffbf00'; 
		else if( value < 15)
			join_pass.style.color = '#00ff40';
		else
			join_pass.style.color = 'green';
	}


	join_user.addEventListener('change', checkName);
	join_pass.addEventListener('input', pass_sec);

}


function join(){

	var join_user=document.getElementById('join_user').value;
	var join_pass=document.getElementById('join_pass').value;
	var email=document.getElementById('email').value;


	document.getElementById('join_user').value="";
	document.getElementById('join_pass').value="";
	document.getElementById('email').value="";


	if( verify_data( join_user, join_pass ) == 0)
		return;
	if ( verify_email( email ) == 0 ) {
		alert( 'Email invalido' );
		return;
	}


	var type = "register";

    var params = "name=" + join_user + "&email=" + email + "&password=" + join_pass;

    var registerHandler = function(ev) {
        if (ev.response["success"] == 1) {

            alert("registado com sucesso");
            //	updateSound();
            sessionStorage.type = "user";
            sessionStorage.name = join_user;
            sessionStorage.password = join_pass;
            sessionStorage.email = email;
            sessionStorage.nivel = 1;
            sessionStorage.Musica = 1;
            sessionStorage.teclas = 1;
            sessionStorage.Volume_musica = 1;
            sessionStorage.vidas = 3;
            sessionStorage.freezer = 0;
            sessionStorage.speeder = 0;
            sessionStorage.killer = 0;
            location.href = "../html/Main.html";
        } else {
            alert("Problemas no registo");
        }
    }
    
    document.addEventListener(type, registerHandler);
    sendData(params, url_register, type);


}


function login(ev){
	ev.preventDefault()
	var log_user=document.getElementById('log_user').value;
	var log_pass=document.getElementById('log_pass').value;


	var type = "login";
	var params = "name=" + log_user + "&password=" + log_pass;
	var loginHandler = function(ev) {
        document.removeEventListener(type, loginHandler);
    
        document.getElementById('log_user').value="";
		document.getElementById('log_pass').value="";

        if (ev.response["success"] == 1) {
            sessionStorage.type = "user";
            sessionStorage.name = ev.response["Nome"];
            sessionStorage.password = ev.response["Password"];
            sessionStorage.email = ev.response["Email"];
            sessionStorage.nivel = ev.response["nivel"];
            sessionStorage.Musica = ev.response["Musica"];
            sessionStorage.teclas = ev.response["Teclas"];
            sessionStorage.Volume_musica = ev.response["Volume"];
            sessionStorage.vidas = ev.response["vidas"];
            sessionStorage.freezer = ev.response["freezer"];
            sessionStorage.speeder = ev.response["speeder"];
            sessionStorage.killer = ev.response["killer"];
            alert("Login feito com sucesso");
	   		updateSound();
            location.href = "../html/Main.html";

            console.log(sessionStorage.name, sessionStorage.password, sessionStorage.email, sessionStorage.nivel, sessionStorage.Musica, sessionStorage.teclas, sessionStorage.Volume_musica,
            	sessionStorage.vidas, sessionStorage.freezer, sessionStorage.speeder, sessionStorage.killer);
            
            
        } else {
        	alert("Username ou Password inválidos");
            console.log("erro");
        }
    }
    document.addEventListener(type, loginHandler);
    sendData(params, url_login, type);

}
function checkName(ev) {
    var name = ev.target.value;
    
    
    var type = "checkName";
    var params = "name=" + name;

    if( name.length > 0) {

    var cnh = function(ev) {
        document.removeEventListener(type, cnh);
        console.log(ev.response);
        if (ev.response["success"] == 1) {
            alert("Username ja usado");
        } else {
            
            alert("Username Válido");
        }
    }
    document.addEventListener(type, cnh);
    sendData(params, url_check_name, type);
	}

}


function verify_data( join_user, join_pass ) {

	if( join_user.length == 0 || join_pass.length == 0 ) {
		alert( 'Preencha todos os dados' );
		return 0;
	}
	if( join_user.charAt(0)==" " || join_user.charAt( join_user.length - 1 ) == " " || join_user.charAt( join_user.indexOf( " " ) +1 ) == ' ' ) {
		alert( 'Tenha em atenção o uso de espaços' );
		return 0;
	}
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

	];
	
	if( domains.indexOf( email.substr( email.indexOf( "@" )+1 ) ) == -1 )
		return 0;
	return 1;
}


function sendData(data, url, type) {
    var XHR = new XMLHttpRequest();
    XHR.onreadystatechange = function() {
        if (XHR.readyState === 4 && XHR.status === 200) {
            var response = XHR.response;
            var ev = new Event(type);
            ev.response = response;
            document.dispatchEvent(ev);
        }
    }
    XHR.open('POST', url, true);
    XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
    XHR.setRequestHeader("Access-Control-Allow-Origin", "*");
    XHR.setRequestHeader("Access-Control-Allow-Credentials", "true");
    XHR.responseType = "json";
    XHR.send(data);
}
