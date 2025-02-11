import { supabase } from './supabase';
import { aiServices } from './services/ai';
import { taskIntelligence } from './services/ai/task-intelligence';
import { startLocationTracking, stopLocationTracking, getCurrentLocationPromise } from './services/geolocation';
import './style.css';

// Geolocation options
const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000, // 10 seconds
  maximumAge: 0 // Don't use cached positions
};

// Error messages for geolocation
const GEOLOCATION_ERRORS = {
  PERMISSION_DENIED: {
    message: "Location access was denied. Please enable location services in your browser settings.",
    resolution: "To fix: Click the location icon in your browser's address bar and allow access."
  },
  POSITION_UNAVAILABLE: {
    message: "Unable to determine your location. The GPS signal might be weak or unavailable.",
    resolution: "Try moving to an area with better GPS coverage or check your device's location settings."
  },
  TIMEOUT: {
    message: "Location request timed out. The server took too long to respond.",
    resolution: "Please try again. If the problem persists, try using the manual location input or map selection."
  },
  DEFAULT: {
    message: "An unknown error occurred while trying to fetch your location.",
    resolution: "Please try again or use the manual location input options."
  }
};

let tasks = [];
let bookmarks = [];
let map;
let marker;
let isMapVisible = false;
let currentFilter = 'all';
let watchId = null;
let searchTimeout = null;
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];

// Auth state management
let currentUser = null;
let isGuestMode = false;

// Map initialization function
function initMap() {
  if (map) {
    return; // Map already initialized
  }

  // Default to London coordinates
  const initialPosition = [51.5074, -0.1278];

  // Initialize the map
  map = L.map('map').setView(initialPosition, 15);

  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Add a draggable marker
  marker = L.marker(initialPosition, { draggable: true }).addTo(map);

  // Update location input when marker is dragged
  marker.on('dragend', function (event) {
    const lat = event.target.getLatLng().lat;
    const lng = event.target.getLatLng().lng;
    document.getElementById(
      'location'
    ).value = `Latitude: ${lat}, Longitude: ${lng}`;
  });

  // Add click listener on the map
  map.on('click', function (e) {
    const clickedLocation = e.latlng;
    marker.setLatLng(clickedLocation);
    const lat = clickedLocation.lat;
    const lng = clickedLocation.lng;
    document.getElementById(
      'location'
    ).value = `Latitude: ${lat}, Longitude: ${lng}`;
  });
}

async function getCurrentLocation() {
  // Check if we're using HTTPS or localhost
  if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
    showLocationError({
      message: "Geolocation requires a secure connection (HTTPS).",
      resolution: "Please access this site using HTTPS to use location features."
    });
    return;
  }

  // Check if geolocation is supported
  if (!navigator.geolocation) {
    showLocationError({
      message: "Geolocation is not supported by your browser.",
      resolution: "Please use a modern browser with geolocation support or enter your location manually."
    });
    return;
  }

  try {
    // Show loading state
    const locationInput = document.getElementById('location');
    if (locationInput) {
      locationInput.value = 'Fetching location...';
    }

    // Get current position
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        GEOLOCATION_OPTIONS
      );
    });

    // Update location input and marker
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const location = `Latitude: ${latitude}, Longitude: ${longitude}`;
    
    if (locationInput) {
      locationInput.value = location;
    }

    // Update marker if map is initialized
    if (marker && map) {
      marker.setLatLng([latitude, longitude]);
      map.setView([latitude, longitude], 15);
    }

    // Enable manual location input as fallback
    enableManualLocationInput();

  } catch (error) {
    console.error('Geolocation error:', error);
    
    // Handle specific geolocation errors
    const errorInfo = GEOLOCATION_ERRORS[error.code === 1 ? 'PERMISSION_DENIED' :
                                      error.code === 2 ? 'POSITION_UNAVAILABLE' :
                                      error.code === 3 ? 'TIMEOUT' : 'DEFAULT'];
    
    showLocationError(errorInfo);
    enableManualLocationInput();
  }
}

