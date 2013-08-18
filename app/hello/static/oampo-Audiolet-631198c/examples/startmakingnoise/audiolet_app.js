//Tunings and scales stuff
var PythagoreanTuning = function() {
	var semitones = [0.90225, 2.03910, 2.94135, 4.07820,
				 4.98045, 6.11730, 7.01955, 7.92180,
				 9.05865, 9.96090, 11.09775];
	Tuning.call(this, semitones, 2);
};
extend(PythagoreanTuning, Tuning);

var PhrygianScale = function(tuning) {
	var degrees = [0, 1, 3, 5, 7, 8, 10];
	Scale.call(this, degrees, tuning);
};
extend(PhrygianScale, Scale);



function playExample() {
	var Animal1 = function() {
      this.audiolet = new Audiolet();
	  
	  //initalising tunings, scales and frequencies
	  var  tuning = new PythagoreanTuning();
	  var scale = new PhrygianScale(tuning);
	  
	  var baseFrequency = 65;
	  var octave = 1;
	  var freq1 = scale.getFrequency(0, baseFrequency, octave);
	  var freq2 = scale.getFrequency(1, baseFrequency, octave);
	  var freq3 = scale.getFrequency(2, baseFrequency, octave);
	  var freq4 = scale.getFrequency(3, baseFrequency, octave);

      var melodyA = new PSequence([freq1, freq2, freq3, freq1, freq2, freq3, freq4]);
      var melodyB = new PSequence([freq1, freq2, freq3, freq4]);
      var melodyC = new PSequence([freq3, freq2, freq1, freq2]);
      var frequencyPattern = new PChoose([melodyA],
                                         Infinity);

      var durationPattern = new PChoose([new PSequence([1, 1, 1, 2])],
                                        Infinity);

      this.audiolet.scheduler.play([frequencyPattern], .5,
          function(frequency) {
              var synth = new Synth2(this.audiolet, frequency);
              synth.connect(this.audiolet.output);
          }.bind(this)
      );
  };
	
	var Animal2 = function() {
      this.audiolet = new Audiolet();
	  
	  //initalising tunings, scales and frequencies
	  var  tuning = new PythagoreanTuning();
	  var scale = new PhrygianScale(tuning);
	  
	  var baseFrequency = 65;
	  var octave = 3;
	  var freq1 = scale.getFrequency(0, baseFrequency, octave);
	  var freq2 = scale.getFrequency(1, baseFrequency, octave);
	  var freq3 = scale.getFrequency(2, baseFrequency, octave);
	  var freq4 = scale.getFrequency(3, baseFrequency, octave);

      var melodyA = new PSequence([freq1, freq2, freq3, freq1, freq1, freq1, freq2]);
      var melodyB = new PSequence([freq1, freq2, freq3, freq4]);
      var melodyC = new PSequence([freq3, freq2, freq1, freq2]);
      var frequencyPattern = new PChoose([melodyA],
                                         Infinity);

      var durationPattern = new PChoose([new PSequence([1, 1, 1, 2])],
                                        Infinity);

      this.audiolet.scheduler.play([frequencyPattern], .5,
          function(frequency) {
              var synth = new Synth1(this.audiolet, frequency);
              synth.connect(this.audiolet.output);
          }.bind(this)
      );
  };
	
	
	var Synth1 = function(audiolet, frequency) {
	
		AudioletGroup.apply(this, [audiolet, 0, 1]);
		
        //this.audiolet = new Audiolet();
		
		//basic sine
		this.sine = new Sine(this.audiolet, frequency);
		
		//sine Saw modulator
		this.modulator = new Saw(this.audiolet, 2*frequency);
		this.modulatorMulAdd = new MulAdd(this.audiolet, frequency/2, frequency);
		
		
		

		this.gain = new Gain(this.audiolet);
		this.envelope = new PercussiveEnvelope(this.audiolet, 1, 0.1, 0.1)
			function() {
				this.audiolet.scheduler.addRelative(0, this.remove.bind(this));
			}.bind(this)
		);


		
		this.modulator.connect(this.modulatorMulAdd);
		this.modulatorMulAdd.connect(this.sine);
		this.envelope.connect(this.gain, 0, 1);
		this.sine.connect(this.gain);
		this.gain.connect(this.outputs[0]);
    };
	
	var Synth2 = function(audiolet, frequency) {
	
		AudioletGroup.apply(this, [audiolet, 0, 1]);
		
        // this.audiolet = new Audiolet();
		
		// basic sine
		this.triangle = new Triangle(this.audiolet, frequency);
		
		// Square modulator
		this.modulatorSQ1 = new Square(this.audiolet, 0.5*frequency);
		this.modulatorMulAddSQ1 = new MulAdd(this.audiolet, frequency/2, frequency);
		
		// Pulse wave modulator - doesn't work currently
		this.modulatorPW1 = new Pulse(this.audiolet, frequency, 0.5);
		this.modulatorPW1 = new Pulse(this.audiolet, frequency/10, frequency);


		this.gain = new Gain(this.audiolet);
		this.PEnvelope = new PercussiveEnvelope(this.audiolet, 1, 0.1, 0.1,
			function() {
				this.audiolet.scheduler.addRelative(0, this.remove.bind(this));
			}.bind(this)
		);


		

		// this.modulatorPW1.connect(this.modulatorMulAddPW1);
		// this.modulatorMulAddPW1.connect(this.sine);
		this.modulatorSQ1.connect(this.modulatorMulAddSQ1);
		// this.PEnvelope.connect(this.modulatorSQ1);
		this.modulatorMulAddSQ1.connect(this.triangle);
		this.PEnvelope.connect(this.gain, 0, 1);
		this.PEnvelope.connect(this.triangle)
		this.triangle.connect(this.gain);
		this.gain.connect(this.outputs[0]);
    };
	
	extend(Synth1, AudioletGroup)
	extend(Synth2, AudioletGroup)

    this.animal1 = new Animal1();
	//this.animal2 = new Animal2();
};