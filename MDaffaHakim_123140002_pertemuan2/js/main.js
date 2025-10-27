// main.js - File JavaScript utama untuk Personal Task Dashboard

// Class untuk mengelola Task
class Task {
    constructor(title, description, priority, deadline) {
        this.id = Date.now();
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.deadline = deadline || null;
        this.completed = false;
        this.createdAt = new Date().toISOString();
    }

    toggleComplete() {
        this.completed = !this.completed;
    }

    update({ title, description, priority, deadline }) {
        this.title = title ?? this.title;
        this.description = description ?? this.description;
        this.priority = priority ?? this.priority;
        this.deadline = deadline ?? this.deadline;
    }
}

class TaskDashboard {
    constructor() {
        this.tasks = this.loadTasks();
        this.editingTaskId = null;
        this.filter = '';
        this.sortBy = localStorage.getItem('taskSort') || 'newest';
        this.init();
    }

    init() {
        this.cache();
        this.bind();
        this.renderTasks();
        this.updateStats();
        this.updateTime();
        this.loadTheme();
        setInterval(() => this.updateTime(), 60_000);
    }

    cache() {
        this.$form = document.getElementById('taskForm');
        this.$title = document.getElementById('taskTitle');
        this.$desc = document.getElementById('taskDescription');
        this.$priority = document.getElementById('taskPriority');
        this.$deadline = document.getElementById('taskDeadline');
        this.$submit = document.getElementById('submitBtn');
        this.$list = document.getElementById('taskList');
        this.$search = document.getElementById('searchTasks');
        this.$sort = document.getElementById('sortTasks');
        this.$themeToggle = document.getElementById('themeToggle');
        // Calendar & modal/toast elements
        this.$calendar = document.getElementById('calendar');
        this.$monthLabel = document.getElementById('monthLabel');
        this.$prevMonth = document.getElementById('prevMonth');
        this.$nextMonth = document.getElementById('nextMonth');
        this.$deleteModal = document.getElementById('deleteModal');
        this.$confirmDelete = document.getElementById('confirmDelete');
        this.$cancelDelete = document.getElementById('cancelDelete');
        this.$toastContainer = document.getElementById('toastContainer');
        this.pendingDelete = null; // store pending delete {task, index}
        this.calendarDate = new Date();
    }

