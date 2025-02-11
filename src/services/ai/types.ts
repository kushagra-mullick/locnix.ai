export type TaskPriority = 'high' | 'medium' | 'low';

export interface TaskSummary {
  brief: string;
  keywords: string[];
  category: string;
}

export interface LocationPattern {
  visits: number;
  timeDistribution: number[];
  lastVisit: number;
  weather?: string;
  calendar?: CalendarEvent[];
}

export interface CalendarEvent {
  start: Date;
  end: Date;
  title: string;
}

export interface TeamTask {
  id: string;
  assignedTo: string[];
  location: {
    lat: number;
    lng: number;
    radius: number; // Geofence radius in meters
  };
  task: string;
  priority: TaskPriority;
}

export interface VoiceCommand {
  action: 'create' | 'complete' | 'delete' | 'update';
  taskId?: string;
  task?: string;
  context?: TaskContext;
  location?: {
    type: 'arrival' | 'departure';
    place: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  time?: Date | string;
}

export interface TaskContext {
  time?: Date;
  location?: {
    lat: number;
    lng: number;
    name?: string;
  };
  priority?: TaskPriority;
  recurring?: boolean;
  duration?: number;
}

export interface TaskScheduleSuggestion {
  taskId: string;
  suggestedTime: Date;
  reason: string;
  confidence: number;
  locationMatch: boolean;
  weatherSuitable: boolean;
  calendarFree: boolean;
}