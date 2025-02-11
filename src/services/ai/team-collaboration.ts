import { supabase } from '../../supabase';
import { TeamTask } from './types';
import { calculateDistance } from '../geolocation';

export class TeamCollaboration {
  private static instance: TeamCollaboration;
  private activeGeofences: Map<string, TeamTask> = new Map();

  private constructor() {
    this.initializeGeofenceMonitoring();
  }

  public static getInstance(): TeamCollaboration {
    if (!TeamCollaboration.instance) {
      TeamCollaboration.instance = new TeamCollaboration();
    }
    return TeamCollaboration.instance;
  }

  public async createTeamTask(task: TeamTask): Promise<void> {
    try {
      const { error } = await supabase
        .from('team_tasks')
        .insert([task]);

      if (error) throw error;

      this.activeGeofences.set(task.id, task);
    } catch (error) {
      console.error('Error creating team task:', error);
      throw error;
    }
  }

  private initializeGeofenceMonitoring(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.watchPosition(
        (position) => this.checkGeofences(position.coords),
        (error) => console.error('Geofence monitoring error:', error),
        { enableHighAccuracy: true }
      );
    }
  }

  private async checkGeofences(coords: GeolocationCoordinates): Promise<void> {
    for (const [taskId, task] of this.activeGeofences) {
      const distance = calculateDistance(
        coords.latitude,
        coords.longitude,
        task.location.lat,
        task.location.lng
      );

      if (distance <= task.location.radius) {
        await this.notifyTeamMember(task);
      }
    }
  }

  private async notifyTeamMember(task: TeamTask): Promise<void> {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Team Task Available', {
        body: task.task,
        icon: '/vite.svg'
      });
    }
  }
}