import { supabase } from '../../supabase';
import { calculateDistance } from '../geolocation';
import { TaskPriority, TaskSummary, LocationPattern } from './types';

// Keywords and patterns for priority analysis
const URGENCY_PATTERNS = {
  high: /\b(urgent|asap|emergency|immediate|critical)\b/i,
  medium: /\b(soon|important|priority|needed)\b/i,
  low: /\b(whenever|eventually|sometime|flexible)\b/i
};

const TIME_INDICATORS = {
  high: /\b(today|tomorrow|morning|afternoon|evening|tonight)\b/i,
  medium: /\b(this week|next week|upcoming)\b/i,
  low: /\b(next month|later|future)\b/i
};

interface TaskAnalysis {
  priority: TaskPriority;
  summary: TaskSummary;
  nextSteps: string[];
  locationRelevance: number;
}

export class TaskIntelligence {
  private static instance: TaskIntelligence;
  private locationPatterns: Map<string, LocationPattern> = new Map();
  private taskHistory: Map<string, number> = new Map();

  private constructor() {}

  public static getInstance(): TaskIntelligence {
    if (!TaskIntelligence.instance) {
      TaskIntelligence.instance = new TaskIntelligence();
    }
    return TaskIntelligence.instance;
  }

  /**
   * Analyze task and determine priority level
   */
  public async analyzeTask(taskText: string, location: { lat: number; lng: number }): Promise<TaskAnalysis> {
    const urgencyScore = this.calculateUrgencyScore(taskText);
    const locationScore = await this.calculateLocationRelevance(location);
    const timeScore = this.calculateTimeScore(taskText);

    // Weighted scoring for final priority
    const totalScore = (urgencyScore * 0.4) + (locationScore * 0.3) + (timeScore * 0.3);
    const priority = this.scoreToPriority(totalScore);

    // Generate task summary and next steps
    const summary = await this.generateTaskSummary(taskText);
    const nextSteps = await this.generateNextSteps(taskText, priority);

    return {
      priority,
      summary,
      nextSteps,
      locationRelevance: locationScore
    };
  }

  /**
   * Calculate urgency score based on text patterns
   */
  private calculateUrgencyScore(text: string): number {
    let score = 0;

    if (URGENCY_PATTERNS.high.test(text)) score += 1;
    if (URGENCY_PATTERNS.medium.test(text)) score += 0.6;
    if (URGENCY_PATTERNS.low.test(text)) score += 0.3;

    return Math.min(score, 1);
  }

  /**
   * Calculate time-based score
   */
  private calculateTimeScore(text: string): number {
    let score = 0;

    if (TIME_INDICATORS.high.test(text)) score += 1;
    if (TIME_INDICATORS.medium.test(text)) score += 0.6;
    if (TIME_INDICATORS.low.test(text)) score += 0.3;

    return Math.min(score, 1);
  }

  /**
   * Calculate location relevance score
   */
  private async calculateLocationRelevance(location: { lat: number; lng: number }): Promise<number> {
    try {
      // Get user's frequent locations
      const { data: frequentLocations } = await supabase
        .from('location_bookmarks')
        .select('*');

      if (!frequentLocations?.length) return 0.5;

      // Calculate minimum distance to any frequent location
      const minDistance = Math.min(...frequentLocations.map(loc => 
        calculateDistance(location.lat, location.lng, loc.latitude, loc.longitude)
      ));

      // Convert distance to relevance score (closer = higher score)
      return Math.max(0, 1 - (minDistance / 1000)); // 1km as reference distance
    } catch (error) {
      console.error('Error calculating location relevance:', error);
      return 0.5;
    }
  }

  /**
   * Convert numerical score to priority level
   */
  private scoreToPriority(score: number): TaskPriority {
    if (score >= 0.7) return 'high';
    if (score >= 0.4) return 'medium';
    return 'low';
  }

  /**
   * Generate a concise task summary
   */
  private async generateTaskSummary(text: string): Promise<TaskSummary> {
    const words = text.split(' ');
    const keyTerms = words.filter(word => word.length > 3);
    
    return {
      brief: text.length > 50 ? `${text.substring(0, 47)}...` : text,
      keywords: keyTerms.slice(0, 3),
      category: this.determineCategory(text)
    };
  }

  /**
   * Generate suggested next steps
   */
  private async generateNextSteps(text: string, priority: TaskPriority): Promise<string[]> {
    const steps: string[] = [];
    
    // Basic next steps based on task content and priority
    if (priority === 'high') {
      steps.push('Review task details immediately');
      steps.push('Set specific completion time');
    }

    if (text.includes('meet') || text.includes('appointment')) {
      steps.push('Confirm time and location');
      steps.push('Set reminder 1 hour before');
    }

    if (text.includes('buy') || text.includes('purchase')) {
      steps.push('Check availability and price');
      steps.push('Prepare payment method');
    }

    return steps.length ? steps : ['Review task details', 'Plan execution time'];
  }

  /**
   * Determine task category based on content
   */
  private determineCategory(text: string): string {
    const categories = {
      work: /\b(meeting|presentation|deadline|project|report|email|client)\b/i,
      personal: /\b(gym|exercise|doctor|appointment|family|friend)\b/i,
      shopping: /\b(buy|purchase|shop|store|groceries)\b/i,
      health: /\b(medicine|workout|checkup|dental|medical)\b/i
    };

    for (const [category, pattern] of Object.entries(categories)) {
      if (pattern.test(text)) return category;
    }

    return 'general';
  }

  /**
   * Update location patterns based on user movement
   */
  public updateLocationPattern(location: { lat: number; lng: number; timestamp: number }): void {
    const key = `${Math.round(location.lat * 100) / 100},${Math.round(location.lng * 100) / 100}`;
    
    const pattern = this.locationPatterns.get(key) || {
      visits: 0,
      timeDistribution: new Array(24).fill(0),
      lastVisit: 0
    };

    const hour = new Date(location.timestamp).getHours();
    pattern.visits++;
    pattern.timeDistribution[hour]++;
    pattern.lastVisit = location.timestamp;

    this.locationPatterns.set(key, pattern);
  }

  /**
   * Get location-based task suggestions
   */
  public async getLocationSuggestions(location: { lat: number; lng: number }): Promise<string[]> {
    const suggestions: string[] = [];
    const key = `${Math.round(location.lat * 100) / 100},${Math.round(location.lng * 100) / 100}`;
    const pattern = this.locationPatterns.get(key);

    if (pattern && pattern.visits > 3) {
      const hour = new Date().getHours();
      const isFrequentTime = pattern.timeDistribution[hour] > 2;

      if (isFrequentTime) {
        const { data: tasks } = await supabase
          .from('tasks')
          .select('*')
          .eq('completed', false);

        if (tasks?.length) {
          const nearbyTasks = tasks.filter(task => 
            calculateDistance(location.lat, location.lng, task.latitude, task.longitude) < 500
          );

          if (nearbyTasks.length) {
            suggestions.push(`You have ${nearbyTasks.length} tasks nearby`);
          }
        }
      }
    }

    return suggestions;
  }
}

export const taskIntelligence = TaskIntelligence.getInstance();