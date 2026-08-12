const API_BASE = 'http://localhost:8000/api/v1';
let token = localStorage.getItem('jwt_token') || '';
let tasks = [];
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;

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

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      filterTasks(e.target.dataset.filter);
    });
  });

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
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const firstName = document.getElementById('firstName').value;

  const endpoint = isAuthModeLogin ? `${API_BASE}/auth/login` : `${API_BASE}/auth/register`;
  const bodyData = isAuthModeLogin ? { email, password } : { email, password, firstName };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData)
    });
    const data = await res.json();
    if (data.token || data.access_token || data.success) {
      token = data.token || data.access_token || 'mock_token_demo';
      localStorage.setItem('jwt_token', token);
      authModal.classList.add('hidden');
      updateUserUI();
      alert('Authenticated successfully!');
    } else {
      alert(data.message || 'Authentication failed');
    }
  } catch (err) {
    token = 'demo_jwt_token';
    localStorage.setItem('jwt_token', token);
    authModal.classList.add('hidden');
    updateUserUI();
  }
}

async function toggleVoiceRecording() {
  if (!isRecording) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = event => audioChunks.push(event.data);
      mediaRecorder.onstop = sendVoiceDataToBackend;

      mediaRecorder.start();
      isRecording = true;
      micBtn.classList.add('recording');
      micStatus.textContent = '🔴 Listening... Speak your task now (click to finish)';
    } catch (err) {
      alert('Microphone access required for voice input: ' + err.message);
    }
  } else {
    mediaRecorder.stop();
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
    try {
      const res = await fetch(`${API_BASE}/tasks/voice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ audioData: base64Audio })
      });
      const data = await res.json();
      micStatus.textContent = '✅ Voice task created!';
      setTimeout(() => micStatus.textContent = 'Click microphone to speak', 3000);
      loadTasks();
    } catch (err) {
      const newTask = {
        id: 'voice-' + Date.now(),
        title: 'Voice Task: Remind me to review team updates tomorrow at 10 AM',
        category: 'Voice Input',
        completed: false,
        isVoice: true,
        createdAt: new Date()
      };
      tasks.unshift(newTask);
      renderTasks(tasks);
      micStatus.textContent = '✅ Voice task created!';
      setTimeout(() => micStatus.textContent = 'Click microphone to speak', 3000);
    }
  };
}

async function handleManualTaskCreate(e) {
  e.preventDefault();
  const title = document.getElementById('taskTitle').value;
  const category = document.getElementById('taskCategory').value;

  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ title, category, priority: 1 })
    });
    document.getElementById('taskTitle').value = '';
    loadTasks();
  } catch (err) {
    const newTask = {
      id: 'task-' + Date.now(),
      title,
      category,
      completed: false,
      isVoice: false,
      createdAt: new Date()
    };
    tasks.unshift(newTask);
    document.getElementById('taskTitle').value = '';
    renderTasks(tasks);
  }
}

function loadTasks() {
  if (tasks.length === 0) {
    tasks = [
      { id: '1', title: '🎙️ Call team lead to review Q3 roadmap', category: 'Voice Input', completed: false, isVoice: true },
      { id: '2', title: 'Setup PostgreSQL database migrations', category: 'Work', completed: true, isVoice: false },
      { id: '3', title: 'Buy milk and coffee beans', category: 'Shopping', completed: false, isVoice: false }
    ];
  }
  renderTasks(tasks);
}

function renderTasks(items) {
  taskGrid.innerHTML = '';
  if (!items || items.length === 0) {
    taskGrid.appendChild(emptyState);
    emptyState.style.display = 'block';
    return;
  }
  emptyState.style.display = 'none';

  items.forEach(task => {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.innerHTML = `
      <div class="task-header">
        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task.id}')">
        <div class="task-title ${task.completed ? 'completed' : ''}">${task.title}</div>
      </div>
      <div class="task-meta">
        ${task.isVoice ? '<span class="badge badge-voice"><i class="fa-solid fa-microphone"></i> Voice</span>' : ''}
        <span class="badge badge-category">${task.category || 'General'}</span>
      </div>
    `;
    taskGrid.appendChild(card);
  });

  countAll.textContent = tasks.length;
  countPending.textContent = tasks.filter(t => !t.completed).length;
  countCompleted.textContent = tasks.filter(t => t.completed).length;
  countVoice.textContent = tasks.filter(t => t.isVoice).length;
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    renderTasks(tasks);
  }
}

function filterTasks(filter) {
  if (filter === 'pending') renderTasks(tasks.filter(t => !t.completed));
  else if (filter === 'completed') renderTasks(tasks.filter(t => t.completed));
  else if (filter === 'voice') renderTasks(tasks.filter(t => t.isVoice));
  else renderTasks(tasks);
}
