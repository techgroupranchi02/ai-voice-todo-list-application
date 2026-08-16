// AI Voice Todo List Application - Client Script

const API_BASE = '/api/v1';
let token = localStorage.getItem('jwt_token') || '';
let tasks = [];
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;

// DOM Elements
const micBtn = document.getElementById('micBtn');
const micStatus = document.getElementById('micStatus');
const taskGrid = document.getElementById('taskGrid');
const emptyState = document.getElementById('emptyState');
const quickTaskForm = document.getElementById('quickTaskForm');
const authBtn = document.getElementById('authBtn');
const authModal = document.getElementById('authModal');
const closeModal = document.getElementById('closeModal');
const authForm = document.getElementById('authForm');
const toggleAuthLink = document.getElementById('toggleAuthLink');
const nameGroup = document.getElementById('nameGroup');
const modalTitle = document.getElementById('modalTitle');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const countAll = document.getElementById('countAll');
const countPending = document.getElementById('countPending');
const countCompleted = document.getElementById('countCompleted');
const countVoice = document.getElementById('countVoice');

let isAuthModeLogin = true;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateUserUI();
  setupEventListeners();
  loadTasks();
});

function setupEventListeners() {
  micBtn.addEventListener('click', toggleVoiceRecording);
  quickTaskForm.addEventListener('submit', handleManualTaskCreate);
  authBtn.addEventListener('click', () => authModal.classList.remove('hidden'));
  closeModal.addEventListener('click', () => authModal.classList.add('hidden'));
  toggleAuthLink.addEventListener('click', toggleAuthMode);
  authForm.addEventListener('submit', handleAuthSubmit);

  // Tabs filter
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      filterTasks(e.target.dataset.filter);
    });
  });

  // Search filter
  document.getElementById('searchInput').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    renderTasks(tasks.filter(t => t.title.toLowerCase().includes(query)));
  });
}

function updateUserUI() {
  if (token) {
    authBtn.innerHTML = `<i class="fa-solid fa-right-from-bracket"></i> Logout`;
    authBtn.onclick = () => {
      localStorage.removeItem('jwt_token');
      token = '';
      updateUserUI();
      loadTasks();
    };
  } else {
    authBtn.innerHTML = `<i class="fa-solid fa-user"></i> Login / Register`;
    authBtn.onclick = () => authModal.classList.remove('hidden');
  }
}

function toggleAuthMode(e) {
  e.preventDefault();
  isAuthModeLogin = !isAuthModeLogin;
  if (isAuthModeLogin) {
    modalTitle.textContent = 'Login';
    nameGroup.style.display = 'none';
    authSubmitBtn.textContent = 'Login';
    toggleAuthLink.textContent = 'Register';
  } else {
    modalTitle.textContent = 'Create Account';
    nameGroup.style.display = 'block';
    authSubmitBtn.textContent = 'Register';
    toggleAuthLink.textContent = 'Login';
  }
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const firstName = (document.getElementById('firstName')?.value || '').trim();

  const endpoint = isAuthModeLogin ? `${API_BASE}/auth/login` : `${API_BASE}/auth/register`;
  const bodyData = isAuthModeLogin 
    ? { email, password } 
    : { email, password, firstName: firstName || 'User', lastName: '' };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData)
    });
    const data = await res.json();

    if (res.ok && (data.success || data.accessToken || data.data)) {
      if (!isAuthModeLogin) {
        // Automatically perform login on registration success
        const loginRes = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const loginData = await loginRes.json();
        token = loginData.data?.accessToken || loginData.accessToken || 'demo_token';
      } else {
        token = data.data?.accessToken || data.accessToken || data.token || 'demo_token';
      }
      localStorage.setItem('jwt_token', token);
      authModal.classList.add('hidden');
      updateUserUI();
      loadTasks();
      alert(isAuthModeLogin ? 'Logged in successfully!' : 'Account registered and logged in successfully!');
    } else {
      const errMsg = data.error?.message || data.message || (Array.isArray(data.message) ? data.message.join(', ') : 'Authentication failed');
      alert(errMsg);
    }
  } catch (err) {
    console.error('Auth request error:', err);
    alert('Authentication error: ' + err.message);
  }
}

let recognition = null;
let speechTranscript = '';

async function toggleVoiceRecording() {
  if (!token) {
    authModal.classList.remove('hidden');
    alert('Please login or register to record voice tasks.');
    return;
  }

  if (!isRecording) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];
      speechTranscript = '';

      mediaRecorder.ondataavailable = event => {
        if (event.data && event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        sendVoiceDataToBackend();
      };

      // Set up browser speech recognition for real-time transcription
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          speechTranscript = currentTranscript;
          if (speechTranscript.trim()) {
            micStatus.textContent = `🔴 Listening: "${speechTranscript.trim()}"`;
          }
        };

        recognition.onerror = (event) => {
          console.warn('Speech recognition notice:', event.error);
        };

        try {
          recognition.start();
        } catch (e) {
          console.warn('Speech recognition start notice:', e);
        }
      }

      mediaRecorder.start();
      isRecording = true;
      micBtn.classList.add('recording');
      micStatus.textContent = '🔴 Listening... Speak your task now (click to finish)';
    } catch (err) {
      alert('Microphone access required for voice input: ' + err.message);
    }
  } else {
    if (recognition) {
      try {
        recognition.stop();
      } catch (e) {}
    }
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    isRecording = false;
    micBtn.classList.remove('recording');
    micStatus.textContent = '⚡ Processing voice with AI...';
  }
}

