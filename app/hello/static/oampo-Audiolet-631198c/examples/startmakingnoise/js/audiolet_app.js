



//json
// $.getJSON("url", function(data)
// {
// data.Type
// });











//Scales
var DorianMode = function() {
	var degrees = [0,2,4,5,7,9,11];
	Scale.call(this, degrees); //no tuning reference so assumed Equal Temperant tuning ie piano
};
extend(DorianMode, Scale);

//Synths
var Synth1 = function(audiolet, frequency) {
	AudioletGroup.apply(this, [audiolet, 0, 1]);
	
	//Basic sine
	this.sine = new Sine(this.audiolet, frequency);
	
	//Modulator
	this.modulator = new Saw(this.audiolet, frequency * 2);
	this.modulatorMulAdd = new MulAdd(this.audiolet, frequency / 2,
									  frequency);
	//Gain envelope
	this.gain = new Gain(this.audiolet);
	this.gain2 = new Gain(this.audiolet);
	this.envelope = new PercussiveEnvelope(this.audiolet, 1, 0.5, 0.3,
		function() {
			this.audiolet.scheduler.addRelative(0, this.remove.bind(this));
		}.bind(this)
	);

	//Noise
	
	//USE LOOPABLE WHITE NOISE INSTEAD TO SAVE ON PROCESSING
	
	this.noise = new WhiteNoise(this.audiolet);
	//Bandpass filter for noise
	this.noiseLPF = new LowPassFilter(this.audiolet, 200);
	
	
	//Connecting stuff up
	this.noise.connect(this.noiseLPF);

	
	this.modulator.connect(this.modulatorMulAdd);
	this.modulatorMulAdd.connect(this.sine);


	this.noiseLPF.connect(this.gain2);
	
	this.envelope.connect(this.gain, 0, 1);
	this.sine.connect(this.gain);
	this.gain.connect(this.outputs[0]);
	this.gain2.connect(this.outputs[0]);
};
extend(Synth1, AudioletGroup);

function playExample() {

    var Animal1 = function() {
        this.audiolet = new Audiolet();
		
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

        this.audiolet.scheduler.play([frequencyPattern], 5,
            function(frequency) {
                var synth = new Synth1(this.audiolet, frequency);
                synth.connect(this.audiolet.output);
            }.bind(this)
        );
    };

    this.animal1 = new Animal1();
};