/**
 * Created by daniel on 25-04-2016.
 */

"use strict";

(function()
{
    //automatically called as soon as the javascript is loaded
    window.addEventListener("load", main);
}());

var countUp = 0, countLeft = 0, countRight = 0, countDown = 0;

function main() {
    var c = document.getElementById("Canvas");
    var ctx = c.getContext("2d");

    var cJogador = document.getElementById("jogadorCanvas");
    var ctxJogador = cJogador.getContext("2d");


    var mapa_x = c.width, mapa_y = c.height;//dimensoes dom mapa
    var div_x = 20, div_y = 20;//dimensoes de cada quadricula do mapa
    var soldado_width = 30, soldado_height = 30;//dimensoes do quadrado que representa o soldado


    var mapa = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    var filas = [
        [[3, 0], [90, 0], [90, 30], [90, 60], [120, 60], [150, 60], [180, 60], [210, 60], [210, 30], [210, 0], [180, 0], [150, 0], [120, 0]]
    ];
    var cenario = new Cenario(0, 0, mapa);
    var jogador = new Jogador(0, 0, 3, "teste", 0, 0);
    cenario.iniciaCenario(ctx, div_x, div_y, mapa_x, mapa_y, soldado_width, soldado_height, filas, jogador);

    var img = new Image();
    img.id = "imagem";
    img.src = "../imagens/up/up1.png";
    jogador.draw(ctxJogador, soldado_width, soldado_height, img);


    document.onkeydown = keyHandler;

    function keyHandler(ev) {
        var key = ev.keyCode;
        var x = jogador.personagem.x;
        var y = jogador.personagem.y;

        //sair da fila
        if (jogador.estado == 1) {
            jogador.estado = 0;
            cenario.filas[0].tamanho--;
        }

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

        var res = verifica_colisoes(x, y, cenario.filas[0]);
        if (res == 0) {
            verifica_posicao(jogador, x, y, cenario.filas[0]);

            //atualizar posicao do jogador
            jogador.personagem.setPosicao(x, y);


            var cw = ctxJogador.canvas.width;
            var ch = ctxJogador.canvas.height;
            var img = new Image();
            img.id = "imagem";
            //apagar canvas
            ctxJogador.clearRect(0, 0, cw, ch);

            if (jogador.estado == 0) {
                switch (dir) {
                    case "up":
                        img.src = "../imagens/up/up" + countUp + ".png";
                        jogador.draw(ctxJogador, soldado_width, soldado_height, img);
                        break;
                    case "left":
                        img.src = "../imagens/left/left" + countLeft + ".png";
                        jogador.draw(ctxJogador, soldado_width, soldado_height, img);
                        break;
                    case "down":
                        img.src = "../imagens/down/down" + countDown + ".png";
                        jogador.draw(ctxJogador, soldado_width, soldado_height, img);
                        break;
                    case "right":
                        img.src = "../imagens/right/right" + countRight + ".png";
                        jogador.draw(ctxJogador, soldado_width, soldado_height, img);
                        break;

                }
            }

        }


    }
}
function verifica_colisoes(x,y,fila){
    for(var i=0;i<fila.tamanho;i++) {
        if (fila.soldados[mod(fila.primeira_posicao - i,fila.soldados.length)].x == x && fila.soldados[mod(fila.primeira_posicao -i,fila.soldados.length)].y == y) {
            return 1;
        }
    }

    return 0;
}

function verifica_posicao(jogador,x,y,fila){
    var last_mais1= mod(fila.primeira_posicao-fila.tamanho,fila.soldados.length);
    if(fila.soldados[last_mais1].x == x && fila.soldados[last_mais1].y == y ){
        console.log("entrou");
        fila.tamanho++;
        jogador.estado=1;

    }

}

function  mod(n, m) {
    return ((n % m) + m) % m;
}