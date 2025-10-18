// State Management
let tasks = [];
let editingTaskId = null;
let currentFilter = 'all';
let searchQuery = '';

// DOM Elements
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const btnAddTask = document.getElementById('btnAddTask');
const btnCloseModal = document.getElementById('btnCloseModal');
const btnCancel = document.getElementById('btnCancel');
const btnSubmit = document.getElementById('btnSubmit');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');

// Form Inputs
const inputName = document.getElementById('inputName');
const inputSubject = document.getElementById('inputSubject');
const inputDeadline = document.getElementById('inputDeadline');

// Error Messages
const errorName = document.getElementById('errorName');
const errorSubject = document.getElementById('errorSubject');
const errorDeadline = document.getElementById('errorDeadline');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSampleData();
    setupEventListeners();
    renderTasks();
    updateStatistics();
});

// Load Sample Data
function loadSampleData() {
    tasks = [
        {
            id: 1,
            name: 'Membuat ERD Database',
            subject: 'Basis Data',
            deadline: '2025-10-25',
            completed: false,
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            name: 'Laporan Praktikum Web',
            subject: 'Pemrograman Web',
            deadline: '2025-10-30',
            completed: true,
            createdAt: new Date().toISOString()
        },
        {
            id: 3,
            name: 'Implementasi Algoritma Sorting',
            subject: 'Struktur Data',
            deadline: '2025-11-05',
            completed: false,
            createdAt: new Date().toISOString()
        }
    ];
}

// Setup Event Listeners
function setupEventListeners() {
    btnAddTask.addEventListener('click', openModal);
    btnCloseModal.addEventListener('click', closeModal);
    btnCancel.addEventListener('click', closeModal);
    btnSubmit.addEventListener('click', handleSubmit);
    searchInput.addEventListener('input', handleSearch);
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilter);
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Open Modal
function openModal() {
    modal.style.display = 'flex';
    resetForm();
}

// Close Modal
function closeModal() {
    modal.style.display = 'none';
    resetForm();
    editingTaskId = null;
}

// Reset Form
function resetForm() {
    inputName.value = '';
    inputSubject.value = '';
    inputDeadline.value = '';
    
    errorName.textContent = '';
    errorSubject.textContent = '';
    errorDeadline.textContent = '';
    
    inputName.classList.remove('error');
    inputSubject.classList.remove('error');
    inputDeadline.classList.remove('error');
    
    modalTitle.textContent = 'Tambah Tugas Baru';
    btnSubmit.textContent = 'Tambah';
}

// Validate Form
function validateForm() {
    let isValid = true;
    
    // Reset errors
    errorName.textContent = '';
    errorSubject.textContent = '';
    errorDeadline.textContent = '';
    inputName.classList.remove('error');
    inputSubject.classList.remove('error');
    inputDeadline.classList.remove('error');
    
    // Validate Name
    if (!inputName.value.trim()) {
        errorName.textContent = 'Nama tugas tidak boleh kosong';
        inputName.classList.add('error');
        isValid = false;
    }
    
    // Validate Subject
    if (!inputSubject.value.trim()) {
        errorSubject.textContent = 'Mata kuliah tidak boleh kosong';
        inputSubject.classList.add('error');
        isValid = false;
    }
    
    // Validate Deadline
    if (!inputDeadline.value) {
        errorDeadline.textContent = 'Deadline harus diisi';
        inputDeadline.classList.add('error');
        isValid = false;
    } else {
        const selectedDate = new Date(inputDeadline.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            errorDeadline.textContent = 'Deadline harus tanggal yang valid (tidak boleh di masa lalu)';
            inputDeadline.classList.add('error');
            isValid = false;
        }
    }
    
    return isValid;
}

// Handle Submit
function handleSubmit() {
    if (!validateForm()) {
        return;
    }
    
    const taskData = {
        name: inputName.value.trim(),
        subject: inputSubject.value.trim(),
        deadline: inputDeadline.value
    };
    
    if (editingTaskId) {
        // Update existing task
        const taskIndex = tasks.findIndex(t => t.id === editingTaskId);
        if (taskIndex !== -1) {
            tasks[taskIndex] = {
                ...tasks[taskIndex],
                ...taskData
            };
        }
    } else {
        // Add new task
        const newTask = {
            id: Date.now(),
            ...taskData,
            completed: false,
            createdAt: new Date().toISOString()
        };
        tasks.push(newTask);
    }
    
    closeModal();
    renderTasks();
    updateStatistics();
}

// Edit Task
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    editingTaskId = id;
    inputName.value = task.name;
    inputSubject.value = task.subject;
    inputDeadline.value = task.deadline;
    
    modalTitle.textContent = 'Edit Tugas';
    btnSubmit.textContent = 'Simpan';
    modal.style.display = 'flex';
}

// Delete Task
function deleteTask(id) {
    if (confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
        updateStatistics();
    }
}

// Toggle Complete
function toggleComplete(id) {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        renderTasks();
        updateStatistics();
    }
}

// Handle Search
function handleSearch(e) {
    searchQuery = e.target.value.toLowerCase();
    renderTasks();
}

// Handle Filter
function handleFilter(e) {
    currentFilter = e.target.dataset.filter;
    
    filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    renderTasks();
}

// Filter Tasks
function getFilteredTasks() {
    return tasks.filter(task => {
        // Filter by status
        const matchesStatus = 
            currentFilter === 'all' ? true :
            currentFilter === 'completed' ? task.completed :
            currentFilter === 'pending' ? !task.completed : true;
        
        // Filter by search query
        const matchesSearch = 
            task.name.toLowerCase().includes(searchQuery) ||
            task.subject.toLowerCase().includes(searchQuery);
        
        return matchesStatus && matchesSearch;
    });
}

// Render Tasks
function renderTasks() {
    const filteredTasks = getFilteredTasks();
    
    // Update task count
    document.getElementById('taskCount').textContent = filteredTasks.length;
    
    if (filteredTasks.length === 0) {
        taskList.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    taskList.style.display = 'flex';
    emptyState.style.display = 'none';
    
    taskList.innerHTML = filteredTasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleComplete(${task.id})"></div>
            
            <div class="task-content">
                <div class="task-name">${escapeHtml(task.name)}</div>
                <div class="task-subject">📖 ${escapeHtml(task.subject)}</div>
                <div class="task-deadline">📅 Deadline: ${formatDate(task.deadline)}</div>
            </div>
            
            <div class="task-actions">
                <button class="btn-edit" onclick="editTask(${task.id})">✏️ Edit</button>
                <button class="btn-delete" onclick="deleteTask(${task.id})">🗑️ Hapus</button>
            </div>
        </div>
    `).join('');
}

// Update Statistics
function updateStatistics() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const rate = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;
    
    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = pending;
    document.getElementById('completionRate').textContent = rate + '%';
}

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('id-ID', options);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}