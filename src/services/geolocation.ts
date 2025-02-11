import { supabase } from '../supabase';

// Configuration for geolocation
const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  maximumAge: 0, // Don't use cached positions
  timeout: 10000 // 10 seconds
};

// Distance threshold for nearby tasks (in meters)
const PROXIMITY_THRESHOLD = 500;

export interface Location {
  latitude: number;
  longitude: number;
  timestamp: number;
}

let watchId: number | null = null;
let lastLocation: Location | null = null;

/**
 * Calculate distance between two points using Haversine formula
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Check if geolocation is available and properly configured
 */
async function checkGeolocationAvailability(): Promise<void> {
  // Check if geolocation is supported
  if (!navigator.geolocation) {
    throw new Error('Geolocation is not supported by this browser. Please use a modern browser with geolocation support.');
  }

  // Check for HTTPS (except localhost)
  if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
    throw new Error('Geolocation requires a secure connection (HTTPS). Please access this site using HTTPS.');
  }

  // Check permission state
  if ('permissions' in navigator) {
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      if (result.state === 'denied') {
        throw new Error('Location access is blocked. Please reset location permissions and refresh the page.');
      }
    } catch (error) {
      console.warn('Permission API not supported, falling back to regular geolocation check');
    }
  }
}

/**
 * Handle geolocation errors with detailed messages and instructions
 */
function handleGeolocationError(error: GeolocationPositionError): never {
  let message: string;
  let resolution: string;

  switch (error.code) {
    case GeolocationPositionError.PERMISSION_DENIED:
      message = "Location access was denied. This might be due to:\n" +
                "1. Browser location permissions are blocked\n" +
                "2. Device location services are disabled\n" +
                "3. The site's permissions were previously denied";
      resolution = "To fix:\n" +
                  "1. Click the location icon in your browser's address bar and allow access\n" +
                  "2. Check your device's location settings\n" +
                  "3. Clear your browser permissions and try again";
      break;
    case GeolocationPositionError.POSITION_UNAVAILABLE:
      message = "Unable to determine your location. The GPS signal might be weak or unavailable.";
      resolution = "Please try:\n1. Moving to an area with better GPS coverage\n2. Checking your device's location settings";
      break;
    case GeolocationPositionError.TIMEOUT:
      message = "Location request timed out. The server took too long to respond.";
      resolution = "Please try again. If the problem persists, check your internet connection.";
      break;
    default:
      message = "An unknown error occurred while trying to fetch your location.";
      resolution = "Please try refreshing the page or using a different browser.";
  }

  // Log error for debugging
  console.error('Geolocation error:', {
    code: error.code,
    message: error.message,
    details: message,
    resolution: resolution
  });

  throw new Error(`${message}\n\n${resolution}`);
}

/**
 * Check for nearby tasks and trigger notifications
 */
async function checkNearbyTasks(location: Location) {
  try {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('completed', false);

    if (error) throw error;

    const nearbyTasks = tasks?.filter(task => {
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        task.latitude,
        task.longitude
      );
      return distance <= PROXIMITY_THRESHOLD;
    });

    if (nearbyTasks?.length) {
      notifyNearbyTasks(nearbyTasks);
    }
  } catch (error) {
    console.error('Error checking nearby tasks:', error);
  }
}

/**
 * Notify user about nearby tasks
 */
function notifyNearbyTasks(tasks: any[]) {
  if (!('Notification' in window)) return;

  tasks.forEach(task => {
    if (Notification.permission === 'granted') {
      new Notification('Nearby Task', {
        body: task.task,
        icon: '/vite.svg'
      });
    }
  });
}

/**
 * Start tracking location with proper error handling and checks
 */
export async function startLocationTracking() {
  try {
    // Perform all necessary checks before requesting location
    await checkGeolocationAvailability();

    // Request notification permission if needed
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }

    watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp
        };

        // Only process if location has changed significantly or enough time has passed
        if (!lastLocation || 
            calculateDistance(
              lastLocation.latitude,
              lastLocation.longitude,
              newLocation.latitude,
              newLocation.longitude
            ) > 10 || // 10 meters
            newLocation.timestamp - lastLocation.timestamp > 60000 // 1 minute
        ) {
          lastLocation = newLocation;
          checkNearbyTasks(newLocation);
        }
      },
      handleGeolocationError,
      GEOLOCATION_OPTIONS
    );
  } catch (error) {
    console.error('Failed to start location tracking:', error);
    throw error;
  }
}

/**
 * Stop tracking location
 */
export function stopLocationTracking() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
    lastLocation = null;
  }
}

/**
 * Get current location as a promise
 */
export function getCurrentLocationPromise(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser. Please use a modern browser with geolocation support.'));
      return;
    }

    // Check for HTTPS
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      reject(new Error('Geolocation requires a secure connection (HTTPS). Please access this site using HTTPS.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp
        });
      },
      handleGeolocationError,
      GEOLOCATION_OPTIONS
    );
  });
}