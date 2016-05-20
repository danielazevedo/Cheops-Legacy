/**
 * Created by Miguel on 19/05/2016.
 */
function playMain(){ //plays user's selected song --- called outside of motordejogo (changes current song)
    if (!sessionStorage.selectedSong){
        sessionStorage.selectedSong=0;
    }
    if (sessionStorage.selectedSong!=sessionStorage.currentSong){
        selectSound((sessionStorage.selectedSong));
    }else {
        playSound();
    }
}

function playSound() {//plays currently selected song (keeps playing surrentSong)
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

function updateSound(){ //updates song.currentTime
    var sound = document.getElementsByTagName('audio')[0];
    sessionStorage.currentTime=sound.currentTime;
}

function selectSound (i){//selects currentSong
    var sound = document.getElementsByTagName('audio')[0];
    sessionStorage.currentSong=i;
    sound.src="../audio/song"+i+".mp3";
    sound.play();
}

function deleteInfo (){ //deletes sessionStorage
    sessionStorage.removeItem("currentTime");
    sessionStorage.removeItem("volume");
    sessionStorage.removeItem("currentSong");
    sessionStorage.removeItem("selectedSong");
}