
"use strict";

(function()
{
    //automatically called as soon as the javascript is loaded
    window.addEventListener("load", main);
}());

var countUp = 0, countLeft = 0, countRight = 0, countDown = 0;


function carregaImagens(){
	var nLoad=0;
	var totLoad=72;
	var imagensJogador=new Array([], [], [], []);
	var imagensSoldados=new Array ([], [], [], []);
    var elementos= new Array ([],[],[],[]);
    for (let i=0; i<4; i++){
        var img=new Image();
        img.addEventListener("load", imgLoadedHandlerJogador);
        img.id="el";
        elementos[i].push(img);
    }
    elementos[0][0].src = "../imagens/heal.png";
    elementos[1][0].src = "../imagens/runner.png";
    elementos[2][0].src = "../imagens/stop_time.png";
    elementos[3][0].src = "../imagens/remove.png";
	for(let i=0; i<9;i++){
		
		var img = new Image();
		img.addEventListener("load", imgLoadedHandlerJogador);
		img.id = "sup";
		img.src = "../imagens/soldado/up/up" + i + ".png";

		var img = new Image();
		img.addEventListener("load", imgLoadedHandlerJogador);
		img.id = "sright";
		img.src = "../imagens/soldado/right/right" + i + ".png";


		var img = new Image();
		img.addEventListener("load", imgLoadedHandlerJogador);
		img.id = "sleft";
		img.src = "../imagens/soldado/left/left" + i + ".png";


		var img = new Image();
		img.addEventListener("load", imgLoadedHandlerJogador);
		img.id = "sdown";
		img.src = "../imagens/soldado/down/down" + i + ".png";

        var img = new Image();
        img.addEventListener("load", imgLoadedHandlerJogador);
        img.id = "jup";
        img.src = "../imagens/jogador/up/up" + i + ".png";

        var img = new Image();
        img.addEventListener("load", imgLoadedHandlerJogador);
        img.id = "jright";
        img.src = "../imagens/jogador/right/right" + i + ".png";


        var img = new Image();
        img.addEventListener("load", imgLoadedHandlerJogador);
        img.id = "jleft";
        img.src = "../imagens/jogador/left/left" + i + ".png";


        var img = new Image();
        img.addEventListener("load", imgLoadedHandlerJogador);
        img.id = "jdown";
        img.src = "../imagens/jogador/down/down" + i + ".png";

	}

	function imgLoadedHandlerJogador(ev){

		var img = ev.target;
		switch(img.id){
			case "sup":
				imagensSoldados[0].push(img);
				break;
			case "sright":
				imagensSoldados[1].push(img);
				break;

			case "sleft":
				imagensSoldados[2].push(img);
				break;

			case "sdown":
				imagensSoldados[3].push(img);
				break;

            case "jup":
                imagensJogador[0].push(img);
                break;

            case "jright":
                imagensJogador[1].push(img);
                break;

            case "jleft":
                imagensJogador[2].push(img);
                break;

            case "jdown":
                imagensJogador[3].push(img);
                break;
		}
		nLoad++;
		if (nLoad == totLoad)
		{
			var ev2 = new Event("initend");
			ev2.imagensSoldados=imagensSoldados;
			ev2.imagensJogador=imagensJogador;
            ev2.elementos=elementos;
			window.dispatchEvent(ev2);
		}
		
	}
}

function main() {

    carregaImagens();
    var imagens;
    var imagensJogador;
    var elementos;
    window.addEventListener("initend", initEndHandler);
    function initEndHandler(ev)
    {
        imagens=ev.imagensSoldados;
        imagensJogador=ev.imagensJogador;
        elementos=ev.elementos;
        //iniciar a animação
        selectSound(sessionStorage.nivel_atual);
        stuffAfterMain(imagens, imagensJogador, elementos);
    }

}

