/**
 * Created by daniel on 25-04-2016.
 */

"use strict";

(function()
{
    //automatically called as soon as the javascript is loaded
    var img = new Image();
    var img1 = new Image();
    var img2 = new Image();
    var img3 = new Image();
    var img4 = new Image();
    var img5 = new Image();
    img.src = "../imagens/heal.png";
    img1.src = "../imagens/ppp.png";
    img2.src = "../imagens/ground.jpg";
    img3.src = "../imagens/runner.png";
    img4.src = "../imagens/stop_time.png";
    img5.src = "../imagens/remove.png"
    window.addEventListener("load", main);
}());

var countUp = 0, countLeft = 0, countRight = 0, countDown = 0;

function main() {

    //carregar as imagens
    var imagens1 = [];
    var imagens2 = [];
    var imagens3 = [];
    var imagens4 = [];


    var img = new Image();
    var img1 = new Image();
    var img2 = new Image();
    var img3 = new Image();
    var img4 = new Image();
    var img5 = new Image();
    img.src = "../imagens/heal.png";
    img1.src = "../imagens/ppp.png";
    img2.src = "../imagens/ground.jpg";
    img3.src = "../imagens/runner.png";
    img4.src = "../imagens/stop_time.png";
    img5.src = "../imagens/remove.png"
    var elementos=[img, img1, img2, img3, img4, img5];
    for (let i = 0; i < 9; i++) {
        var imagem1 = new Image();
        var imagem2 = new Image();
        var imagem3 = new Image();
        var imagem4 = new Image();


        imagem1.src = "../imagens/up/up" + i + ".png";
        imagem2.src = "../imagens/right/right" + i + ".png";
        imagem3.src = "../imagens/left/left" + i + ".png";
        imagem4.src = "../imagens/down/down" + i + ".png";

        imagens1[i] = imagem1;
        imagens2[i] = imagem2;
        imagens3[i] = imagem3;
        imagens4[i] = imagem4;


    }

    var imagens = [imagens1, imagens2, imagens3, imagens4];


    var c = document.getElementById("Canvas");
    var ctx = c.getContext("2d");

    var cJogador = document.getElementById("jogadorCanvas");
    var ctxJogador = cJogador.getContext("2d");

    var cSoldados = document.getElementById("soldadosCanvas");
    var ctxSoldados = cSoldados.getContext("2d");



    c.width = window.innerWidth;
    c.height = window.innerHeight;
    var soldado_width = 60, soldado_height = 60;//dimensoes do quadrado que representa o soldado

    var value_cookie = getCookie("nivel");

    if (value_cookie != "nao existe") {
        var nivel = value_cookie[0];
    }

    value_cookie = getCookie("n_vidas");

    if (value_cookie != "nao existe") {
        var n_vidas = value_cookie[0];
    }

    nivel = parseInt(nivel);
    n_vidas = parseInt(n_vidas);
    console.log(nivel, n_vidas);

    if(nivel != 1){
        var div = document.getElementById("helper");
        var text = document.getElementById("text_helper");
        div.style.display = 'none';
        text.style.display = 'none';
    }

    document.getElementById("n_vidas").innerHTML = n_vidas;

    document.body.style.background = "url(../imagens/bg_nivel"+nivel+".png) no-repeat center center fixed";
    document.body.style.backgroundSize = "100% 100%";

    var posicoes_inicio= [[120, 300],[120, 240]];


    var dados_niveis = carregaCenarios(soldado_width, soldado_height);
    //array de cenarios
    var cenarios = dados_niveis[0];
    //array de filas
    var filas_niveis = dados_niveis[1];




    //posicao do jogador
    var pos_x = posicoes_inicio[nivel-1][0];
    var pos_y = posicoes_inicio[nivel-1][1];
    var estado = 0;

    var cenario = cenarios[nivel-1];
    var mapa_x = cenario.mapa[0].length, mapa_y = cenario.mapa.length;//dimensoes dom mapa

    init(ctx, mapa_x, mapa_y, soldado_width, soldado_height, filas_niveis[nivel-1], ctxSoldados, ctxJogador, cenario, nivel, pos_x, pos_y, imagens, estado, n_vidas, elementos, ctx);


}

