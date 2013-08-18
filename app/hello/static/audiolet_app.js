

//this function converts letters to numbers
//not working atm

// function str2num(mystr) {
// mystr = mystr.toUpperCase();
// var conv = [];
// var l = mystr.length;
// for (var i=0; i conv[i] = mystr.charCodeAt(i)-65;
// }
// return conv;
// }


//defining Animal object that JSON sends to
function Animal(data) {
	this.common_names = data.common_names;
	this.country_found_in = data.country_found_in;
	this.scientific_name = data.scientific_name;
	this.create_time = data.create_time;
	this.ED_score = data.ED_score;
	this.extinct = data.extinct;
	this.search_countries = data.search_countries;
	this.type = data.Type;
	this.id = data.id;
	this.EDGE_group = data.EDGE_group;
	this.other_names = data.other_names;
	this.species_family = data.species_family;
	this.EDGE_rank = data.EDGE_rank;
	this.species_class = data.species_class;
	this.status = data.status;
	this.species_order = data.species_order;
	this.short_summary = data.short_summary;
	this.edgeometer = data.edgeometer;
	this.synonym = data.synonym;
	this.summary = data.summary;
	this.modify_name = data.modify_name;
	this.ge_score = data.ge_score;
	this.aquatic_regions = data.aquatic_regions;
	this.focus_species = data.focus_species;

};

var animals = [];

function clearAnimals(){
	animals = [];
	console.log("Animals cleared.")
}


//Stuff to do with Synth1 modulators
var alph1 = ['A','B','C','D','E','F','G','H'];
var alph2 = ['I','J','K','L','M','N','O','P','Q'];
var alph3 = ['R','S','T','U','V','W','X','Y','Z'];
var modStringS1;
var modLetterS1;
var modNumberS1;

//Declares the json function at runtime
//$(document).ready(function(){

	//json
	function JSON(id) {
		var urlAPI = "/api/" + id
		var urlPage = "/animal/" + id
		
		var true4 = $("input[@name=select]:checked").val();
		
		console.log(true4)
		if (true4 == 4) {
			document.location.href = urlPage;
			
		
		}
		else {
			$.getJSON(urlAPI, function(data){
			
			var idActive = $("input[@name=select]:checked").attr('value');
			
			console.log("JSON loaded");
			var a = new Animal(data);
			animals[idActive] = a;
			console.log(animals[1].ge_score);
			if (idActive == 1)
				{
				modStringS1 = animals[1].species_order;
				modLetterS1 = modStringS1.substring(0,1);
				if ($.inArray(modLetterS1,alph1) != -1)
					{
					modNumberS1 = 1;
					console.log(modNumberS1);
					}
				else if ($.inArray(modLetterS1,alph2) != -1)
					{
					modNumberS1 = 2;
					console.log(modNumberS1);
					}
				else
					{
					modNumberS1 = 3;
					console.log(modNumberS1);
					}
				};
		});	
		
		
		};


	};
	
	
	//JSON('/api/105');

	
//});


//SAMPLE RATES AND BUFFER SIZE
var bufferSize = 16834; //quarter of initial
var sampleRate = 11000; //44100 initial




//messing about with noise
	//Loading white noise into buffer
	// this.n = new AudioletBuffer(1, 0);
	// console.log('buffer made')
	// this.n.load('static/staticLoop.wav', false);
	// console.log('buffer loaded')
	// this.playerN = new BufferPlayer(this.audiolet, this.n, 1, 0, 0);
	// this.triggerN = new TriggerControl(this.audiolet);
	// this.gainN = new Gain(this.audiolet, 1.00);
	// console.log('noise loaded and connected')
	
	//connecting noise buffers etc
	//this.triggerN.connect(this.playerN, 0, 1);
	//this.playerN.connect(this.gainN);
	//this.gainN.connect(this.audiolet.output);



//Scales
var DorianMode = function() {
	var degrees = [0,2,4,5,7,9,11];
	Scale.call(this, degrees); //no tuning reference so assumed Equal Temperant tuning ie piano
};
extend(DorianMode, Scale);

//playing stuff
var playing;
playing = true;

//Synths


