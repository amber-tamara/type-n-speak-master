// Init SpeachSynth API
const synth = window.speechSynthesis;

//DOM Elements
const textForm = document.querySelector("form");
const textInput = document.querySelector("#text-input");
const voiceSelect = document.querySelector("#voice-select");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector("#rate-value");
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector("#pitch-value");
const body = document.querySelector("body");
//init voices array
let voices = [];

const getVoices = () => {
  voices = synth.getVoices();

  //loop through voices and create an option for each one
  voices.forEach(voice => {
    // Create option element
    const option = document.createElement("option");
    //Fill option with voice and language
    option.textContent = voice.name + " (" + voice.lang + ")";

    // Set needed option attributes
    option.setAttribute("data-lang", voice.lang);
    option.setAttribute("data-name", voice.name);
    voiceSelect.appendChild(option);
  });
};

getVoices();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

//Speak
const speak = () => {
  // Check if speaking
  if (synth.speaking) {
    console.error("Already speaking..");
    return; //this functions gone far enough
  }
  if (textInput.value !== "") {
    // Add background animation
    body.style.background = "#141414 url(../img/wave.gif)";
    body.style.backgroundRepeat = "repeat-x"; //Repeats only horizoltly
    body.style.backgroundSize = "100% 100%"; //covers whole background
    // Get speak text
    const speakText = new SpeechSynthesisUtterance(textInput.value);
    // Speak end
    speakText.onend = e => {
      console.log("Done speaking...");
      body.style.background = "#141414";
    };
    // Speak error
    speakText.onerror = e => {
      console.error("Something went wrong");
    };

    // Selected voice
    // store the name of the voice option the user has chosen
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
      "data-name"
    );

    // Loop through voices
    voices.forEach(voice => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });

    // Set pitch and rate
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;
    //Speak
    synth.speak(speakText);
  }
};

// EVENT LISTENERS

// text form submit
textForm.addEventListener("submit", e => {
  //Is listening for a submit
  console.log(e);
  e.preventDefault(); //E has properties
  speak();
  textInput.blur(); //Blur de-selects the options, otherwise by default is stays selected.
});

// Rate value change
rate.addEventListener("change", e => (rateValue.textContent = rate.value));

// Pitch value change
pitch.addEventListener("change", e => (pitchValue.textContent = rate.value));

// Voice select change
voiceSelect.addEventListener("change", e => speak()); //Is listening for a change