function init(ctx, mapa_x, mapa_y, soldado_width, soldado_height, filas, ctxSoldados, ctxJogador, cenario, nivel, pos_x, pos_y, imagens, estado, n_vidas,elementos, ctxBack){


    //inicializar o jogador
    var jogador = new Jogador(pos_x, pos_y, n_vidas, "teste");

    //inicializar o jogo
    cenario.iniciaCenario(ctx,mapa_x, mapa_y, soldado_width, soldado_height, filas, jogador, ctxSoldados,elementos);

    var count = 0;
    document.getElementById("time").innerHTML = "3:0s";

    document.getElementById("tempo_fila").innerHTML="5:0s";
    //inicializar o jogador
    var img = new Image();
    img.src = "../imagens/right/right0.png";
    img.onload = function () {
        jogador.draw(ctxJogador, soldado_width, soldado_height, img);
    }

    var flag = 0;
    var pressed = false;
    document.onkeydown = function (ev) {
        if (pressed) return;
        pressed = true;
        if(flag == 0 && (ev.keyCode==37 || ev.keyCode==38 ||ev.keyCode==39 ||ev.keyCode==40)){
            startCrono(jogador, count, cenario.nivel);
            flag = 1;
        }
        keyHandler(ev, cenario, jogador, soldado_width, soldado_height, ctxJogador, imagens, cenario.mapa, ctxSoldados,nivel, ctxBack);
    };

    document.onkeyup = function () {
        pressed = false;
    };

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
    //handler das setas
    function keyHandler(ev, cenario, jogador, soldado_width, soldado_height, ctxJogador, imagens, mapa, ctx, nivel, ctxBack) {
        var key = ev.keyCode;
        var x = jogador.personagem.x;
        var y = jogador.personagem.y;



        var dir = "right";
        var jogador_width = soldado_width;
        var jogador_height = soldado_height;
        //Movement
        switch (key) {
            //left
            case 37:
                x -= jogador_width;
                dir = "left";
                //para nao começar no 1
                if (countLeft + 1 == 9)
                    countLeft = 1;
                else
                    countLeft = mod(countLeft + 1, 9);
                countDown = 0, countUp = 0, countRight = 0;
                break;
            //up
            case 38:
                dir = "up";
                y -= jogador_height;
                if (countUp + 1 == 9)
                    countUp = 1;
                else
                    countUp = mod(countUp + 1, 9);
                countDown = 0, countLeft = 0, countRight = 0;
                break;

            //right
            case 39:
                dir = "right";
                x += jogador_width;
                if (countRight + 1 == 9)
                    countRight = 1;
                else
                    countRight = mod(countRight + 1, 9);
                countDown = 0, countUp = 0, countLeft = 0;
                break;
            //down
            case 40:
                dir = "down";
                y += jogador_height;
                if (countDown + 1 == 9)
                    countDown = 1;
                else
                    countDown = mod(countDown + 1, 9);
                countUp = 0, countLeft = 0, countRight = 0;
                break;


        }

        //sair da fila
        if (jogador.estado == 1) {
            jogador.estado = 0;
            cenario.filas[jogador.n_fila].tamanho--;
            jogador.n_fila=-1;
            ctx.clearRect(jogador.personagem.x, jogador.personagem.y, soldado_width, soldado_height);


        }
        var res = verifica_posicao(jogador, x, y, cenario.filas, mapa, soldado_width, soldado_height, nivel, ctxBack, cenario, ctx);


        if( res == 1 || res == 2) {
            if (res == 2) {
                console.log("PERDEU");
                jogador.restart(nivel, ctx, ctxJogador);
            }

                jogador.personagem.setPosicao(x, y);

                var cw = ctxJogador.canvas.width;
                var ch = ctxJogador.canvas.height;

               /* if (nivel == 1) {
                    var text = document.getElementById("text_helper");
                    text.innerHTML = "Agora quando tiver oportunidade saia da fila, ou para passar para a proxima, ou então para chegar ao ponto de destino";
                }*/
                //apagar canvas
                ctxJogador.clearRect(0, 0, cw, ch);

                if (jogador.estado == 0) {
                    switch (dir) {
                        case "up":
                            jogador.draw(ctxJogador, soldado_width, soldado_height, imagens[0][countUp]);
                            break;
                        case "left":
                            jogador.draw(ctxJogador, soldado_width, soldado_height, imagens[2][countLeft]);
                            break;
                        case "down":
                            jogador.draw(ctxJogador, soldado_width, soldado_height, imagens[3][countDown]);
                            break;
                        case "right":
                            jogador.draw(ctxJogador, soldado_width, soldado_height, imagens[1][countRight]);
                            break;

                    }

                }

            /*}
            else{
                console.log("PERDEU");
                jogador.restart(nivel, ctx, ctxJogador);
            }*/
        }
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

function verifica_posicao(jogador,x,y,filas, mapa, soldado_width,soldado_height, nivel, ctx, cenario, ctxSoldados){

    if(mapa[y/soldado_height][x/soldado_width] == 0)
        return 0;

    else if(mapa[y/soldado_height][x/soldado_width] == 2){
        console.log("NIVEL COMPLETO");
        jogador.nextLevel(nivel, jogador.tempo);
        jogador.estado=1;
    }
    else if(mapa[y/soldado_height][x/soldado_width] == 3){
        console.log("vida");
        jogador.n_vidas++;
        document.getElementById("n_vidas").innerHTML= jogador.n_vidas;
        ctx.clearRect(x,y,soldado_width, soldado_height);
        mapa[y/soldado_height][x/soldado_width] = 1;

    }

    else if(mapa[y/soldado_height][x/soldado_width] == 4){
        console.log("aumenta velocidade filas");
        cenario.velocidade=+40;
        mapa[y/soldado_height][x/soldado_width] = 1;
        ctx.clearRect(x,y,soldado_width, soldado_height);
    }

    else if(mapa[y/soldado_height][x/soldado_width] == 5){
        console.log("parar o tempo");
        stopCrono(tID,jogador, (jogador.tempo.segundos+ jogador.tempo.minutos*60));
        mapa[y/soldado_height][x/soldado_width] = 1;
        ctx.clearRect(x,y,soldado_width, soldado_height);
        var text = document.getElementById("text_helper");
        text.innerHTML = "";
    }
    else if(mapa[y/soldado_height][x/soldado_width] == 6){
        console.log("remove elementos das filas");
        for(var i=0; i<filas.length;i++){
            filas[i].elimina_ultimo(ctxSoldados, soldado_width, soldado_height);
            filas[i].tamanho--;
        }
        mapa[y/soldado_height][x/soldado_width] = 1;
        ctx.clearRect(x,y,soldado_width, soldado_height);

    }

    if(verifica_colisoes(x, y, filas) != 0)
        return  2;

    for(let i=0;i<filas.length;i++) {

        var fila= filas[i];
        var last_mais1 = mod(fila.primeira_posicao - fila.tamanho, fila.soldados.length);

        if (fila.soldados[last_mais1].x == x && fila.soldados[last_mais1].y == y) {
            console.log("entrou");
            if (jogador.estado == 0)
                fila.tamanho++;
            jogador.tempo_fora=0;
            jogador.estado = 1;
            jogador.n_fila = i;
        }

    }
    return 1;
}

function  mod(n, m) {
    return ((n % m) + m) % m;
}


function carregaCenarios(soldado_width, soldado_height){
    var cenarios = [];
    var array_filas = [];

    //NIVEL 1
    var mapa = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 1, 1, 1, 6, 1, 1, 1, 0, 1, 1, 3, 1, 0, 0, 0, 1, 4, 1, 1, 1, 1, 1, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
                [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 0, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 0, 0],
                [0, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ];
    /*var filas = [
        [[3, 0], [300, 300], [300, 360], [300, 420], [360, 420], [420, 420], [480, 420], [540, 420], [540, 360], [540, 300], [480, 300], [420, 300], [360, 300]],

        [[3, 0], [840, 300], [840, 360], [840, 420], [780, 420], [720, 420], [660, 420], [600, 420], [600, 360], [600, 300], [660, 300], [720, 300], [780, 300]],

    ];*/
    var filas =[];
    var tamanho = 18;
    var velocidade = 20;

    var fila=[[tamanho,0]];
    var pos_x = 480;
    var pos_y = 480;
    [pos_x, pos_y] = up_down(5,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(5,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(5,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = left_right(5,soldado_width,pos_x, pos_y,fila);
    filas.push(fila);

    tamanho = 25;
    var fila=[[tamanho,0]];
    var pos_x = 960;
    var pos_y = 240;
    [pos_x, pos_y] = up_down(3,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(11,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(3,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = left_right(11,soldado_width,pos_x, pos_y,fila);
    filas.push(fila);

    tamanho = 6;
    var fila=[[tamanho,0]];
    var pos_x = 1320;
    var pos_y = 600;
    [pos_x, pos_y] = up_down(1,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = left_right(3,soldado_width,pos_x, pos_y,fila);
    [pos_x, pos_y] = down_up(1,soldado_height,pos_x, pos_y,fila);
    [pos_x, pos_y] = right_left(3,soldado_width,pos_x, pos_y,fila);
    filas.push(fila);



    cenarios.push(new Cenario(velocidade,1,mapa));
    array_filas.push(filas);

    //NIVEL 2
    mapa = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
    filas = [
        [[3, 0], [300, 300], [300, 360], [300, 420], [360, 420], [420, 420], [480, 420], [540, 420], [540, 360], [540, 300], [480, 300], [420, 300], [360, 300]],

        [[3, 0], [840, 300], [840, 360], [840, 420], [780, 420], [720, 420], [660, 420], [600, 420], [600, 360], [600, 300], [660, 300], [720, 300], [780, 300]],

    ];
    velocidade = 10;
    cenarios.push(new Cenario(velocidade,2,mapa));
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