var Synth1 = function(audiolet, frequency) {
	AudioletGroup.apply(this, [audiolet, 0, 1]);
	
	//if (playing == true)
	//{
	//Basic sine
	this.sine = new Sine(this.audiolet, frequency);
	
	//Modulator
	
	switch(modNumberS1)
	{
	case 1:
		this.modulator = new Saw(this.audiolet, frequency * 2);
		break;
	case 2:
		this.modulator = new Square(this.audiolet, frequency * 3);
		break;
	case3:
		this.modulator = new Triangle(this.audiolet, frequency * 4);
		break;
	default:
		this.modulator = new Saw(this.audiolet, frequency * 2);
	}

	

	
	
	
	this.modulatorMulAdd = new MulAdd(this.audiolet, frequency / 2,
									  frequency);
	//Gain envelope
	this.gain = new Gain(this.audiolet, 20);
	this.gain2 = new Gain(this.audiolet);
	this.envelope = new PercussiveEnvelope(this.audiolet, 1, 0.2, 0.1,
		function() {
			this.audiolet.scheduler.addRelative(0, this.remove.bind(this));
		}.bind(this)
	);
	
	
	//USE LOOPABLE WHITE NOISE INSTEAD TO SAVE ON PROCESSING
	
	//this.noise = new WhiteNoise(this.audiolet);
	
	//Bandpass filter for noise
	this.noiseHPF = new HighPassFilter(this.audiolet, 100);
	
	
	//Connecting stuff up
	//this.noise.connect(this.noiseHPF);

	
	this.modulator.connect(this.modulatorMulAdd);
	this.modulatorMulAdd.connect(this.sine);


	//this.noise.connect(this.gain2);
	
	this.envelope.connect(this.gain, 0, 1);
	this.sine.connect(this.gain);
	//if ( playing == true)
	//{
	this.gain.connect(this.outputs[0]);
	//}
	//this.gain2.connect(this.outputs[0]);
	//this.gainN.connect(this.outputs[0]);
	//}
};
extend(Synth1, AudioletGroup);

//pattern object for Synth1
var patternS1 = function(frequency, self) {
	var synth = new Synth1(self.audiolet, frequency);
	synth.connect(self.audiolet.output);
	self.triggerN.trigger.setValue(1);
}.bind(self)

function playAnimal1() {
    var AnimalPlay = function() {
	
		//var event() =  new patternS1();
	
		self = this;
	
        this.audiolet = new Audiolet(sampleRate, 2, bufferSize);
	
		//connecting noise buffers etc
		this.n = new AudioletBuffer(1, 0);
		console.log('buffer made')
		this.n.load('static/whitenoise_loop.wav', false);
		console.log('buffer loaded')
		this.playerN = new BufferPlayer(this.audiolet, this.n, 1, 0, 0);
		this.triggerN = new TriggerControl(this.audiolet);
		console.log('noise loaded and connected');
		this.triggerN.connect(this.playerN, 0, 1);
		//this.playerN.connect(this.gainN);

		var filterLevel;
		var gainLevel;
		
		var n = 5;
		
		switch(animals[1].ge_score)
		{
		case 'LC':
			filterlevel = n * 5000;
			gainLevel = 0.5/n;
			console.log('filter = 5000');
			break;
		case 'NT':
			filterLevel = n * 4000;
			gainLevel = 0.75/n;
			console.log('filter = 4000');
			break;
		case 'VU':
			filterLevel = n * 3000;
			gainLevel = 1/n;
			console.log('filter = 3000');
			break;
		case 'EN':
			filterLevel = n * 1000;
			gainLevel = 2/n;
			console.log('filter = 1000');
			break;
		case 'CR':
			filterLevel = n * 500;
			gainLevel = 5/n;
			console.log('filter = 500');
			break;
		default:
			filterLevel = n * 5000;
			gainLevel = 0.5/n;
			console.log('filter  = 5000 DEFAULTED')
		}
		this.gainN = new Gain(this.audiolet, gainLevel);
		
		this.noiseHPF = new LowPassFilter(this.audiolet, filterLevel);
		this.playerN.connect(this.noiseHPF);
		this.noiseHPF.connect(this.gainN);
		
		this.gainN.connect(this.audiolet.output);
	

		
		var scale = new DorianMode();
		
		var baseFrequency = 146; //base frequency of scale
		
		var freq1 = scale.getFrequency(1, baseFrequency, 0);
		var freq2 = scale.getFrequency(2, baseFrequency, 0);
		var freq3 = scale.getFrequency(3, baseFrequency, 0);
		var freq4 = scale.getFrequency(4, baseFrequency, 0);
		var freq5 = scale.getFrequency(5, baseFrequency, 0);
		var freq6 = scale.getFrequency(6, baseFrequency, 0);
		var freq7 = scale.getFrequency(0, baseFrequency, 1);
		var freq8 = scale.getFrequency(1, baseFrequency, 1);
		

        var melodyA = new PSequence([freq1, freq2, freq3, freq1, freq2, freq3, freq1, freq2]);
        var melodyB = new PSequence([freq1, freq3, freq5, freq8, freq6, freq7, freq5, freq8]);
        var melodyC = new PSequence([freq3, freq4, freq5, freq6, freq8, freq1, freq5, freq8]);
        var frequencyPattern = new PChoose([melodyA,melodyB,melodyC],
                                           Infinity);

        var durationPattern = new PChoose([new PSequence([5, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]),
                                           new PSequence([1, 1, 1, 1, 1, 1, 1, 1, 1]),
                                           new PSequence([1, 1, 1, 1, 1, 1, 1, 1, 1])],
                                          Infinity);

        
			this.audiolet.scheduler.play([frequencyPattern], 0.5, function(frequency){
				
				if (playing == true){
					patternS1(frequency,self);
				}
				else{
					
				}

			
			}
			);
	
			// else{
				// //stop the sound
				// this.audiolet.scheduler.play([0], 0, function(frequency){}.bind(this));
				// this.gainN.disconnect(this.audiolet.output);
			
			// }


    };

    this.animalPlay = new AnimalPlay();
};

