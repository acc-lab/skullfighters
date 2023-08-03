//sound to load
var audio_to_be_registered=[
    ["cumShoot",".wav"],//parameter for passing into register audio function
    ["medBallExplosion",".wav"],
    ["hit(ler)sound",".wav"],
    ["bashSoundo",".wav"],
    ["idfcshootingstar",".wav"]
];

//registered sound
var registeredAudio={};

//I set these cap to make player not being deaf after playing this game
const SAUDIOCAPPERRESET=3;
const SAUDIOCAPRESETTICK=3;

//cap of total audio can play in 1 tick
const TAUDIOCAPPERTICK=5;

//record how many time each audio played
var audioPlayCount={};

var totalAudioPlayCount;

//audio tick
var audioTick=0;


function registerAudio(name,ext=".mp3",path="audio/"){
    var a=new Audio();
    a.src=path+name+ext
    a.autoplay=true;
    a.load();
    a.addEventListener("canplaythrough",function(event){
        registeredAudio[name]=this;
        audioPlayCount[name]=0;
    })
    //console.log(a);
}

function playAudio(name){
    if(audioPlayCount[name]>=SAUDIOCAPPERRESET||totalAudioPlayCount>=TAUDIOCAPPERTICK){
        return 0;
    }
    registeredAudio[name]
    .cloneNode(true)//this create a new audio to let multiple same sound overlap each other
    .play();
    audioPlayCount[name]++;
    totalAudioPlayCount++;
    return 1;
}

function loadAllaudio(){
    for(var i=0;i<audio_to_be_registered.length;i++){
        registerAudio(...audio_to_be_registered[i])
    }
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

setInterval(checkIfAudioLoadedAndResetPlayCap,30)