    bind() {
        this.$form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Event delegation for task actions
        this.$list.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-action]');
            if (!btn) return;
            const id = Number(btn.closest('.task-item').dataset.id);
            const action = btn.dataset.action;
            if (action === 'toggle') this.toggleComplete(id);
            if (action === 'edit') this.editTask(id);
            if (action === 'delete') this.softDelete(id);
        });

        this.$search.addEventListener('input', (e) => {
            this.filter = e.target.value.trim().toLowerCase();
            this.renderTasks();
        });

        this.$sort.value = this.sortBy;
        this.$sort.addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            localStorage.setItem('taskSort', this.sortBy);
            this.renderTasks();
        });

        this.$themeToggle.addEventListener('click', () => this.toggleTheme());

        // calendar navigation
        this.$prevMonth.addEventListener('click', () => { this.changeMonth(-1); });
        this.$nextMonth.addEventListener('click', () => { this.changeMonth(1); });

        // modal actions
        this.$cancelDelete.addEventListener('click', () => this.closeDeleteModal());
        this.$confirmDelete.addEventListener('click', () => this.confirmDelete());

        // click outside modal to close
        this.$deleteModal.addEventListener('click', (e) => {
            if (e.target === this.$deleteModal) this.closeDeleteModal();
        });

        // when clicking a day in calendar
        this.$calendar.addEventListener('click', (e) => {
            const dayEl = e.target.closest('.day');
            if (!dayEl) return;
            const date = dayEl.dataset.date; // yyyy-mm-dd
            if (date) this.filterByDate(date);
        });
    }

    updateTime() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('currentTime').textContent = now.toLocaleDateString('id-ID', options);
    }

    loadTasks() {
        const stored = localStorage.getItem('tasks');
        if (!stored) return [];
        try {
            const parsed = JSON.parse(stored);
            return parsed.map(t => Object.assign(new Task(), t));
        } catch (err) {
            console.error('Failed to parse tasks from storage', err);
            return [];
        }
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    handleSubmit() {
        const title = this.$title.value.trim();
        if (!title) return this.$title.focus();
        const description = this.$desc.value.trim();
        const priority = this.$priority.value;
        const deadline = this.$deadline.value || null;

        if (this.editingTaskId) {
            this.updateTask(this.editingTaskId, { title, description, priority, deadline });
            this.editingTaskId = null;
            this.$submit.textContent = 'Add Task';
        } else {
            this.addTask(title, description, priority, deadline);
        }

        this.$form.reset();
        this.$title.focus();
    }

    addTask(title, description, priority, deadline) {
        const task = new Task(title, description, priority, deadline);
        this.tasks.unshift(task);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
    }

    updateTask(id, data) {
        const task = this.tasks.find((t) => t.id === id);
        if (!task) return;
        task.update(data);
        this.saveTasks();
        this.renderTasks();
    }

    deleteTask(id) {
        const idx = this.tasks.findIndex((t) => t.id === id);
        if (idx === -1) return;
        this.pendingDelete = { task: this.tasks[idx], index: idx };
        this.openDeleteModal();
    }

    softDelete(id) {
        const idx = this.tasks.findIndex((t) => t.id === id);
        if (idx === -1) return;
        const task = this.tasks[idx];
        this.tasks.splice(idx, 1);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.showUndoToast(task, idx);
    }

    openDeleteModal() {
        this.$deleteModal.setAttribute('aria-hidden', 'false');
    }

    closeDeleteModal() {
        this.$deleteModal.setAttribute('aria-hidden', 'true');
        this.pendingDelete = null;
    }

    confirmDelete() {
        if (!this.pendingDelete) return this.closeDeleteModal();
        const { task, index } = this.pendingDelete;
        this.tasks.splice(index, 1);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.closeDeleteModal();
        this.showUndoToast(task, index);
    }

    showUndoToast(task, index) {
        const id = `toast-${Date.now()}`;
        const el = document.createElement('div');
        el.className = 'toast';
        el.id = id;
        el.innerHTML = `<div>Task deleted</div><div><button data-action="undo">Undo</button></div>`;
        this.$toastContainer.appendChild(el);

        const undoBtn = el.querySelector('button[data-action="undo"]');
        const timeout = setTimeout(() => {
            if (document.getElementById(id)) {
                el.remove();
            }
        }, 6000);

        undoBtn.addEventListener('click', () => {
            clearTimeout(timeout);
            el.remove();
            this.tasks.splice(index, 0, task);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
        });
    }

    toggleComplete(id) {
        const task = this.tasks.find((t) => t.id === id);
        if (!task) return;
        task.toggleComplete();
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
    }

    editTask(id) {
        const task = this.tasks.find((t) => t.id === id);
        if (!task) return;
        this.$title.value = task.title;
        this.$desc.value = task.description;
        this.$priority.value = task.priority;
        this.$deadline.value = task.deadline || '';
        this.$submit.textContent = 'Update Task';
        this.editingTaskId = id;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderTasks() {
        if (!this.tasks.length) {
            this.$list.innerHTML = `<div class="empty-state"><h3>No tasks yet</h3><p>Add your first task to get started.</p></div>`;
            return;
        }

        let items = this.tasks.filter((t) => {
            if (!this.filter) return true;
            return (
                t.title.toLowerCase().includes(this.filter) ||
                (t.description || '').toLowerCase().includes(this.filter)
            );
        });

        items = items.slice().sort((a, b) => {
            if (this.sortBy === 'newest') return b.id - a.id;
            if (this.sortBy === 'oldest') return a.id - b.id;
            if (this.sortBy === 'priority') {
                const order = { high: 0, medium: 1, low: 2 };
                return order[a.priority] - order[b.priority];
            }
            return 0;
        });

        this.$list.innerHTML = items.map((task) => this.taskToHtml(task)).join('');
        this.renderCalendar();
    }

    changeMonth(offset) {
        this.calendarDate.setMonth(this.calendarDate.getMonth() + offset);
        this.renderCalendar();
    }

    renderCalendar() {
        const date = new Date(this.calendarDate);
        const year = date.getFullYear();
        const month = date.getMonth();
        this.$monthLabel.textContent = date.toLocaleString('id-ID', { month: 'long', year: 'numeric' });

        const first = new Date(year, month, 1);
        const startDay = first.getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const cells = [];
        for (let i = 0; i < startDay; i++) cells.push(null);
        for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

        this.$calendar.innerHTML = cells.map((dt) => {
            if (!dt) return `<div class="day empty"></div>`;
            const y = dt.getFullYear();
            const m = String(dt.getMonth() + 1).padStart(2, '0');
            const d = String(dt.getDate()).padStart(2, '0');
            const iso = `${y}-${m}-${d}`;
            const hasTask = this.tasks.some(t => t.deadline === iso);
            return `
                <div class="day ${hasTask ? 'has-task' : ''}" data-date="${iso}">
                    <div class="date">${dt.getDate()}</div>
                </div>
            `;
        }).join('');
    }

    filterByDate(isoDate) {
        this.filter = '';
        this.$search.value = '';
        const items = this.tasks.filter(t => t.deadline === isoDate);
        if (!items.length) {
            this.$list.innerHTML = `<div class="empty-state"><h3>No tasks on ${new Date(isoDate).toLocaleDateString('id-ID')}</h3></div>`;
            return;
        }
        this.$list.innerHTML = items.map(t => this.taskToHtml(t)).join('');
    }

    taskToHtml(task) {
        const deadlineText = task.deadline ? `Due: ${new Date(task.deadline).toLocaleDateString('id-ID')}` : 'No deadline';
        return `
            <div class="task-item ${task.completed ? 'task-completed' : ''}" data-id="${task.id}">
                <div class="task-header">
                    <div class="task-title">${escapeHtml(task.title)}</div>
                    <div>
                        <span class="task-priority priority-${task.priority}">${task.priority.toUpperCase()}</span>
                    </div>
                </div>
                <div class="task-description">${escapeHtml(task.description || 'No description')}</div>
                <div class="task-meta">
                    <span>${deadlineText}</span>
                    <span>${task.completed ? '✅ Completed' : '⏳ Pending'}</span>
                </div>
                <div class="task-actions">
                    <button class="btn-complete" data-action="toggle">${task.completed ? 'Undo' : 'Complete'}</button>
                    <button class="btn-edit" data-action="edit">Edit</button>
                    <button class="btn-delete" data-action="delete">Delete</button>
                </div>
            </div>
        `;
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter((t) => t.completed).length;
        const pending = total - completed;
        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('pendingTasks').textContent = pending;
    }

    toggleTheme() {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        this.$themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    }

    loadTheme() {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') document.body.classList.add('dark');
    }
}

// small helper to escape html
function escapeHtml(str) {
    return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

// Initialize
const dashboard = new TaskDashboard();

// Async demo
const fetchUserPreferences = () =>
    new Promise((resolve) => setTimeout(() => resolve({ theme: 'default', language: 'id' }), 150));

async function initializeApp() {
    try {
        const preferences = await fetchUserPreferences();
        console.log('User preferences loaded:', preferences);
    } catch (error) {
        console.error('Error loading preferences:', error);
    }
}
initializeApp();

/* ===================================================
   🚧 Fitur Coming Soon Toast (untuk Edit Profile)
=================================================== */
const editProfileBtn = document.querySelector('.btn-ghost');
if (editProfileBtn) {
    const toast = document.createElement('div');
    toast.id = 'comingSoonToast';
    toast.textContent = '🚧 Fitur Coming Soon!';
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #16a34a, #22c55e);
        color: #fff;
        font-weight: 600;
        padding: 14px 22px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        opacity: 0;
        transform: translateY(20px);
        transition: opacity .4s ease, transform .4s ease;
        z-index: 9999;
        pointer-events: none;
    `;
    document.body.appendChild(toast);

    editProfileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
        }, 2500);
    });
}