function stopAnimals(){
	if (playing == true){
		playing = false;
	}
	else {
		playing = true;
	}

	
	//playAnimal1.animalPlay.gainN.disconnect(this.audiolet.output);

}

function playAnimal2() {
    var AnimalPlay = function() {
        this.audiolet = new Audiolet(sampleRate, 2, bufferSize);
		
		var scale = new DorianMode();
		
		var baseFrequency = 73; //base frequency of scale
		
		var freq1 = scale.getFrequency(1, baseFrequency, 0);
		var freq2 = scale.getFrequency(2, baseFrequency, 0);
		var freq3 = scale.getFrequency(3, baseFrequency, 0);
		var freq4 = scale.getFrequency(4, baseFrequency, 0);
		var freq5 = scale.getFrequency(5, baseFrequency, 0);
		var freq6 = scale.getFrequency(6, baseFrequency, 0);
		var freq7 = scale.getFrequency(0, baseFrequency, 1);
		var freq8 = scale.getFrequency(1, baseFrequency, 1);
		

        var melodyA = new PSequence([freq1, freq2, freq3, freq4, freq5, freq6, freq7, freq8, freq7, freq6, freq5, freq4, freq3, freq2]);
        var melodyB = new PSequence([freq3, freq2, freq1, freq4]);
        var melodyC = new PSequence([440, 392, 349, 330]);
        var frequencyPattern = new PChoose([melodyA],
                                           Infinity);

        var durationPattern = new PChoose([new PSequence([5, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]),
                                           new PSequence([1, 1, 1, 1, 1, 1, 1, 1, 1]),
                                           new PSequence([1, 1, 1, 1, 1, 1, 1, 1, 1])],
                                          Infinity);

        this.audiolet.scheduler.play([frequencyPattern], 1,
            function(frequency) {
                var synth = new Synth1(this.audiolet, frequency);
                synth.connect(this.audiolet.output);
            }.bind(this)
        );
    };

    this.animalPlay = new AnimalPlay();





}

function playAnimal3() {
    var AnimalPlay = function() {
        this.audiolet = new Audiolet(sampleRate, 2, bufferSize);
		
		var scale = new DorianMode();
		
		var baseFrequency = 73; //base frequency of scale
		
		var freq1 = scale.getFrequency(1, baseFrequency, 0);
		var freq2 = scale.getFrequency(2, baseFrequency, 0);
		var freq3 = scale.getFrequency(3, baseFrequency, 0);
		var freq4 = scale.getFrequency(4, baseFrequency, 0);
		var freq5 = scale.getFrequency(5, baseFrequency, 0);
		var freq6 = scale.getFrequency(6, baseFrequency, 0);
		var freq7 = scale.getFrequency(0, baseFrequency, 1);
		var freq8 = scale.getFrequency(1, baseFrequency, 1);
		

        var melodyA = new PSequence([freq1, freq2, freq3, freq4, freq5, freq6, freq7, freq8, freq7, freq6, freq5, freq4, freq3, freq2]);
        var melodyB = new PSequence([freq3, freq2, freq1, freq4]);
        var melodyC = new PSequence([440, 392, 349, 330]);
        var frequencyPattern = new PChoose([melodyA],
                                           Infinity);

        var durationPattern = new PChoose([new PSequence([5, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]),
                                           new PSequence([1, 1, 1, 1, 1, 1, 1, 1, 1]),
                                           new PSequence([1, 1, 1, 1, 1, 1, 1, 1, 1])],
                                          Infinity);

        this.audiolet.scheduler.play([frequencyPattern], 1,
            function(frequency) {
                var synth = new Synth1(this.audiolet, frequency);
                synth.connect(this.audiolet.output);
            }.bind(this)
        );
    };

    this.animalPlay = new AnimalPlay();




}

