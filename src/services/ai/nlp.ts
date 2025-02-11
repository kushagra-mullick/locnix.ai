import { TaskContext } from './types';

// Regular expressions for parsing natural language
const timePatterns = {
  absolute: /\b(?:at|on)\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\b/i,
  relative: /\b(tomorrow|today|next week|in \d+ (?:minutes?|hours?|days?))\b/i,
  days: /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i
};

const locationPatterns = {
  at: /\bat\s+([^,.]+)/i,
  near: /\bnear\s+([^,.]+)/i,
  in: /\bin\s+([^,.]+)/i
};

export interface ProcessedTask {
  task: string;
  time?: Date;
  location?: string;
  recurring?: boolean;
  priority?: 'low' | 'medium' | 'high';
}

export async function processNaturalLanguage(input: string): Promise<ProcessedTask> {
  // Remove any special characters and normalize spacing
  const normalizedInput = input.trim().replace(/\s+/g, ' ');
  
  // Extract time information
  const time = extractTime(normalizedInput);
  
  // Extract location information
  const location = extractLocation(normalizedInput);
  
  // Extract priority and recurring information
  const priority = extractPriority(normalizedInput);
  const recurring = checkRecurring(normalizedInput);
  
  // Clean up the task text by removing extracted information
  const task = cleanTaskText(normalizedInput, time, location);
  
  return {
    task,
    time: time ? new Date(time) : undefined,
    location,
    recurring,
    priority
  };
}

function extractTime(text: string): string | null {
  // Match absolute time
  const absoluteMatch = text.match(timePatterns.absolute);
  if (absoluteMatch) {
    return parseAbsoluteTime(absoluteMatch[1]);
  }
  
  // Match relative time
  const relativeMatch = text.match(timePatterns.relative);
  if (relativeMatch) {
    return parseRelativeTime(relativeMatch[1]);
  }
  
  // Match days
  const dayMatch = text.match(timePatterns.days);
  if (dayMatch) {
    return parseDay(dayMatch[1]);
  }
  
  return null;
}

function extractLocation(text: string): string | null {
  for (const [key, pattern] of Object.entries(locationPatterns)) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  return null;
}

function extractPriority(text: string): 'low' | 'medium' | 'high' {
  if (/\b(urgent|asap|immediately)\b/i.test(text)) return 'high';
  if (/\b(important|priority)\b/i.test(text)) return 'medium';
  return 'low';
}

function checkRecurring(text: string): boolean {
  return /\b(every|daily|weekly|monthly|each)\b/i.test(text);
}

function cleanTaskText(
  text: string,
  time: string | null,
  location: string | null
): string {
  let cleaned = text;
  
  // Remove time-related phrases
  if (time) {
    cleaned = cleaned.replace(timePatterns.absolute, '')
                    .replace(timePatterns.relative, '')
                    .replace(timePatterns.days, '');
  }
  
  // Remove location-related phrases
  if (location) {
    Object.values(locationPatterns).forEach(pattern => {
      cleaned = cleaned.replace(pattern, '');
    });
  }
  
  // Remove common task creation phrases
  cleaned = cleaned.replace(/\b(remind me to|i need to|please|can you|could you)\b/gi, '');
  
  // Clean up any remaining artifacts
  return cleaned.trim().replace(/\s+/g, ' ');
}

// Helper functions for time parsing
function parseAbsoluteTime(timeStr: string): string {
  // Implementation of absolute time parsing
  return new Date().toISOString();
}

function parseRelativeTime(timeStr: string): string {
  // Implementation of relative time parsing
  return new Date().toISOString();
}

function parseDay(dayStr: string): string {
  // Implementation of day parsing
  return new Date().toISOString();
}