function stuffAfterMain(imagens, imagensJogador, elementos){
    var c = document.getElementById("Canvas");
    var ctx = c.getContext("2d");

    var cJogador = document.getElementById("jogadorCanvas");
    var ctxJogador = cJogador.getContext("2d");

    var cSoldados = document.getElementById("soldadosCanvas");
    var ctxSoldados = cSoldados.getContext("2d");


    c.width = window.innerWidth;
  	c.height = window.innerHeight;

    console.log(window.innerWidth, window.innerHeight);
    var soldado_width = Math.ceil(c.width/31), soldado_height = Math.ceil(c.height/17);//dimensoes do quadrado que representa o soldado


    elementos[0][1] = soldado_width*20, elementos[0][2] = soldado_height*15;
    elementos[1][1] = soldado_width*21, elementos[1][2] = soldado_height*15;
    elementos[2][1] = soldado_width*22, elementos[2][2] = soldado_height*15;
    elementos[3][1] = soldado_width*23, elementos[3][2] = soldado_height*15;

    var nivelMax = sessionStorage.nivel;
    var n_vidas = sessionStorage.vidas;
    var nivel = sessionStorage.nivel_atual;

    nivel = parseInt(nivel);
    n_vidas = parseInt(n_vidas);
    console.log(nivel, n_vidas);

    if(nivel != 1){
        var div = document.getElementById("helper");
        var text = document.getElementById("text_helper");
        div.style.display = 'none';
        text.style.display = 'none';
    }
    else{
        var text = document.getElementById("text_helper");
        text.innerHTML = 'Usando as teclas, desloque a sua personagem. Recolha os items se quiser saber a sua funcao';
    }

    document.getElementById("n_vidas").innerHTML = n_vidas;
    document.body.style.background = "url(../imagens/bg_nivel"+nivel+".png) no-repeat center center fixed";
    document.body.style.backgroundSize = "100% 100%";

    
    var posicoes_inicio= [[2*soldado_width, 5*soldado_height],[2*soldado_width, 4*soldado_height],[29*soldado_width, 5*soldado_height], 
    					[0, 8*soldado_height], [29*soldado_width, 5*soldado_height], [29*soldado_width, 5*soldado_height], 
    					[0, 10*soldado_height], [0, 2*soldado_height], [0, 5*soldado_height],[0, 5*soldado_height] ];


    var dados_niveis = carregaCenarios(soldado_width, soldado_height, elementos, ctx);
    //array de cenarios
    var cenarios = dados_niveis[0];
    //array de filas
    var filas_niveis = dados_niveis[1];




    //posicao do jogador
    var pos_x = posicoes_inicio[nivel-1][0];
    var pos_y = posicoes_inicio[nivel-1][1];
    var cenario = cenarios[nivel-1];
    var mapa_x = cenario.mapa[0].length, mapa_y = cenario.mapa.length;//dimensoes dom mapa

    init(ctx, mapa_x, mapa_y, soldado_width, soldado_height, filas_niveis[nivel-1], ctxSoldados, ctxJogador, cenario, pos_x, pos_y, imagens, n_vidas, elementos, ctx, imagensJogador)

}

function init(ctx, mapa_x, mapa_y, soldado_width, soldado_height, filas, ctxSoldados, ctxJogador, cenario, pos_x, pos_y, imagens, n_vidas,elementos, ctxBack, imagensJogador){

	console.log(sessionStorage.vidas, sessionStorage.freezer, sessionStorage.speeder, sessionStorage.killer);

    //inicializar o jogador
    var jogador = new Jogador(pos_x, pos_y, n_vidas, "teste", 0);

    //inicializar o jogo
    cenario.iniciaCenario(ctx,mapa_x, mapa_y, soldado_width, soldado_height, filas, jogador, ctxSoldados,elementos,ctxJogador,imagens, imagensJogador);

    var count = 0;
    document.getElementById("time").innerHTML = "3:0s";

    document.getElementById("tempo_fila").innerHTML="5s";
    //inicializar o jogador
    var img = new Image();
    if(cenario.nivel == 3 || cenario.nivel == 6 || cenario.nivel==5)
        img.src = "../imagens/jogador/left/left0.png";
    else{
        img.src = "../imagens/jogador/right/right0.png";
    }
    img.onload = function () {
        jogador.draw(ctxJogador, soldado_width, soldado_height, img);
    }

    var flag = 0;
    //var pressed = false;
    document.onkeydown = function (ev) {
       	
      	
        if(ev.keyCode==37 || ev.keyCode==38 ||ev.keyCode==39 ||ev.keyCode==40) {
            if (flag == 0) {
                startCrono(jogador, count, cenario.nivel);
                flag = 1;
            }
            jogador.key = ev.keyCode;
        }
       
      	else if(ev.keyCode == 86)//v->vidas
      	{
      		if(sessionStorage.vidas <5){
				jogador.n_vidas++;
	      		sessionStorage.vidas = parseInt(sessionStorage.vidas) + 1;
	      		ctx.clearRect(elementos[0][1], elementos[0][2], soldado_width, soldado_height);
	      		document.getElementById("n_vidas").innerHTML= jogador.n_vidas;
        	//update
        }
      	}
      	else if(ev.keyCode == 66)//b->velocidade filas
      	{
      		if(sessionStorage.speeder == 1){
	      		cenario.velocidade=+40;
	      		sessionStorage.speeder=0;
	      	}
	      		ctx.clearRect(elementos[1][1], elementos[1][2], soldado_width, soldado_height);
      	}
      	else if(ev.keyCode == 78){//n->congela o tempo
      		if(sessionStorage.freezer == 1){
	      		stopCrono(tID,jogador, (jogador.tempo.segundos+ jogador.tempo.minutos*60));
	      		sessionStorage.freezer=0;
	      		ctx.clearRect(elementos[2][1], elementos[2][2], soldado_width, soldado_height);
	      	}
      	}

      	else if(ev.keyCode == 77){//m->remove elementos das filas
	      		if(sessionStorage.killer == 1){
	      		sessionStorage.killer=0;
	      		for(var i=0; i<filas.length;i++){
	            	filas[i].elimina_ultimo(ctxSoldados, soldado_width, soldado_height);
	            	filas[i].tamanho--;
	        	}
        		ctx.clearRect(elementos[3][1], elementos[3][2], soldado_width, soldado_height);
        	}
    	}
    };

}



