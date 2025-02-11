import { AIScheduler } from './ai/scheduling';
import { TeamCollaboration } from './ai/team-collaboration';
import { taskIntelligence } from './ai/task-intelligence';
import { analyzeVoiceCommand } from './ai/voice';

// Initialize services
const scheduler = new AIScheduler();
const teamCollaboration = new TeamCollaboration();

// Export the initialized services object
export const aiServices = {
  scheduler,
  teamCollaboration,
  taskIntelligence,
  analyzeVoiceCommand
};