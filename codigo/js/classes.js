

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
    constructor(x,y, vidas, nome, tempo_restante, estado){
        this.nome=nome;
        this.personagem=new Personagem(x,y);
        this.n_vidas=vidas;
        this.tempo_restante=tempo_restante;
        this.estado=estado;
    }

    draw (ctx, width, height,imagem){
        this.personagem.draw(ctx,width,height,imagem);
    }

}


class Personagem{

    constructor(x,y){
        this.x=x;
        this.y=y;
    }

    //desenha soldado temporário amarelo
    draw(ctx, soldado_width, soldado_height,imagem){
        //ctx.fillStyle="#FF0000";
        ctx.drawImage(imagem,this.x,this.y,soldado_width,soldado_height);

    }
    clear(ctx, soldado_width, soldado_height){
        ctx.fillStyle="#00FFFF";
        ctx.fillRect(this.x,this.y,soldado_width,soldado_height);

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
    draw(ctx,soldados_width,soldados_heigth,jogador){
        var img = new Image();
        img.id = "imagem";
        img.src = "../imagens/up/up1.png";
        var countUp=0, countLeft=0, countRight=0, countDown=0;


        for (var i=0; i<this.tamanho;i++){
            var atual=mod((this.primeira_posicao-i),this.soldados.length);
            var proximo=mod((this.primeira_posicao-i+1),this.soldados.length);

            //up
            if(this.soldados[atual].x == this.soldados[proximo].x && this.soldados[atual].y > this.soldados[proximo].y){
                if(countUp+1==9)
                    countUp=1;
                else
                    countUp=mod(countUp+1,9)+1;
                img.src = "../imagens/up/up"+ countUp+".png";
                countDown = 0, countLeft = 0, countRight = 0;
            }
            //down
            else if(this.soldados[atual].x == this.soldados[proximo].x && this.soldados[atual].y < this.soldados[proximo].y){
                if(countDown+1==9)
                    countDown=1;
                else
                    countDown=mod(countDown+1,9)+1;
                img.src = "../imagens/down/down"+ countDown+".png";
                countUp = 0, countLeft = 0, countRight = 0;
            }
            //right
            else if(this.soldados[atual].x < this.soldados[proximo].x && this.soldados[atual].y == this.soldados[proximo].y){
                if(countRight+1==9)
                    countRight=1;
                else
                    countRight=mod(countRight+1,9)+1;
                img.src = "../imagens/right/right"+ countRight+".png";
                countDown = 0, countLeft = 0, countUp = 0;
            }
            //left
            if(this.soldados[atual].x > this.soldados[proximo].x && this.soldados[atual].y == this.soldados[proximo].y){
                if(countLeft+1==9)
                    countLeft=1;
                else
                    countLeft=mod(countLeft+1,9)+1;
                img.src = "../imagens/left/left"+ countLeft+".png";
                countDown = 0, countUp = 0, countRight = 0;
            }

            this.soldados[mod((this.primeira_posicao-i),this.soldados.length)].draw(ctx,soldados_width,soldados_heigth,img);

        }
        if(jogador.estado==1){
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

    iniciaCenario(ctx,div_x, div_y,mapa_x, mapa_y, soldados_width, soldados_heigth, filas, jogador){
        var counter=0;//contador que serve para controlar os fps na funcao animLoop
        var index=0;//indice do array do mapa
        for (let i=0; i<mapa_y; i+=div_y){
            for (let k=0;k<mapa_x; k+=div_x){
                if (this.mapa[index++]==0){//0==parede
                    ctx.fillStyle="#FF0000";
                }else{

                    ctx.fillStyle="#FFFFFF";
                }
                ctx.fillRect(k,i,div_x,div_y);
            }
        }

        for (let i=0;i<filas.length;i++){
            this.filas[i]=new Fila(filas[i]);
        }

        //desenha as filas iniciais
        for (let i=0; i<this.filas.length;i++){
            this.filas[i].draw(ctx,soldados_width,soldados_heigth,jogador);
        }


        //cria o movimento das filas
        this.animLoop(ctx,soldados_width,soldados_heigth,counter,jogador);

    }
    //funcao que cria o movimento da fila, basicamente chamama funcao movimenta_soldados de x em x fps
    animLoop(ctx,soldados_width,soldados_heigth, counter,jogador){

        var framesToSkip=20;
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


        for (let j=0; j<this.filas.length;j++){
            var fila= this.filas[j];

            //ultima posicao no array
            var last= mod(fila.primeira_posicao-fila.tamanho+1,fila.soldados.length);

            var cw = ctx.canvas.width;
            var ch = ctx.canvas.height;

            //apagar canvas
            ctx.clearRect(0, 0, cw, ch);

            fila.atualizaPosicao();
            fila.draw(ctx,soldados_width,soldados_heigth,jogador);
        }

    }
}

class Ranking{
    constructor(user, jogador, nivel){
        this.user=user;
        this.jogador=jogador;
        this.nivel=nivel;
    }

}