function verifica_colisoes(x,y,filas){
    for(var j=0; j<filas.length;j++) {
        var fila = filas[j];
        for (var i = 0; i < fila.tamanho; i++) {
            if (fila.soldados[mod(fila.primeira_posicao - i, fila.soldados.length)].x == x && fila.soldados[mod(fila.primeira_posicao - i, fila.soldados.length)].y == y) {
                return 1;
            }
        }

    }

    return 0;
}

function verifica_posicao(jogador,x,y,filas,  soldado_width,soldado_height, ctxSoldados, cenario, ctxJogador, elementos, ctxBack) {
    var mapa = cenario.mapa;
    if (y < 0 || x < 0 || y>mapa.length*soldado_height || x>mapa[0].length*soldado_width) {
        return 0;
    } else if (mapa[y / soldado_height][x / soldado_width] == 0){
        return 0;
    }
    else if(mapa[y/soldado_height][x/soldado_width] == 2){
        console.log("NIVEL COMPLETO");
        jogador.nextLevel(cenario.nivel, jogador.tempo);
        jogador.estado=1;
    }
    else if(mapa[y/soldado_height][x/soldado_width] == 3){
        console.log("vida");
        sessionStorage.vidas = parseInt(sessionStorage.vidas) + 1;
 		
        ctxBack.clearRect(x,y,soldado_width, soldado_height);
        ctxBack.drawImage(elementos[0][0], elementos[0][1], elementos[0][2], soldado_width, soldado_height);
        

	        if(cenario.nivel == 1){
        
            document.getElementById("text_helper").innerHTML="Item que permite ganhar mais 1 vida, para a adquirir pressione a tecla V";
        }

    }

    else if(mapa[y/soldado_height][x/soldado_width] == 4){
        console.log("diminui velocidade filas");
        sessionStorage.speeder=1;
        mapa[y/soldado_height][x/soldado_width] = 1;
        ctxBack.clearRect(x,y,soldado_width, soldado_height);
        ctxBack.drawImage(elementos[1][0], elementos[1][1], elementos[1][2], soldado_width, soldado_height);
        if(cenario.nivel == 1){
            document.getElementById("text_helper").innerHTML="Item que diminui a velocidade das filas, para a adquirir pressione a tecla B";
        }
    }

    else if(mapa[y/soldado_height][x/soldado_width] == 5){
        console.log("parar o tempo");
        sessionStorage.freezer=1;
        mapa[y/soldado_height][x/soldado_width] = 1;
        ctxBack.clearRect(x,y,soldado_width, soldado_height);
        ctxBack.drawImage(elementos[2][0], elementos[2][1], elementos[2][2], soldado_width, soldado_height);
        if(cenario.nivel == 1){
            document.getElementById("text_helper").innerHTML="Item que congela os tempo 5 segundos, para adquirir pressiona a tecla N";
        }
    }
    else if(mapa[y/soldado_height][x/soldado_width] == 6){
        console.log("remove elementos das filas");
        sessionStorage.killer=1;
        mapa[y/soldado_height][x/soldado_width] = 1;
        ctxBack.clearRect(x,y,soldado_width, soldado_height);
        ctxBack.drawImage(elementos[3][0], elementos[3][1], elementos[3][2], soldado_width, soldado_height);
        if(cenario.nivel == 1){
            document.getElementById("text_helper").innerHTML="Item que diminui o numero de soldados nas filas uma unidade, para utilizar este item pressione a tecla M";
        }

    }

    if(verifica_colisoes(x, y, filas) != 0)
        return  2;

    for(let i=0;i<filas.length;i++) {

        var fila= filas[i];
        var last_mais1 = mod(fila.primeira_posicao - fila.tamanho, fila.soldados.length);

        if (fila.soldados[last_mais1].x == x && fila.soldados[last_mais1].y == y) {
        	fila.presenca_jogador=true;
            console.log("entrou");
            if (jogador.estado == 0)
                fila.tamanho++;
            document.getElementById("tempo_fila").innerHTML="5s";
            jogador.tempo_fora=5;
            jogador.estado = 1;
            jogador.n_fila = i;
        }

    }
    return 1;
}

function  mod(n, m) {
    return ((n % m) + m) % m;
}


