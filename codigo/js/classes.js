

"use strict";
function  mod(n, m) {
    return ((n % m) + m) % m;
}

class Tempo{
    constructor(s, m){
        this.segundos=s;
        this.minutos=m;
    }


}

class Definicoes{
    constructor(musica, teclado, volume){
        this.volume=volume;
        this.musica=musica;
        this.teclado=teclado;
    }
}

class User{
    constructor(nome, pass, mail, niveis){
        this.nome=nome;
        this.password=pass;
        this.email=mail;
        this.n_niveis=niveis;

    }
}

class Jogador{
    constructor(x,y, vidas, nome, tempo, estado){
        this.nome=nome;
        this.personagem=new Personagem(x,y);
        this.n_vidas=vidas;
        this.tempo=tempo;
        this.estado=estado;
        this.n_fila=-1;
    }

    draw (ctx, width, height,imagem){
        this.personagem.draw(ctx,width,height,imagem);
    }

    nextLevel(nivel, tempo){
        nivel++;
        var segundos = tempo.segundos + tempo.minutos*60;
        document.cookie = "nivel=" + nivel;
        document.cookie = "n_vidas=" + this.n_vidas;
        location.href = "../html/Transicao.html";
    }

    restartLevel(nivel){

        this.n_vidas--;
        document.cookie = "nivel=" + nivel;
        document.cookie = "n_vidas=" + this.n_vidas;
        location.href = "../html/MotorDeJogo.html";

    }

    GameOver(nivel){



        document.cookie = "nivel=" + nivel;
        document.cookie = "n_vidas = 3";
        location.href = "../html/Main.html";

    }

    restart(nivel){
        if(this.n_vidas == 1){
            this.GameOver(nivel);
        }
        else{
            this.restartLevel(nivel);
        }
    }

}


class Personagem{

    constructor(x,y){
        this.x=x;
        this.y=y;
    }

    //desenha soldado temporário amarelo
    draw(ctx, soldado_width, soldado_height,imagem){

        ctx.drawImage(imagem,this.x,this.y,soldado_width,soldado_height);

    }

    setPosicao(x,y){
        this.x=x;
        this.y=y;
    }
}

class Fila{
    constructor(soldados){
        this.soldados=[];
        this.tamanho=soldados[0][0];
        for (let i=1; i<soldados.length;i++) {
            this.soldados[i-1] = new Personagem(soldados[i][0], soldados[i][1]);
        }
        this.primeira_posicao=this.tamanho;
    }

    atualizaPosicao(){
        this.primeira_posicao= (this.primeira_posicao+1)%this.soldados.length;
    }

    //desenha os soldados da fila
    draw(ctx,soldados_width,soldados_heigth,jogador,indice,nivel){
        var img = new Image();
        img.id = "imagem";
        var countUp=0, countLeft=0, countRight=0, countDown=0;
        if( this.soldados[this.primeira_posicao].x == jogador.personagem.x && this.soldados[this.primeira_posicao].y == jogador.personagem.y){
            console.log("PERDEU");
            console.log(nivel);
            jogador.restart(nivel);
        }

        for (var i=0; i<this.tamanho;i++){
            var atual=mod((this.primeira_posicao-i),this.soldados.length);
            var proximo=mod((this.primeira_posicao-i+1),this.soldados.length);

            //up
            if(this.soldados[atual].x == this.soldados[proximo].x && this.soldados[atual].y > this.soldados[proximo].y){
                countUp=0;

                //determinar qual o sprite a usar
                var c=i;
                var atual1=mod((this.primeira_posicao-c),this.soldados.length);
                var proximo1=mod((this.primeira_posicao-c+1),this.soldados.length);
                while(this.soldados[atual1].x == this.soldados[proximo1].x && this.soldados[atual1].y > this.soldados[proximo1].y){
                    c++;
                    atual1=mod((this.primeira_posicao-c),this.soldados.length);
                    proximo1=mod((this.primeira_posicao-c+1),this.soldados.length);

                }
                countUp+=c-(i+1);
                if(countUp==9)
                    countUp=1;
                else
                    countUp=mod(countUp,9);
                img.src = "../imagens/up/up"+ countUp+".png";
                countDown = 0, countLeft = 0, countRight = 0;
            }
            //down
            else if(this.soldados[atual].x == this.soldados[proximo].x && this.soldados[atual].y < this.soldados[proximo].y){
                countDown=0;

                //determinar qual o sprite a usar
                var c=i;
                var atual1=mod((this.primeira_posicao-c),this.soldados.length);
                var proximo1=mod((this.primeira_posicao-c+1),this.soldados.length);
                while(this.soldados[atual1].x == this.soldados[proximo1].x && this.soldados[atual1].y < this.soldados[proximo1].y){
                    c++;
                    atual1=mod((this.primeira_posicao-c),this.soldados.length);
                    proximo1=mod((this.primeira_posicao-c+1),this.soldados.length);

                }
                countDown+=c-(i+1);
                if(countDown==9)
                    countDown=1;
                else
                    countDown=mod(countDown,9);
                img.src = "../imagens/down/down"+ countDown+".png";
                countUp = 0, countLeft = 0, countRight = 0;
            }
            //right
            else if(this.soldados[atual].x < this.soldados[proximo].x && this.soldados[atual].y == this.soldados[proximo].y){
                countRight=0;

                //determinar qual o sprite a usar
                var c=i;
                var atual1=mod((this.primeira_posicao-c),this.soldados.length);
                var proximo1=mod((this.primeira_posicao-c+1),this.soldados.length);
                while(this.soldados[atual1].x < this.soldados[proximo1].x && this.soldados[atual1].y == this.soldados[proximo1].y){
                    c++;
                    atual1=mod((this.primeira_posicao-c),this.soldados.length);
                    proximo1=mod((this.primeira_posicao-c+1),this.soldados.length);

                }
                countRight+=c-(i+1);

                if(countRight==9)
                    countRight=1;
                else
                    countRight=mod(countRight,9);
                img.src = "../imagens/right/right"+ countRight+".png";
                countDown = 0, countLeft = 0, countUp = 0;
            }
            //left
            else if(this.soldados[atual].x > this.soldados[proximo].x && this.soldados[atual].y == this.soldados[proximo].y){
                countLeft=0;

                //determinar qual o sprite a usar
                var c=i;
                var atual1=mod((this.primeira_posicao-c),this.soldados.length);
                var proximo1=mod((this.primeira_posicao-c+1),this.soldados.length);
                while(this.soldados[atual1].x > this.soldados[proximo1].x && this.soldados[atual1].y == this.soldados[proximo1].y){
                    c++;
                    atual1=mod((this.primeira_posicao-c),this.soldados.length);
                    proximo1=mod((this.primeira_posicao-c+1),this.soldados.length);

                }
                countLeft+=c-(i+1);
                if(countLeft==9)
                    countLeft=1;
                else
                    countLeft=mod(countLeft,9);
                img.src = "../imagens/left/left"+ countLeft+".png";
                countDown = 0, countUp = 0, countRight = 0;
            }


            this.soldados[mod((this.primeira_posicao-i),this.soldados.length)].draw(ctx,soldados_width,soldados_heigth,img);

        }
        if(jogador.estado==1 && indice == jogador.n_fila){
            jogador.personagem.setPosicao(this.soldados[mod((this.primeira_posicao-this.tamanho+1),this.soldados.length)].x,this.soldados[mod((this.primeira_posicao-this.tamanho+1),this.soldados.length)].y);
        }
    }

}

