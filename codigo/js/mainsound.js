/**
 * Created by Miguel on 19/05/2016.
 */

function playSound() {
    var sound = document.getElementsByTagName('audio')[0];
    if (sessionStorage.currentSong){
        sound.src = "../audio/song" + sessionStorage.currentSong + ".mp3";
    }
    if (sessionStorage.currentTime) {
        sound.currentTime = sessionStorage.currentTime;
    }
    if (sessionStorage.volume) {
        sound.volume = sessionStorage.volume;
    }
    
    sound.play();
}

function updateSound(){
    var sound = document.getElementsByTagName('audio')[0];
    sessionStorage.currentTime=sound.currentTime;
}

function selectSound (i){
    var sound = document.getElementsByTagName('audio')[0];
    sessionStorage.currentSong=i;
    sound.src="../audio/song"+i+".mp3";
    sound.play();
}