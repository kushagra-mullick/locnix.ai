import { VoiceCommand } from './types';

export async function analyzeVoiceCommand(audioBlob: Blob): Promise<VoiceCommand> {
  try {
    // Convert audio blob to base64
    const base64Audio = await blobToBase64(audioBlob);
    
    // Process audio using Web Speech API
    const transcript = await processAudioWithWebSpeech(audioBlob);
    
    // Parse the transcript
    return parseVoiceCommand(transcript);
  } catch (error) {
    console.error('Error processing voice command:', error);
    throw error;
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function processAudioWithWebSpeech(audioBlob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      resolve(transcript);
    };
    
    recognition.onerror = (event) => {
      reject(new Error(`Speech recognition error: ${event.error}`));
    };
    
    recognition.start();
  });
}

function parseVoiceCommand(transcript: string): VoiceCommand {
  const locationPattern = /(?:at|in|near|when (?:I|we) (?:reach|arrive|get to|leave)) ([\w\s]+)/i;
  const timePattern = /(?:at|by|before|after) (\d{1,2}(?::\d{2})? ?(?:am|pm)?)/i;

  const locationMatch = transcript.match(locationPattern);
  const timeMatch = transcript.match(timePattern);

  const command: VoiceCommand = {
    action: 'create',
    task: transcript
      .replace(locationPattern, '')
      .replace(timePattern, '')
      .replace(/remind me to/i, '')
      .trim()
  };

  if (locationMatch) {
    command.location = {
      type: transcript.includes('leave') ? 'departure' : 'arrival',
      place: locationMatch[1].trim()
    };
  }

  if (timeMatch) {
    command.time = parseTime(timeMatch[1]);
  }

  return command;
}

function parseTime(timeStr: string): Date {
  // Implement time parsing
  return new Date();
}