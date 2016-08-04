var GLOBAL = {
    map: {"consonant": "bcdfghjklmnpqrstvwxz","vowel": "aeiouy"},
    del: "",
    adv: "",
    aggro: 0.6
}

function run() {
    GLOBAL.del = document.getElementById("delGenes").value;
    GLOBAL.adv = document.getElementById("advGenes").value;
    GLOBAL.aggro = document.getElementById("aggro").value/50;
    document.getElementById("out").value = mutate(document.getElementById("in").value);
}

function mutate(input){
	c = input;
	if(document.getElementById("one swaps").checked) {c = oneSwap(c);}
	if(document.getElementById("tweak doubles").checked) {c = tweakDoubles(c);}
	if(document.getElementById("shuffles").checked) {c = shuffle(c);}
	if(document.getElementById("clips").checked) {c = clip(c);}
	if(document.getElementById("appends").checked) {c = appendChars(c);}

	return c;
}

function oneSwap(input) { 
    var output = [];
    for (var i = 0; i<input.length; i++) {
        if (willChange(input[i],1)) {
            output[i] = change(input[i]);
        } else {
            output[i] = input[i];
        }
    }
    return output.join("");
}

function tweakDoubles(input){
	var output = [];
	j = 0;
    for (var i = 0; i<input.length; i++) {
        if (willChange(input[i],0.4)) {
            output[j] = input[i];
            j++;
            output[j] = input[i];
        } else {
            output[j] = input[i];
        }
        j++;

        if(input[i]==input[i-1] & willChange(input[i],1)) {
        	output[j] = "";
        }
    }
    return output.join("");
}

function shuffle(input){
	var output = [];
    for (var i = 0; i<input.length; i++) {
        if (willChange(input[i],0.8)) {
            output[i] = output[i-1];
            output[i-1] = input[i];
        } else {
            output[i] = input[i];
        }
    }
    return output.join("");
}

function clip(input){
	var output = [];
    for (var i = 0; i<input.length; i++) {
        if (willChange(input[i],0.6)) {
            output[i] = ""
        } else {
            output[i] = input[i];
        }
    }
    return output.join("");
}

function appendChars(input){
	var output = [];
	j = 0;
    for (var i = 0; i<input.length; i++) {
    	output[j] = input[i];
        if (willChange(input[i],0.5)) {
            j++;
            output[j] = randomChar();
        }
        j++;
    }
    return output.join("");
}

function randomChar(){
	universe = "abcdefghijklmnopqrstuvwzxy"
	for (i = 0; i < 5; i++){
		universe = universe.concat(GLOBAL.adv);
	}
	index = Math.floor(Math.random()*universe.length)
	char = universe[index];
	return char;
}

function willChange(c, weight) {
    var rand = Math.random()*weight;
    if(contains(",.:\"\\/\';!?@#$%^&*()_-=[]{}|<>~` \n", c)){
        return false;
    }
    if(rand > GLOBAL.aggro^2 & contains(GLOBAL.del,c)){
        return false;
    }
    if(rand > GLOBAL.aggro){
        return false;
    }
    if(rand > GLOBAL.aggro^(0.5) & contains(GLOBAL.adv,c)){
        return false;
    }
    return true;
}

function change(c) {
    var rand = Math.random();
    var stype = "consonant";
    if (contains("aeiouy", c)) {
        stype = "vowel"
    }
    var index = Math.ceil(rand*GLOBAL.map[stype].length);
    var out = GLOBAL.map[stype][index]; 
    return out;
}

function contains(a, obj) {
    for (var i = 0; i < a.length; i++) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

//////////// Interface functions

function outToIn(){
    document.getElementById("in").value = document.getElementById("out").value
}


function saveFile() {
    var textToSave = document.getElementById("out").value.replace(/([^\r])\n/g, "$1\r\n");
    var textToSaveAsBlob = new Blob([textToSave], {type:"text/plain"});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    var fileNameToSaveAs = "Mutation output.txt";
 
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
 
    downloadLink.click();
}
 
function destroyClickedElement(event) {
    document.body.removeChild(event.target);
}
 
function loadFileAsText() {
    var fileToLoad = document.getElementById("fileToLoad").files[0];
 
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent) 
    {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        document.getElementById("out").value = textFromFileLoaded;
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
}