class Cenario{
    constructor(velocidade, nivel ,mapa){
        this.filas=[];
        this.velocidade=velocidade;
        this.nivel=nivel;
        this.mapa=mapa;
    }

    iniciaCenario(ctx,mapa_x, mapa_y, soldados_width, soldados_heigth, filas, jogador, ctxSoldados,elementos){
        var counter=0;//contador que serve para controlar os fps na funcao animLoop

        for (var i=0; i<mapa_y; i++){
            for (var k=0;k<mapa_x; k++){

              /*  if (this.mapa[i][k]==0) {//0==parede

                    ctx.drawImage(elementos[1], k * soldados_width, i * soldados_heigth, soldados_width, soldados_heigth);

                    console.log( k * soldados_width, i * soldados_heigth, soldados_width, soldados_heigth);

                }


                else if (this.mapa[i][k]!=0) {//0==parede

                    ctx.drawImage(elementos[2], k * soldados_width, i * soldados_heigth, soldados_width, soldados_heigth);

                    console.log( k * soldados_width, i * soldados_heigth, soldados_width, soldados_heigth);

                }

*/


                if (this.mapa[i][k]==3) {//0==parede

                    ctx.drawImage(elementos[0], k * soldados_width, i * soldados_heigth, soldados_width, soldados_heigth);

                    console.log( k * soldados_width, i * soldados_heigth, soldados_width, soldados_heigth);

                }

                else if (this.mapa[i][k]==4) {//0==parede

                    ctx.drawImage(elementos[3], k * soldados_width, i * soldados_heigth, soldados_width, soldados_heigth);

                    console.log( k * soldados_width, i * soldados_heigth, soldados_width, soldados_heigth);

                }


                else if (this.mapa[i][k]==5) {//0==parede

                    ctx.drawImage(elementos[4], k * soldados_width, i * soldados_heigth, soldados_width, soldados_heigth);

                    console.log( k * soldados_width, i * soldados_heigth, soldados_width, soldados_heigth);
                }





            }
        }


        for (let i=0;i<filas.length;i++){
            this.filas[i]=new Fila(filas[i]);
        }

        //desenha as filas iniciais
        for (let i=0; i<this.filas.length;i++){
            this.filas[i].draw(ctxSoldados,soldados_width,soldados_heigth,jogador,i,this.nivel);
        }


        //cria o movimento das filas
        this.animLoop(ctxSoldados,soldados_width,soldados_heigth,counter,jogador);

    }
    //funcao que cria o movimento da fila, basicamente chamama funcao movimenta_soldados de x em x fps
    animLoop(ctx,soldados_width,soldados_heigth, counter,jogador){

        var framesToSkip=this.velocidade;
        var This=this;
        var anim = function() {

            This.animLoop(ctx,soldados_width,soldados_heigth,counter,jogador);
        }
        if (counter < framesToSkip) {
            counter++;
            window.requestAnimationFrame(anim);
            return;
        }

        var reqID = window.requestAnimationFrame(anim);
        counter=0;
        this.movimenta_soldados(ctx,soldados_width,soldados_heigth,jogador);
    }

    //apaga o ultimo elemento do fila e desenha o proximo movimento da fila
    movimenta_soldados(ctx,soldados_width, soldados_heigth,jogador){

       /* var cw = ctx.canvas.width;
        var ch = ctx.canvas.height;

        apagar canvas
*/
        for (let j=0; j<this.filas.length;j++){
            var fila= this.filas[j];

            //ultima posicao no array
            var last= mod(fila.primeira_posicao-fila.tamanho+1,fila.soldados.length);

            ctx.clearRect(fila.soldados[last].x, fila.soldados[last].y, soldados_width, soldados_heigth);
            fila.atualizaPosicao();
            fila.draw(ctx,soldados_width,soldados_heigth,jogador,j, this.nivel);
        }

    }
}
/*
class Ranking{
    constructor(user, jogador, nivel){
        this.user=user;
        this.jogador=jogador;
        this.nivel=nivel;
    }

}*/
