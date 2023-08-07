//sound to load
var audio_to_be_registered=[
    ["arrow_launch",".wav"],//parameter for passing into register audio function
    ["med_explosion",".wav"],
    ["shield_bash",".wav"],
    ["gun_shoot",".wav"],
    ["default_swing",".wav"],
];

//registered sound
var registeredAudio={};

//I set these cap to make player not deaf after playing this game
const SAUDIOCAPPERRESET=3;
const SAUDIOCAPRESETTICK=3;

//cap of total audio can play in 1 tick
const TAUDIOCAPPERTICK=5;

//record how many time each audio played
var audioPlayCount={};

var totalAudioPlayCount;

//audio tick
var audioTick=0;

//bgm handler variables
var currentbgmname="";
var switchbgmname="";
var bgm=new Audio();


function registerAudio(name,ext=".mp3",path="audio/"){
    var a=new Audio();
    a.src=path+name+ext;
    a.autoplay=true;
    a.load();
    a.addEventListener("canplaythrough",function(event){
        registeredAudio[name]=this;
        audioPlayCount[name]=0;
    })
}

function playAudio(name,randomize=false){
    if(audioPlayCount[name]>=SAUDIOCAPPERRESET||totalAudioPlayCount>=TAUDIOCAPPERTICK){
        return 0;
    }
    if(randomize){
        pitchShift(registeredAudio[name]
        .cloneNode(true),randomize(-1000,1000)/1000)//this creates a new audio to let multiple same sound overlap each other
        .play();
    }else{
        registeredAudio[name].cloneNode(true).play();
    }

    audioPlayCount[name]++;
    totalAudioPlayCount++;
    return 1;
}

function changeBgm(name){
    switchbgmname=name;
}

function loadAllaudio(){
    for(var i=0;i<audio_to_be_registered.length;i++){
        registerAudio(...audio_to_be_registered[i]);
    }
}

function pitchShift(audio,pitchShit){
    audio.preservePitch=false;
    audio.playbackRate=Math.exp(pitchShit);
    return audio;
}

loadAllaudio();

var loadeda=false;

function checkIfAudioLoadedAndResetPlayCap(){
	if(Object.keys(registeredAudio).length==audio_to_be_registered.length){
		loadeda=true;
	}else{
        loadeda=false;
    }
    totalAudioPlayCount=0;
    audioTick++;
    if(audioTick%SAUDIOCAPRESETTICK==0){
        for(var key in audioPlayCount){
            audioPlayCount[key]=0;
        }
    }
}

function bgmHandler(){
    if(!bgm.duration){
        return;
    }
    if(currentbgmname==""){
        bgm.pause();
    }
    if(currentbgmname!=switchbgmname){
        bgm.pause();
        bgm=registeredAudio[switchbgmname].cloneNode(true);
        currentbgmname=switchbgmname;
        bgm.play();
    }
    if(bgm.paused){
        bgm.play()
    }
    if(bgm.duration<=bgm.currentTime+1){
        //bgm.currentTime=0;
        bgm=bgm.cloneNode(true);
        bgm.play();
    }
}

setInterval(checkIfAudioLoadedAndResetPlayCap,30)

setInterval(bgmHandler,1)
 