function carregaCenarios(soldado_width, soldado_height, elementos, ctx){
    var cenarios = [];
    var array_filas = [];
    var health = 3;
    var slower = 4;
    var freezer = 5;
    var remover = 6;
    var bool = 'false';

    //NIVEL 1
    var mapa = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 1, 1, 1, icon_verifier(remover,ctx, elementos, soldado_width, soldado_height), 1, 1, 1, 0, 1, 1, icon_verifier(health,ctx, elementos, soldado_width, soldado_height), 1, 0, 0, 0, 1, icon_verifier(slower,ctx, elementos, soldado_width, soldado_height), 1, 1, 1, 1, 1, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
                [0, icon_verifier(freezer,ctx, elementos, soldado_width, soldado_height), 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ];

    var filas = [];
    var velocidade=10;
    var tamanho = 10;
    var fila=[[tamanho,0]];
    var pos_x = soldado_width*4;
    var pos_y = soldado_height*13;

    [pos_x, pos_y] = left_right(7,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(9,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(7,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(9,soldado_height,pos_x, pos_y,fila);
    filas.push(fila);    


    tamanho = 10;
    fila=[[tamanho,0]];
    pos_x = soldado_width*19;
    pos_y = soldado_height*13;

    [pos_x, pos_y] = right_left(7,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(9,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = left_right(7,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(9,soldado_height,pos_x, pos_y,fila);
    filas.push(fila);    


    cenarios.push(new Cenario(velocidade,1,mapa));
    array_filas.push(filas);

    //NIVEL 2
    mapa = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, icon_verifier(health,ctx, elementos, soldado_width, soldado_height), 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, icon_verifier(freezer,ctx, elementos, soldado_width, soldado_height), 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];

    filas =[];
    tamanho = 18;
    velocidade = 20;

    fila=[[tamanho,0]];
    pos_x = soldado_width*8;
    pos_y = soldado_height*8;
    [pos_x, pos_y] = up_down(5,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(5,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(5,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = left_right(5,soldado_width,pos_x, pos_y,fila);
    filas.push(fila);

    tamanho = 25;
    fila=[[tamanho,0]];
    pos_x = soldado_width*16;
    pos_y = soldado_height*4;
    [pos_x, pos_y] = up_down(3,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(11,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(3,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = left_right(11,soldado_width,pos_x, pos_y,fila);
    filas.push(fila);

    tamanho = 7;
    fila=[[tamanho,0]];
    pos_x = soldado_width*20;
   pos_y = soldado_height*8;
    [pos_x, pos_y] = up_down(3,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = left_right(5,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(3,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(5,soldado_width,pos_x, pos_y,fila);
    filas.push(fila);



    cenarios.push(new Cenario(velocidade,2,mapa));
    array_filas.push(filas);

//NIVEL 3
    velocidade = 10;
    mapa = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [2, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, icon_verifier(remover,ctx, elementos, soldado_width, soldado_height), 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, icon_verifier(slower,ctx, elementos, soldado_width, soldado_height), 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    filas = [];
    tamanho = 10;
    var fila=[[tamanho,0]];
    pos_x = soldado_width*8;
    pos_y = soldado_height*13;

    [pos_x, pos_y] = left_right(17,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(1,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(17,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(1,soldado_height,pos_x, pos_y,fila);
    filas.push(fila);


    var fila=[[tamanho,0]];
    pos_x = soldado_width*10;
    pos_y = soldado_height*3;

    [pos_x, pos_y] = left_right(17,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(1,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(17,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(1,soldado_height,pos_x, pos_y,fila);
    filas.push(fila);

    tamanho = 28;
    var fila=[[tamanho,0]];
    pos_x = soldado_width*10;
    pos_y = soldado_height*6;

    [pos_x, pos_y] = right_left(4,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(2,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(3,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(2,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(2,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(5,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = left_right(9,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(5,soldado_height,pos_x, pos_y,fila);
    filas.push(fila);

    cenarios.push(new Cenario(velocidade,3,mapa));
    array_filas.push(filas);


//NIVEL 4
   
    mapa = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0],
        [0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, icon_verifier(freezer,ctx, elementos, soldado_width, soldado_height), 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, icon_verifier(slower,ctx, elementos, soldado_width, soldado_height), 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

   
    velocidade=10;
    filas = [];
    tamanho = 7;
    fila=[[tamanho,0]];
    pos_x = soldado_width*7;
    pos_y = soldado_height*14;

    
    [pos_x, pos_y] = down_up(4,soldado_height,pos_x, pos_y,fila);
    pos_y-=240;
   [pos_x, pos_y] = down_up(5,soldado_height,pos_x, pos_y,fila);
   pos_y-=60;
   [pos_x, pos_y] = down_up(1,soldado_height,pos_x, pos_y,fila);

    filas.push(fila);


    tamanho = 7;
    fila=[[tamanho,0]];
    pos_x = soldado_width*8;
    pos_y = soldado_height*14;

    
    [pos_x, pos_y] = down_up(4,soldado_height,pos_x, pos_y,fila);
    pos_y-=240;
   [pos_x, pos_y] = down_up(5,soldado_height,pos_x, pos_y,fila);
   pos_y-=60;
   [pos_x, pos_y] = down_up(1,soldado_height,pos_x, pos_y,fila);

    filas.push(fila);


    tamanho = 7;
    fila=[[tamanho,0]];
    pos_x = soldado_width*15;
    pos_y = soldado_height*11;

    
    [pos_x, pos_y] = right_left(5,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(4,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = left_right(5,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(4,soldado_height,pos_x, pos_y,fila);

    filas.push(fila);


    tamanho = 7;
    fila=[[tamanho,0]];
    pos_x = soldado_width*15;
    pos_y = soldado_height*2;

    
    [pos_x, pos_y] = right_left(5,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(4,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = left_right(5,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(4,soldado_height,pos_x, pos_y,fila);

    filas.push(fila);


    tamanho = 7;
    fila=[[tamanho,0]];
    pos_x = soldado_width*21;
    pos_y = soldado_height*9;

    
    [pos_x, pos_y] = right_left(3,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(5,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = left_right(3,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(5,soldado_height,pos_x, pos_y,fila);

    filas.push(fila);


    tamanho = 7;
    fila=[[tamanho,0]];
    pos_x = soldado_width*22;
    pos_y = soldado_height*9;

    
    [pos_x, pos_y] = left_right(3,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(5,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(3,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(5,soldado_height,pos_x, pos_y,fila);

    filas.push(fila);




    cenarios.push(new Cenario(velocidade,4,mapa));
    array_filas.push(filas);



    //NIVEL 5

 mapa = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 0, 0, icon_verifier(health,ctx, elementos, soldado_width, soldado_height), 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, icon_verifier(freezer,ctx, elementos, soldado_width, soldado_height), 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    velocidade=10;
    filas = [];
    tamanho = 15;
    fila=[[tamanho,0]];
    pos_x = soldado_width*3;
    pos_y = soldado_height*13;

    [pos_x, pos_y] = left_right(4,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(5,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(4,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(5,soldado_height,pos_x, pos_y,fila);
    filas.push(fila);

    tamanho = 5;
    fila=[[tamanho,0]];
    pos_x = soldado_width*24;
    pos_y = soldado_height*8;

    
    [pos_x, pos_y] = right_left(4,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(5,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = left_right(5,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(7,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(1,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(2,soldado_height,pos_x, pos_y,fila);
    filas.push(fila);


    tamanho = 21;
    fila=[[tamanho,0]];
    pos_x = soldado_width*16;
    pos_y = soldado_height*13;

	[pos_x, pos_y] = right_left(8,soldado_width,pos_x, pos_y,fila);
	[pos_x, pos_y] = down_up(9,soldado_height,pos_x, pos_y,fila);
	[pos_x, pos_y] = left_right(8,soldado_width,pos_x, pos_y,fila);
	[pos_x, pos_y] = up_down(9,soldado_height,pos_x, pos_y,fila);
	filas.push(fila);


	tamanho = 7;
    fila=[[tamanho,0]];
    pos_x = soldado_width*26;
    pos_y = soldado_height*5;

     [pos_x, pos_y] = right_left(4,soldado_width,pos_x, pos_y,fila);
     [pos_x, pos_y] = down_up(2,soldado_height,pos_x, pos_y,fila);
     [pos_x, pos_y] = left_right(4,soldado_width,pos_x, pos_y,fila);
     [pos_x, pos_y] = up_down(2,soldado_height,pos_x, pos_y,fila);


     filas.push(fila);


    cenarios.push(new Cenario(velocidade,5,mapa));
    array_filas.push(filas);



	//NIVEL 6
      mapa = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, icon_verifier(remover,ctx, elementos, soldado_width, soldado_height), 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, icon_verifier(health,ctx, elementos, soldado_width, soldado_height), 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    velocidade=7;
    filas = [];
    tamanho = 8;
    fila=[[tamanho,0]];
    pos_x = soldado_width*3;
    pos_y = soldado_height*13;

    [pos_x, pos_y] = left_right(4,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(5,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(4,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(5,soldado_height,pos_x, pos_y,fila);
    filas.push(fila);

    tamanho = 15;
    fila=[[tamanho,0]];
    pos_x = soldado_width*12;
    pos_y = soldado_height*8;

    [pos_x, pos_y] = right_left(4,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(5,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = left_right(4,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(5,soldado_height,pos_x, pos_y,fila);
    filas.push(fila);

    tamanho = 20;
    fila=[[tamanho,0]];
    pos_x = soldado_width*27;
    pos_y = soldado_height*4;

    
    [pos_x, pos_y] = right_left(5,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(2,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = left_right(2,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(5,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(2,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(2,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = left_right(6,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(9,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(1,soldado_width,pos_x, pos_y,fila);
    filas.push(fila);


    tamanho = 10;
    fila=[[tamanho,0]];
    pos_x = soldado_width*21;
    pos_y = soldado_height*6;

     [pos_x, pos_y] = right_left(13,soldado_width,pos_x, pos_y,fila);
     [pos_x, pos_y] = down_up(3,soldado_height,pos_x, pos_y,fila);
     [pos_x, pos_y] = left_right(13,soldado_width,pos_x, pos_y,fila);
     [pos_x, pos_y] = up_down(3,soldado_height,pos_x, pos_y,fila);
     filas.push(fila);

    cenarios.push(new Cenario(velocidade,6,mapa));
    array_filas.push(filas);


      //NIVEL 7
    mapa = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 2, 2, 1, icon_verifier(slower,ctx, elementos, soldado_width, soldado_height), 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 2, 2, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    velocidade=10;
    filas = [];
    tamanho = 3;
    fila=[[tamanho,0]];
    pos_x = soldado_width*14;
    pos_y = soldado_height*13;

    [pos_x, pos_y] = right_left(3,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(1,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = left_right(3,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(1,soldado_height,pos_x, pos_y,fila);

     filas.push(fila);

    tamanho = 3;
    fila=[[tamanho,0]];
    pos_x = soldado_width*15;
    pos_y = soldado_height*13;

    [pos_x, pos_y] = left_right(3,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(1,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(3,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(1,soldado_height,pos_x, pos_y,fila);

    filas.push(fila);

	tamanho = 3;
    fila=[[tamanho,0]];
    pos_x = soldado_width*22;
    pos_y = soldado_height*13;

	[pos_x, pos_y] = right_left(3,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(1,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = left_right(3,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(1,soldado_height,pos_x, pos_y,fila);

	filas.push(fila);

	tamanho = 3;
    fila=[[tamanho,0]];
    pos_x = soldado_width*23;
    pos_y = soldado_height*13;

    [pos_x, pos_y] = left_right(3,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(1,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(3,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(1,soldado_height,pos_x, pos_y,fila);

     filas.push(fila);


     //cima

     tamanho = 3;
    fila=[[tamanho,0]];
    pos_x = soldado_width*14;
    pos_y = soldado_height*4;

    [pos_x, pos_y] = right_left(3,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(2,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = left_right(3,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(2,soldado_height,pos_x, pos_y,fila);

     filas.push(fila);

    tamanho = 3;
    fila=[[tamanho,0]];
    pos_x = soldado_width*15;
    pos_y = soldado_height*4;

    [pos_x, pos_y] = left_right(3,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(2,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(3,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(2,soldado_height,pos_x, pos_y,fila);

    filas.push(fila);

	tamanho = 3;
    fila=[[tamanho,0]];
    pos_x = soldado_width*22;
    pos_y = soldado_height*4;

	[pos_x, pos_y] = right_left(3,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(2,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = left_right(3,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(2,soldado_height,pos_x, pos_y,fila);

	filas.push(fila);

	tamanho = 3;
    fila=[[tamanho,0]];
    pos_x = soldado_width*23;
    pos_y = soldado_height*4;

    [pos_x, pos_y] = left_right(3,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(2,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(3,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(2,soldado_height,pos_x, pos_y,fila);

     filas.push(fila);

     tamanho = 15;
    fila=[[tamanho,0]];
    pos_x = soldado_width*24;
    pos_y = soldado_height*11;

    [pos_x, pos_y] = left_right(3,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(6,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(3,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(6,soldado_height,pos_x, pos_y,fila);

     filas.push(fila);


     tamanho = 16;
    fila=[[tamanho,0]];
    pos_x = soldado_width*2;
    pos_y = soldado_height*8;

    [pos_x, pos_y] = left_right(5,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(5,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(5,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(5,soldado_height,pos_x, pos_y,fila);

     filas.push(fila);

     tamanho = 9;
    fila=[[tamanho,0]];
    pos_x = soldado_width*3;
    pos_y = soldado_height*7;

    [pos_x, pos_y] = left_right(3,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(3,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(3,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(3,soldado_height,pos_x, pos_y,fila);

     filas.push(fila);

      tamanho = 3;
    fila=[[tamanho,0]];
    pos_x = soldado_width;
    pos_y = soldado_height*12;

    [pos_x, pos_y] = left_right(2,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(2,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(2,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(2,soldado_height,pos_x, pos_y,fila);

     filas.push(fila);

    
    tamanho = 3;
    fila=[[tamanho,0]];
    pos_x = soldado_width*6;
    pos_y = soldado_height*12;

    [pos_x, pos_y] = right_left(2,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(2,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = left_right(2,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(2,soldado_height,pos_x, pos_y,fila);

     filas.push(fila);




    cenarios.push(new Cenario(velocidade,7,mapa));
    array_filas.push(filas);

//NIVEL 8
    mapa = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    velocidade=10;
    filas = [];
    tamanho = 8;
    fila=[[tamanho,0]];
    pos_x = soldado_width*12;
    pos_y = soldado_height*9;

    [pos_x, pos_y] = left_right(6,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(4,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(6,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(4,soldado_height,pos_x, pos_y,fila);

    filas.push(fila);

    tamanho=18;
    fila=[[tamanho,0]];
    pos_x = soldado_width*11;
    pos_y = soldado_height*10;

    [pos_x, pos_y] = left_right(8,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(6,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(8,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(6,soldado_height,pos_x, pos_y,fila);

    filas.push(fila);


    tamanho=25;
    fila=[[tamanho,0]];
    pos_x = soldado_width*10;
    pos_y = soldado_height*11;

    [pos_x, pos_y] = left_right(10,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(8,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(10,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(8,soldado_height,pos_x, pos_y,fila);

    filas.push(fila);

     tamanho=30;
    fila=[[tamanho,0]];
    pos_x = soldado_width*9;
    pos_y = soldado_height*12;

    [pos_x, pos_y] = left_right(12,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(10,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(12,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(10,soldado_height,pos_x, pos_y,fila);

    filas.push(fila);


     tamanho=8;
    fila=[[tamanho,0]];
    pos_x = soldado_width*2;
    pos_y = soldado_height*13;

    [pos_x, pos_y] = left_right(1,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(11,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(1,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(11,soldado_height,pos_x, pos_y,fila);


    filas.push(fila);



     tamanho=8;
    fila=[[tamanho,0]];
    pos_x = soldado_width*4;
    pos_y = soldado_height*13;

    [pos_x, pos_y] = left_right(1,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(11,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(1,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(11,soldado_height,pos_x, pos_y,fila);


    filas.push(fila);


     tamanho=8;
    fila=[[tamanho,0]];
    pos_x = soldado_width*6;
    pos_y = soldado_height*13;

    [pos_x, pos_y] = left_right(1,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(11,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(1,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(11,soldado_height,pos_x, pos_y,fila);

    filas.push(fila);



	cenarios.push(new Cenario(velocidade,8,mapa));
    array_filas.push(filas);

    //NIVEL 9
    mapa = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, icon_verifier(remover,ctx, elementos, soldado_width, soldado_height), 1, 1, 1, 1, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, icon_verifier(health,ctx, elementos, soldado_width, soldado_height), 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];


    velocidade=5;
    filas = [];
    tamanho = 20;
    fila=[[tamanho,0]];
    pos_x = soldado_width*2;
    pos_y = soldado_height*13;

    [pos_x, pos_y] = left_right(1,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(11,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(1,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(11,soldado_height,pos_x, pos_y,fila);

    filas.push(fila);


    tamanho = 10;
    fila=[[tamanho,0]];
    pos_x = soldado_width*6;
    pos_y = soldado_height*13;

    [pos_x, pos_y] = right_left(1,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(11,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = left_right(1,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(11,soldado_height,pos_x, pos_y,fila);

    filas.push(fila);


    tamanho = 20;
    fila=[[tamanho,0]];
    pos_x = soldado_width*7;
    pos_y = soldado_height*13;

    [pos_x, pos_y] = left_right(1,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(11,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(1,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(11,soldado_height,pos_x, pos_y,fila);

    filas.push(fila);


    tamanho = 10;
    fila=[[tamanho,0]];
    pos_x = soldado_width*11;
    pos_y = soldado_height*13;

    [pos_x, pos_y] = right_left(1,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(5,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = left_right(1,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(5,soldado_height,pos_x, pos_y,fila);

    filas.push(fila);



    tamanho = 10;
    fila=[[tamanho,0]];
    pos_x = soldado_width*11;
    pos_y = soldado_height*7;

    [pos_x, pos_y] = right_left(1,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(5,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = left_right(1,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(5,soldado_height,pos_x, pos_y,fila);

    filas.push(fila);



    tamanho = 10;
    fila=[[tamanho,0]];
    pos_x = soldado_width*14;
    pos_y = soldado_height*12;

    [pos_x, pos_y] = right_left(1,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(5,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = left_right(1,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(5,soldado_height,pos_x, pos_y,fila);

    filas.push(fila);



    tamanho = 5;
    fila=[[tamanho,0]];
    pos_x = soldado_width*14;
    pos_y = soldado_height*6;

    [pos_x, pos_y] = right_left(1,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(4,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = left_right(1,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(4,soldado_height,pos_x, pos_y,fila);

    filas.push(fila);

	
	cenarios.push(new Cenario(velocidade,9,mapa));
    array_filas.push(filas);


    //NIVEL 10
    mapa = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    velocidade=1;
    filas = [];
    tamanho = 5;
    fila=[[tamanho,0]];
    pos_x = soldado_width*6;
    pos_y = soldado_height*5;


    [pos_x, pos_y] = right_left(3,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(2,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = left_right(3,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(2,soldado_height,pos_x, pos_y,fila);

    filas.push(fila);


    velocidade=7;
    tamanho = 5;
    fila=[[tamanho,0]];
    pos_x = soldado_width*3;
    pos_y = soldado_height*8;


    [pos_x, pos_y] = left_right(3,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(2,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(3,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(2,soldado_height,pos_x, pos_y,fila);

    filas.push(fila);

    tamanho = 5;
    fila=[[tamanho,0]];
    pos_x = soldado_width*3;
    pos_y = soldado_height*13;


    [pos_x, pos_y] = left_right(2,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(4,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(2,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(4,soldado_height,pos_x, pos_y,fila);

    filas.push(fila);


    tamanho = 5;
    fila=[[tamanho,0]];
    pos_x = soldado_width*6;
    pos_y = soldado_height*13;


    [pos_x, pos_y] = left_right(2,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(4,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(2,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(4,soldado_height,pos_x, pos_y,fila);

    
filas.push(fila);

        tamanho = 5;
    fila=[[tamanho,0]];
    pos_x = soldado_width*8;
    pos_y = soldado_height*6;


    [pos_x, pos_y] = left_right(4,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(1,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(4,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(1,soldado_height,pos_x, pos_y,fila);

    filas.push(fila);



        tamanho = 5;
    fila=[[tamanho,0]];
    pos_x = soldado_width*13;
    pos_y = soldado_height*6;


    [pos_x, pos_y] = left_right(4,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(1,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(4,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(1,soldado_height,pos_x, pos_y,fila);

    filas.push(fila);



        tamanho = 5;
    fila=[[tamanho,0]];
    pos_x = soldado_width*9;
    pos_y = soldado_height*10;


    [pos_x, pos_y] = left_right(4,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(1,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(4,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(1,soldado_height,pos_x, pos_y,fila);

    filas.push(fila);




        tamanho = 5;
    fila=[[tamanho,0]];
    pos_x = soldado_width*10;
    pos_y = soldado_height*8;


    [pos_x, pos_y] = left_right(4,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(1,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(4,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(1,soldado_height,pos_x, pos_y,fila);

    filas.push(fila);




        tamanho = 5;
    fila=[[tamanho,0]];
    pos_x = soldado_width*9;
    pos_y = soldado_height*14;


    [pos_x, pos_y] = left_right(4,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(3,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(4,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(3,soldado_height,pos_x, pos_y,fila);

    filas.push(fila);




        tamanho = 5;
    fila=[[tamanho,0]];
    pos_x = soldado_width*14;
    pos_y = soldado_height*14;


    [pos_x, pos_y] = left_right(4,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(4,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(4,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(4,soldado_height,pos_x, pos_y,fila);
    filas.push(fila);



	tamanho = 5;
    fila=[[tamanho,0]];
    pos_x = soldado_width*19;
    pos_y = soldado_height*14;


    [pos_x, pos_y] = left_right(4,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(4,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(4,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(4,soldado_height,pos_x, pos_y,fila);
    filas.push(fila);



    tamanho = 5;
    fila=[[tamanho,0]];
    pos_x = soldado_width*17;
    pos_y = soldado_height*9;


    [pos_x, pos_y] = left_right(4,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(2,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(4,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(2,soldado_height,pos_x, pos_y,fila);
    filas.push(fila);


     tamanho = 5;
    fila=[[tamanho,0]];
    pos_x = soldado_width*19;
    pos_y = soldado_height*6;


    [pos_x, pos_y] = left_right(4,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(2,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(4,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(2,soldado_height,pos_x, pos_y,fila);
    filas.push(fila);


    tamanho = 5;
    fila=[[tamanho,0]];
    pos_x = soldado_width*24;
    pos_y = soldado_height*13;


    [pos_x, pos_y] = left_right(4,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(6,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(4,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = up_down(6,soldado_height,pos_x, pos_y,fila);
    filas.push(fila);



    cenarios.push(new Cenario(velocidade,10,mapa));
    array_filas.push(filas);





    return [cenarios, array_filas];

}
var tID;
function startCrono(jogador, seg, nivel)
{

    var data = new Date();
    var tIni = data.getTime();
    tID = setInterval(function(){

        seg = updateCrono(jogador, seg, nivel);
    }, 1000 );    //actualiza cronómetro a cada 5ms
}

function stopCrono(tID, jogador, seg){

    clearInterval(tID);
    setTimeout(function(){
        startCrono(jogador, seg);
    },5000);



}


function updateCrono(jogador, seg, nivel) {

    seg+=1;
    var min = Math.floor(seg/60);
    jogador.tempo.segundos=seg;
    jogador.tempo.minutos=min;
    var m1 = 2-min;
    var seg1= 60-seg%60;
    document.getElementById("time").innerHTML = m1+":"+seg1 + "s";
    if(jogador.estado == 0){
        jogador.tempo_fora--;
        if(jogador.tempo_fora<0){

            jogador.restart(nivel);
        }
        document.getElementById("tempo_fila").innerHTML=jogador.tempo_fora+"s";
    }
    return seg;
}

function up_down(un, height, pos_x, pos_y, array){
    for(let i=0; i<un; i++){
        pos_y+=height;
        array.push([pos_x,pos_y]);
    }
    return [pos_x, pos_y];
}

function down_up(un, height, pos_x, pos_y,array){
    for(let i=0; i<un; i++){
        pos_y-=height;
        array.push([pos_x,pos_y]);
    }
    return [pos_x, pos_y];
}

function left_right(un, width, pos_x, pos_y, array){
    for(let i=0; i<un; i++){
        pos_x+=width;
        array.push([pos_x,pos_y]);
    }
    return [pos_x, pos_y];
}

function right_left(un, width, pos_x, pos_y, array){
    for(let i=0; i<un; i++){
        pos_x-=width;
        array.push([pos_x,pos_y]);
    }
    return [pos_x, pos_y];

}


function icon_verifier( value, ctx, elementos, soldado_width, soldado_height){
    
    if(value == 3){
    	if(sessionStorage.vidas ==5){
    		return 1;
    		ctx.drawImage(elementos[0][0], elementos[0][1], elementos[0][2], soldado_width, soldado_height);
    	}
    }
    else if(value == 4){
    	if(sessionStorage.speeder == 1){
    		ctx.drawImage(elementos[1][0], elementos[1][1], elementos[1][2], soldado_width, soldado_height);
    		return 1;
    	}
    }
    else if(value == 5){
    	if(sessionStorage.freezer == 1){
    		ctx.drawImage(elementos[2][0], elementos[2][1], elementos[2][2], soldado_width, soldado_height);
    		return 1;
    	}
    	
    }
    else if(value == 6){
    	if(sessionStorage.killer == 1){
    		ctx.drawImage(elementos[3][0], elementos[3][1], elementos[3][2], soldado_width, soldado_height);
    		return 1;
    	}
    	
    }

    return value;
}