function showLocationError({ message, resolution }) {
  // Clear any loading state
  const locationInput = document.getElementById('location');
  if (locationInput) {
    locationInput.value = '';
  }

  // Show error message with resolution steps
  const errorMessage = `${message}\n\n${resolution}`;
  alert(errorMessage);
}

function enableManualLocationInput() {
  const locationInput = document.getElementById('location');
  if (locationInput) {
    locationInput.readOnly = false;
    locationInput.placeholder = 'Enter coordinates (e.g., Latitude: 51.5074, Longitude: -0.1278)';
  }
}

// Validate manually entered coordinates
function validateCoordinates(input) {
  const coordPattern = /^Latitude: (-?\d+(\.\d+)?), Longitude: (-?\d+(\.\d+)?)$/;
  if (!coordPattern.test(input)) {
    alert('Please enter coordinates in the format: Latitude: XX.XXXX, Longitude: YY.YYYY');
    return false;
  }
  
  const [lat, lon] = input.match(/-?\d+(\.\d+)?/g).map(Number);
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    alert('Invalid coordinates. Latitude must be between -90 and 90, and longitude between -180 and 180.');
    return false;
  }
  
  return true;
}

function toggleMap() {
  isMapVisible = !isMapVisible;
  const mapElement = document.getElementById('map');
  if (!mapElement) return;
  
  if (isMapVisible) {
    mapElement.style.display = 'block';
    initMap();
  } else {
    mapElement.style.display = 'none';
  }
}

// Task management functions
async function loadTasks() {
  if (isGuestMode || !currentUser) return;

  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    tasks = data || [];
    renderTasks();
  } catch (error) {
    console.error('Error loading tasks:', error);
    alert('Error loading tasks: ' + error.message);
  }
}

