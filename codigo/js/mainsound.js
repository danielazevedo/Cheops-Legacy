/**
 * Created by Miguel on 19/05/2016.
 */

function playSound() {
    var sound = document.getElementsByTagName('audio')[0];
    if (sessionStorage.timePlayed) {
        sound.currentTime = sessionStorage.timePlayed;
    }
    if (localStorage.volume){
        sound.volume=localStorage.volume;
    }
    sound.play();
}

function updateSound(){
    var sound = document.getElementsByTagName('audio')[0];
    sessionStorage.timePlayed=sound.currentTime;
}