async function sendVoiceDataToBackend() {
  const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
  const reader = new FileReader();
  reader.readAsDataURL(audioBlob);
  reader.onloadend = async () => {
    const base64Audio = reader.result;
    const finalTranscript = speechTranscript ? speechTranscript.trim() : '';

    try {
      const res = await fetch(`${API_BASE}/tasks/voice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          audioData: base64Audio,
          transcript: finalTranscript || undefined,
          title: finalTranscript || undefined
        })
      });

      if (res.status === 401) {
        handleAuthExpired();
        return;
      }

      const data = await res.json();
      if (res.ok && data.success) {
        micStatus.textContent = finalTranscript ? `✅ Created: "${finalTranscript}"` : '✅ Voice task created!';
        setTimeout(() => micStatus.textContent = 'Click microphone to speak', 3500);
        await loadTasks();
      } else {
        const errMsg = data.error?.message || data.message || 'Failed to create voice task';
        alert(errMsg);
        micStatus.textContent = 'Click microphone to speak';
      }
    } catch (err) {
      console.error('Voice API error:', err);
      alert('Error creating voice task: ' + err.message);
      micStatus.textContent = 'Click microphone to speak';
    }
  };
}

async function handleManualTaskCreate(e) {
  e.preventDefault();
  if (!token) {
    authModal.classList.remove('hidden');
    alert('Please login or register to add tasks.');
    return;
  }

  const titleInput = document.getElementById('taskTitle');
  const categorySelect = document.getElementById('taskCategory');
  const title = titleInput.value.trim();
  const category = categorySelect.value;

  if (!title) return;

  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, category, priority: 1 })
    });

    if (res.status === 401) {
      handleAuthExpired();
      return;
    }

    const data = await res.json();
    if (res.ok && data.success) {
      titleInput.value = '';
      await loadTasks();
    } else {
      alert(data.error?.message || data.message || 'Failed to add task');
    }
  } catch (err) {
    console.error('Task create error:', err);
    alert('Network error while adding task: ' + err.message);
  }
}

function handleAuthExpired() {
  localStorage.removeItem('jwt_token');
  token = '';
  updateUserUI();
  authModal.classList.remove('hidden');
  alert('Your login session has expired or is invalid. Please login again.');
}

async function loadTasks() {
  if (!token) {
    tasks = [];
    renderTasks(tasks);
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.status === 401) {
      handleAuthExpired();
      return;
    }

    const data = await res.json();
    if (res.ok && data.data) {
      tasks = data.data.map(t => ({
        id: t.id,
        title: t.title,
        category: t.category || 'General',
        completed: t.completed || false,
        isVoice: t.category === 'Voice Input',
        createdAt: t.createdAt
      }));
      renderTasks(tasks);
    }
  } catch (err) {
    console.error('Failed to load tasks from server:', err);
  }
}

function renderTasks(items) {
  taskGrid.innerHTML = '';
  if (!items || items.length === 0) {
    taskGrid.appendChild(emptyState);
    emptyState.style.display = 'block';
    updateCounts();
    return;
  }
  emptyState.style.display = 'none';

  items.forEach(task => {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.innerHTML = `
      <div class="task-header">
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task.id}')">
        <div class="task-title ${task.completed ? 'completed' : ''}">${escapeHtml(task.title)}</div>
        <button class="delete-btn" onclick="deleteTask('${task.id}')" title="Delete Task">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
      <div class="task-meta">
        ${task.isVoice ? '<span class="badge badge-voice"><i class="fa-solid fa-microphone"></i> Voice</span>' : ''}
        <span class="badge badge-category">${escapeHtml(task.category || 'General')}</span>
      </div>
    `;
    taskGrid.appendChild(card);
  });

  updateCounts();
}

function updateCounts() {
  countAll.textContent = tasks.length;
  countPending.textContent = tasks.filter(t => !t.completed).length;
  countCompleted.textContent = tasks.filter(t => t.completed).length;
  countVoice.textContent = tasks.filter(t => t.isVoice).length;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

async function toggleTask(id) {
  if (!token) return;
  try {
    const res = await fetch(`${API_BASE}/tasks/${id}/toggle`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (res.status === 401) {
      handleAuthExpired();
      return;
    }
    await loadTasks();
  } catch (err) {
    console.error('Failed to toggle task:', err);
  }
}

async function deleteTask(id) {
  if (!token) return;
  if (!confirm('Are you sure you want to delete this task?')) return;
  try {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (res.status === 401) {
      handleAuthExpired();
      return;
    }
    await loadTasks();
  } catch (err) {
    console.error('Failed to delete task:', err);
  }
}

function filterTasks(filter) {
  if (filter === 'pending') renderTasks(tasks.filter(t => !t.completed));
  else if (filter === 'completed') renderTasks(tasks.filter(t => t.completed));
  else if (filter === 'voice') renderTasks(tasks.filter(t => t.isVoice));
  else renderTasks(tasks);
}
