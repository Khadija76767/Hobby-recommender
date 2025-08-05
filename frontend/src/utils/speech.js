// Initialize speech synthesis
let synth = null;
let voices = [];

// Initialize speech synthesis when the window loads
if (typeof window !== 'undefined') {
  synth = window.speechSynthesis;
  
  // Load voices
  const loadVoices = () => {
    voices = synth.getVoices();
  };

  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = loadVoices;
  }

  loadVoices();
}

// Get a female voice if available, otherwise return the first available voice
const getFemaleVoice = () => {
  if (!voices.length) {
    voices = synth.getVoices();
  }

  // Try to find a female voice
  const femaleVoice = voices.find(
    voice => 
      voice.name.toLowerCase().includes('female') ||
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('victoria')
  );

  return femaleVoice || voices[0];
};

// Configure and return a speech utterance
const configureUtterance = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set voice properties for a soft, friendly voice
  utterance.voice = getFemaleVoice();
  utterance.pitch = 1.2; // Slightly higher pitch
  utterance.rate = 0.9;  // Slightly slower rate
  utterance.volume = 0.8; // Slightly quieter

  return utterance;
};

// Speak text and return a promise that resolves when speech is complete
const speak = (text) => {
  return new Promise((resolve, reject) => {
    try {
      if (!synth) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Cancel any ongoing speech
      synth.cancel();

      const utterance = configureUtterance(text);

      utterance.onend = () => {
        resolve();
      };

      utterance.onerror = (event) => {
        reject(new Error('Speech synthesis error: ' + event.error));
      };

      synth.speak(utterance);
    } catch (error) {
      reject(error);
    }
  });
};

// Check if speech synthesis is supported
const isSpeechSupported = () => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

// Stop any ongoing speech
const stopSpeaking = () => {
  if (synth) {
    synth.cancel();
  }
};

export {
  speak,
  stopSpeaking,
  isSpeechSupported
}; 