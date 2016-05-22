

"use strict";
function  mod(n, m) {
    return ((n % m) + m) % m;
}

const url_updateVidas= "http://159.203.118.149/serverside/user/updateNvidas.php";

function update(){
    var type = "update";
    


    var Handler = function(ev) {
        document.removeEventListener(type, Handler);


        if (ev.response["success"] == 1) {
            
            console.log("success");
            
        } else {
            //alert("Username ou Password inválidos");
            console.log("erro");
        }
    }
    document.addEventListener(type, Handler);
    send_Data(url_updateVidas, type);

}


function send_Data(url, type) {
    var XHR = new XMLHttpRequest();
    
    
    var params = "nome=" +  sessionStorage.name + "&vidas=" +  sessionStorage.vidas;
    XHR.onreadystatechange = function() {
        if (XHR.readyState === 4 && XHR.status === 200) {
            var response = XHR.response;
            console.log(response);
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
    XHR.send(params);
}

function checkScore(nivel, min, seg) {
    var str=localStorage.getItem("lvl"+nivel);
    if (score){
        var score=str.split(" ")[1].split(":");
        if (compareTime(min, seg, parseInt(score[0]),parseInt(score[1]))>0){
            localStorage.setItem("lvl"+nivel,sessionStorage.name+" "+min+":"+seg+" ");
        }
    }else{
        localStorage.setItem("lvl"+nivel,sessionStorage.name+" "+min+":"+seg+" ");
    }
}
 
//if A<B return<0, if A>B return>0 else return==0;
function compareTime (minA, segA, minB, segB){
    return (minA*100+segA-minB*100-segB)
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
    constructor(x,y, vidas, nome, elementos){
        this.nome=nome;
        this.personagem=new Personagem(x,y);
        this.n_vidas=vidas;
        this.tempo=new Tempo(0,0);
        this.estado=0;
        this.n_fila=-1;
        this.tempo_fora=5;
        this.key=0;
        this.elementos=elementos;
    }

    draw (ctx, width, height,imagem){
        this.personagem.draw(ctx,width,height,imagem);
    }

    nextLevel(nivel, tempo){
        checkScore(nivel,this.tempo.minutos,this.tempo.segundos);
        nivel++;
        var segundos = tempo.segundos + tempo.minutos*60;
        console.log(nivel);
        sessionStorage.nivel_atual = nivel;
        if(nivel > sessionStorage.nivel)
            sessionStorage.nivel = nivel;
        sessionStorage.vidas = this.n_vidas;

        //update
        location.href = "../html/Transicao.html";
    }

    restartLevel(nivel){

        this.n_vidas--;
        sessionStorage.vidas= parseInt(sessionStorage.vidas) - 1;
        //send_Data(url_updateVidas);
        
        update();   
    
        updateSound();
        location.href = "../html/MotorDeJogo.html";

    }

    GameOver(nivel){

        sessionStorage.nivel_atual = nivel;
        sessionStorage.vidas = 3;
        //update
        resetSound();
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
        this.presenca_jogador=false;
    }

    atualizaPosicao(){
        this.primeira_posicao= (this.primeira_posicao+1)%this.soldados.length;
    }

    elimina_ultimo(ctx, soldados_width, soldados_heigth){
        var last= mod(this.primeira_posicao-this.tamanho+1,this.soldados.length);
        ctx.clearRect(this.soldados[last].x, this.soldados[last].y, soldados_width, soldados_heigth);
    }

    //desenha os soldados da fila
    draw(ctx,soldados_width,soldados_heigth,jogador,indice,nivel){
        var img = new Image();
        img.id = "imagem";
        var countUp=0, countLeft=0, countRight=0, countDown=0;
        if( this.soldados[this.primeira_posicao].x == jogador.personagem.x && this.soldados[this.primeira_posicao].y == jogador.personagem.y){
            console.log("PERDEU");
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
                if(jogador.estado==1  && i == this.tamanho-1 && this.presenca_jogador==true)
                    img.src = "../imagens/jogador/up/up"+ countUp+".png";    
                else
                img.src = "../imagens/soldado/up/up"+ countUp+".png";
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
                if(jogador.estado==1 && i == this.tamanho-1  && this.presenca_jogador==true)
                    img.src = "../imagens/jogador/down/down"+ countUp+".png";    
                else
                img.src = "../imagens/soldado/down/down"+ countDown+".png";
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
                if(jogador.estado==1  && i == this.tamanho-1  && this.presenca_jogador==true)
                    img.src = "../imagens/jogador/right/right"+ countUp+".png";    
                else
                img.src = "../imagens/soldado/right/right"+ countRight+".png";
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
                if(jogador.estado==1  && i == this.tamanho-1  && this.presenca_jogador==true)
                    img.src = "../imagens/jogador/left/left"+ countUp+".png";    
                else
                img.src = "../imagens/soldado/left/left"+ countLeft+".png";
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

    iniciaCenario(ctx,mapa_x, mapa_y, soldados_width, soldados_heigth, filas, jogador, ctxSoldados,elementos, ctxJogador, imagens, imagensJogador){
        var counter=0;//contador que serve para controlar os fps na funcao animLoop
        var health = 3;
        var slower = 4;
        var freezer = 5;
        var remover = 6;
        for (var i=0; i<mapa_y; i++){
            for (var k=0;k<mapa_x; k++){

                if (this.mapa[i][k]==health) {

                    ctx.drawImage(elementos[0][0], k * soldados_width, i * soldados_heigth, soldados_width, soldados_heigth);


                }

                else if (this.mapa[i][k]==slower) {

                    ctx.drawImage(elementos[1][0], k * soldados_width, i * soldados_heigth, soldados_width, soldados_heigth);


                }


                else if (this.mapa[i][k]==freezer) {

                    ctx.drawImage(elementos[2][0], k * soldados_width, i * soldados_heigth, soldados_width, soldados_heigth);

                }
                else if (this.mapa[i][k]==remover) {

                    ctx.drawImage(elementos[3][0], k * soldados_width, i * soldados_heigth, soldados_width, soldados_heigth);

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
        this.animLoop(ctxSoldados,soldados_width,soldados_heigth,counter,jogador, ctxJogador, imagens, imagensJogador, elementos, ctx);

    }
    //funcao que cria o movimento da fila, basicamente chamama funcao movimenta_soldados de x em x fps


    animLoop(ctxSoldados,soldados_width,soldados_heigth, counter,jogador, ctxJogador, imagens, imagensJogador, elementos, ctx){

        var velocidadeJogador=10;
        var framesToSkip=this.velocidade;
        var This=this;
        var anim = function() {

            This.animLoop(ctxSoldados,soldados_width,soldados_heigth,counter,jogador, ctxJogador, imagens, imagensJogador, elementos, ctx);
        }
        if (mod(counter,velocidadeJogador)==1){
            this.movimenta_jogador(jogador, soldados_width, soldados_heigth, ctxJogador,imagens, ctxSoldados, imagensJogador,elementos, ctx);
        }
        if (counter < framesToSkip) {
            counter++;
            window.requestAnimationFrame(anim);
            return;
        }

        var reqID = window.requestAnimationFrame(anim);
        counter=0;
        this.movimenta_soldados(ctxSoldados,soldados_width,soldados_heigth,jogador);
        
    }

    //handler das setas
    movimenta_jogador(jogador, soldado_width, soldado_height, ctxJogador, imagens, ctxSoldados, imagensJogador, elementos, ctxBack) {
        var cenario=this;
        var key = jogador.key;
        var x = jogador.personagem.x;
        var y = jogador.personagem.y;
        var nivel = this.nivel;
        jogador.key=0;

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
            default:
                return;

    }

    //sair da fila
    if (jogador.estado == 1) {
        jogador.estado = 0;
        cenario.filas[jogador.n_fila].tamanho--;
        jogador.n_fila=-1;
        ctxSoldados.clearRect(jogador.personagem.x, jogador.personagem.y, soldado_width, soldado_height);

        for(var i=0;i<cenario.filas.length;i++){
            var fila = cenario.filas[i];
            fila.presenca_jogador=false;
        }


    }
    var res = verifica_posicao(jogador, x, y, cenario.filas, soldado_width, soldado_height, ctxSoldados, cenario, ctxJogador, elementos, ctxBack);


    if( res == 1 || res == 2) {
        if (res == 2) {
            console.log("PERDEU");
            jogador.restart(nivel);
        }

        jogador.personagem.setPosicao(x, y);

        var cw = ctxJogador.canvas.width;
        var ch = ctxJogador.canvas.height;

        //apagar canvas
        ctxJogador.clearRect(0, 0, cw, ch);

        if (jogador.estado == 0) {
            switch (dir) {
                case "up":
                    jogador.draw(ctxJogador, soldado_width, soldado_height, imagensJogador[0][countUp]);
                    break;
                case "left":
                    jogador.draw(ctxJogador, soldado_width, soldado_height, imagensJogador[2][countLeft]);
                    break;
                case "down":
                    jogador.draw(ctxJogador, soldado_width, soldado_height, imagensJogador[3][countDown]);
                    break;
                case "right":
                    jogador.draw(ctxJogador, soldado_width, soldado_height, imagensJogador[1][countRight]);
                    break;

            }

        }

    }
}


    //apaga o ultimo elemento do fila e desenha o proximo movimento da fila
    movimenta_soldados(ctx,soldados_width, soldados_heigth,jogador){


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

