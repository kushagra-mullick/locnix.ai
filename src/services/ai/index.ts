import { AIScheduler } from './scheduling';
import { TeamCollaboration } from './team-collaboration';
import { taskIntelligence } from './task-intelligence';
import { analyzeVoiceCommand } from './voice';

// Initialize services
const scheduler = AIScheduler.getInstance();
const teamCollaboration = TeamCollaboration.getInstance();

// Export the initialized services object
export const aiServices = {
  scheduler,
  teamCollaboration,
  taskIntelligence,
  analyzeVoiceCommand
};

// Also export individual components for flexibility
export {
  AIScheduler,
  TeamCollaboration,
  taskIntelligence,
  analyzeVoiceCommand
};