async function loadBookmarks() {
  if (isGuestMode || !currentUser) return;

  try {
    const { data, error } = await supabase
      .from('location_bookmarks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    bookmarks = data || [];
    renderBookmarks();
  } catch (error) {
    console.error('Error loading bookmarks:', error);
    alert('Error loading bookmarks: ' + error.message);
  }
}

async function addTask() {
  const taskInput = document.getElementById('task');
  const locationInput = document.getElementById('location');
  const taskText = taskInput.value.trim();
  const locationText = locationInput.value.trim();

  if (!taskText || !locationText) {
    alert('Please enter both task and location');
    return;
  }

  const [lat, lon] = locationText.match(/-?\d+\.\d+/g)?.map(Number) || [];
  if (!lat || !lon) {
    alert('Invalid location format');
    return;
  }

  try {
    // Analyze task using AI
    const taskAnalysis = await aiServices.taskIntelligence.analyzeTask(taskText, { lat, lng: lon });
    
    // Get schedule suggestion
    const scheduleSuggestion = await aiServices.scheduler.suggestSchedule(
      { task: taskText, latitude: lat, longitude: lon },
      { lat, lng: lon }
    );

    const taskData = {
      task: taskText,
      latitude: lat,
      longitude: lon,
      priority: taskAnalysis.priority,
      summary: taskAnalysis.summary,
      next_steps: taskAnalysis.nextSteps,
      suggested_time: scheduleSuggestion.suggestedTime,
      schedule_reason: scheduleSuggestion.reason
    };

    if (!isGuestMode && currentUser) {
      const { error } = await supabase
        .from('tasks')
        .insert([{
          ...taskData,
          user_id: currentUser.id
        }]);

      if (error) throw error;
      await loadTasks();
    } else {
      tasks.unshift({
        id: Date.now(),
        ...taskData,
        created_at: new Date().toISOString(),
        completed: false
      });
      renderTasks();
    }

    taskInput.value = '';
    locationInput.value = '';
  } catch (error) {
    console.error('Error adding task:', error);
    alert('Error adding task: ' + error.message);
  }
}

async function toggleTaskComplete(taskId) {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  try {
    if (!isGuestMode && currentUser) {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', taskId);

      if (error) throw error;
      await loadTasks();
    } else {
      task.completed = !task.completed;
      renderTasks();
    }
  } catch (error) {
    console.error('Error updating task:', error);
    alert('Error updating task: ' + error.message);
  }
}

async function deleteTask(taskId) {
  try {
    if (!isGuestMode && currentUser) {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      await loadTasks();
    } else {
      tasks = tasks.filter(t => t.id !== taskId);
      renderTasks();
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    alert('Error deleting task: ' + error.message);
  }
}

function filterTasks(filter) {
  currentFilter = filter;
  renderTasks();
}

function renderTasks() {
  const taskList = document.getElementById('tasks');
  if (!taskList) return;

  taskList.innerHTML = '';
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item priority-${task.priority || 'medium'}`;
    li.innerHTML = `
      <div class="task-content">
        <input type="checkbox" ${task.completed ? 'checked' : ''} 
               onchange="toggleTaskComplete('${task.id}')">
        <div class="task-details">
          <span class="task-text ${task.completed ? 'completed' : ''}">${task.task}</span>
          <span class="task-priority">Priority: ${task.priority || 'medium'}</span>
          <span class="location-text">📍 ${task.latitude.toFixed(6)}, ${task.longitude.toFixed(6)}</span>
          ${task.summary ? `
            <div class="task-summary">
              <strong>Summary:</strong> ${task.summary.brief}<br>
              <strong>Category:</strong> ${task.summary.category}
            </div>
          ` : ''}
          ${task.next_steps?.length ? `
            <div class="next-steps">
              <strong>Next Steps:</strong>
              <ul>
                ${task.next_steps.map(step => `<li>${step}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          ${task.suggested_time ? `
            <div class="schedule-suggestion">
              <strong>Suggested Time:</strong> ${task.suggested_time}<br>
              <strong>Reason:</strong> ${task.schedule_reason}
            </div>
          ` : ''}
        </div>
      </div>
      <button onclick="deleteTask('${task.id}')" class="delete-btn">Delete</button>
    `;
    taskList.appendChild(li);
  });
}

function renderBookmarks() {
  const bookmarksList = document.getElementById('bookmarks-list');
  if (!bookmarksList) return;

  bookmarksList.innerHTML = '';
  bookmarks.forEach(bookmark => {
    const li = document.createElement('li');
    li.className = 'bookmark-item';
    li.innerHTML = `
      <span>${bookmark.name}</span>
      <div class="bookmark-actions">
        <button onclick="useBookmark('${bookmark.id}')">Use</button>
        <button onclick="deleteBookmark('${bookmark.id}')">Delete</button>
      </div>
    `;
    bookmarksList.appendChild(li);
  });
}

async function addBookmark() {
  const nameInput = document.getElementById('bookmark-name');
  const locationInput = document.getElementById('location');
  if (!nameInput || !locationInput) return;

  const name = nameInput.value.trim();
  const locationText = locationInput.value.trim();

  if (!name || !locationText) {
    alert('Please enter both name and location');
    return;
  }

  const [lat, lon] = locationText.match(/-?\d+\.\d+/g)?.map(Number) || [];
  if (!lat || !lon) {
    alert('Invalid location format');
    return;
  }

  try {
    if (!isGuestMode && currentUser) {
      const { error } = await supabase
        .from('location_bookmarks')
        .insert([{
          name,
          latitude: lat,
          longitude: lon,
          user_id: currentUser.id
        }]);

      if (error) throw error;
      await loadBookmarks();
    }

    nameInput.value = '';
  } catch (error) {
    console.error('Error adding bookmark:', error);
    alert('Error adding bookmark: ' + error.message);
  }
}

async function deleteBookmark(bookmarkId) {
  try {
    if (!isGuestMode && currentUser) {
      const { error } = await supabase
        .from('location_bookmarks')
        .delete()
        .eq('id', bookmarkId);

      if (error) throw error;
      await loadBookmarks();
    }
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    alert('Error deleting bookmark: ' + error.message);
  }
}

function useBookmark(bookmarkId) {
  const bookmark = bookmarks.find(b => b.id === bookmarkId);
  if (!bookmark) return;

  const locationInput = document.getElementById('location');
  if (locationInput) {
    locationInput.value = `Latitude: ${bookmark.latitude}, Longitude: ${bookmark.longitude}`;
  }

  if (marker && map) {
    marker.setLatLng([bookmark.latitude, bookmark.longitude]);
    map.setView([bookmark.latitude, bookmark.longitude]);
  }
}

// Update location tracking to include pattern analysis
async function handleLocationUpdate(position) {
  const location = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    timestamp: position.timestamp
  };

  // Update AI location patterns
  taskIntelligence.updateLocationPattern({
    lat: location.latitude,
    lng: location.longitude,
    timestamp: location.timestamp
  });

  // Get location-based suggestions
  const suggestions = await taskIntelligence.getLocationSuggestions({
    lat: location.latitude,
    lng: location.longitude
  });

  // Show suggestions if available
  if (suggestions.length && Notification.permission === 'granted') {
    new Notification('Task Suggestions', {
      body: suggestions[0],
      icon: '/vite.svg'
    });
  }
}

function handleLocationSearch(event) {
  // Implement location search functionality
  console.log('Location search:', event.target.value);
}

function selectLocation(location) {
  // Implement location selection
  console.log('Selected location:', location);
}

function useTaskSuggestion(suggestion) {
  // Implement task suggestion usage
  console.log('Using task suggestion:', suggestion);
}

// Voice input functionality
async function toggleVoiceInput() {
  if (isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };
    
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      audioChunks = [];
      
      try {
        const command = await aiServices.analyzeVoiceCommand(audioBlob);
        processVoiceCommand(command);
      } catch (error) {
        console.error('Error processing voice command:', error);
        alert('Error processing voice command. Please try again.');
      }
    };
    
    mediaRecorder.start();
    isRecording = true;
    updateVoiceButtonState();
  } catch (error) {
    console.error('Error starting recording:', error);
    alert('Error accessing microphone. Please check your permissions.');
  }
}

function stopRecording() {
  if (mediaRecorder && isRecording) {
    mediaRecorder.stop();
    isRecording = false;
    updateVoiceButtonState();
  }
}

async function processVoiceCommand(command) {
  if (command.action === 'create' && command.task) {
    const taskInput = document.getElementById('task');
    if (taskInput) {
      taskInput.value = command.task;
    }
    
    if (command.location) {
      // Handle location from voice command
      const locationInput = document.getElementById('location');
      if (locationInput && command.location.coordinates) {
        locationInput.value = `Latitude: ${command.location.coordinates.lat}, Longitude: ${command.location.coordinates.lng}`;
      }
    }
  }
}

function updateVoiceButtonState() {
  const voiceButton = document.getElementById('voice-input-button');
  if (voiceButton) {
    voiceButton.classList.toggle('recording', isRecording);
    voiceButton.innerHTML = isRecording ? '🔴 Recording...' : '🎤 Voice Input';
  }
}

// Auth handling functions
async function handleAuth(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const authButton = document.getElementById('auth-button');
  const isSignUp = authButton.textContent === 'Sign Up';

  try {
    authButton.disabled = true;

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          alert('An account with this email already exists. Please sign in instead.');
          toggleAuthMode();
          return;
        }
        throw error;
      }

      if (data?.user) {
        alert('Registration successful! You can now sign in.');
        toggleAuthMode();
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          alert('Invalid email or password. Please try again.');
        } else {
          throw error;
        }
      }
    }
  } catch (error) {
    console.error('Auth error:', error);
    alert(error.message);
  } finally {
    authButton.disabled = false;
  }
}

function toggleAuthMode() {
  const authButton = document.getElementById('auth-button');
  const toggleButton = document.getElementById('toggle-auth');
  
  if (authButton.textContent === 'Sign In') {
    authButton.textContent = 'Sign Up';
    toggleButton.textContent = 'Switch to Sign In';
  } else {
    authButton.textContent = 'Sign In';
    toggleButton.textContent = 'Switch to Sign Up';
  }
}

function handleGuestAccess() {
  isGuestMode = true;
  showApp();
}

function handleSignOut() {
  supabase.auth.signOut().then(() => {
    currentUser = null;
    isGuestMode = false;
    tasks = [];
    bookmarks = [];
    showAuth();
  });
}

// UI functions
function showAuth() {
  const authSection = document.getElementById('auth-section');
  const appSection = document.getElementById('app-section');
  if (authSection) authSection.style.display = 'block';
  if (appSection) appSection.style.display = 'none';
}

function showApp() {
  const authSection = document.getElementById('auth-section');
  const appSection = document.getElementById('app-section');
  if (authSection) authSection.style.display = 'none';
  if (appSection) appSection.style.display = 'block';
  updateUserStatus();
}

function updateUserStatus() {
  const statusText = document.getElementById('user-status-text');
  if (!statusText) return;
  
  if (isGuestMode) {
    statusText.textContent = 'Guest Mode (tasks will not be saved)';
    statusText.classList.add('guest-mode');
  } else if (currentUser) {
    statusText.textContent = `Signed in as: ${currentUser.email}`;
    statusText.classList.remove('guest-mode');
  }
}

// Initialize function
async function init() {
  try {
    // Set up auth form event listeners
    const authForm = document.getElementById('auth-form');
    const toggleAuthBtn = document.getElementById('toggle-auth');
    const guestAccessBtn = document.getElementById('guest-access');
    const signOutBtn = document.getElementById('sign-out');
    const locationSearchInput = document.getElementById('location-search');

    if (authForm) authForm.addEventListener('submit', handleAuth);
    if (toggleAuthBtn) toggleAuthBtn.addEventListener('click', toggleAuthMode);
    if (guestAccessBtn) guestAccessBtn.addEventListener('click', handleGuestAccess);
    if (signOutBtn) signOutBtn.addEventListener('click', handleSignOut);
    if (locationSearchInput) {
      locationSearchInput.addEventListener('input', handleLocationSearch);
    }

    // Initialize voice input button
    const voiceButton = document.createElement('button');
    voiceButton.id = 'voice-input-button';
    voiceButton.className = 'voice-input-btn';
    voiceButton.innerHTML = '🎤 Voice Input';
    voiceButton.onclick = toggleVoiceInput;

    const taskForm = document.querySelector('.task-form');
    if (taskForm) {
      const inputGroup = taskForm.querySelector('.input-group');
      if (inputGroup) {
        inputGroup.appendChild(voiceButton);
      }
    }

    // Check for existing session
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;

    if (session) {
      currentUser = session.user;
      showApp();
      await Promise.all([loadTasks(), loadBookmarks()]);
      // Start location tracking when user is authenticated
      startLocationTracking();
    } else {
      showAuth();
    }

    // Set up auth state change listener
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        currentUser = session.user;
        showApp();
        await Promise.all([loadTasks(), loadBookmarks()]);
        // Start location tracking on sign in
        startLocationTracking();
      } else if (event === 'SIGNED_OUT') {
        currentUser = null;
        // Stop location tracking on sign out
        stopLocationTracking();
        showAuth();
      }
    });
  } catch (error) {
    console.error('Initialization error:', error);
    showAuth();
  }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);

// Update location input event listener
document.addEventListener('DOMContentLoaded', () => {
  const locationInput = document.getElementById('location');
  if (locationInput) {
    locationInput.addEventListener('change', (e) => {
      if (!e.target.readOnly && !validateCoordinates(e.target.value)) {
        e.target.value = '';
      }
    });
  }
});

// Make functions available globally
window.getCurrentLocation = getCurrentLocation;
window.toggleMap = toggleMap;
window.addTask = addTask;
window.toggleTaskComplete = toggleTaskComplete;
window.deleteTask = deleteTask;
window.filterTasks = filterTasks;
window.handleAuth = handleAuth;
window.toggleAuthMode = toggleAuthMode;
window.handleGuestAccess = handleGuestAccess;
window.useBookmark = useBookmark;
window.addBookmark = addBookmark;
window.deleteBookmark = deleteBookmark;
window.selectLocation = selectLocation;
window.useTaskSuggestion = useTaskSuggestion;
window.toggleVoiceInput = toggleVoiceInput;