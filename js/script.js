document.addEventListener('DOMContentLoaded', () => {
    const addTaskButton = document.querySelector('.add-task-button');
    const taskModal = document.getElementById('taskModal');
    const taskNameInput = document.getElementById('taskName');
    const taskDescriptionInput = document.getElementById('taskDescription');
    const taskDeadlineInput = document.getElementById('taskDeadline');
    const modalTaskInput = document.querySelector('.modal-task-input');
    const taskList = document.getElementById('task-list');
    const saveTaskButton = document.getElementById('saveTaskButton');
    const openCalendarIcon = document.getElementById('openCalendar');
    const closeModalButton = document.getElementById('closeModalButton');

    const dropdownBtn = document.getElementById('language-toggle');
    const dropdownContent = document.querySelector('.dropdown-content');
    const englishOption = dropdownContent.querySelector('[data-lang="en"]');
    const ukrainianOption = dropdownContent.querySelector('[data-lang="uk"]');

    const themeSwitch = document.querySelector('.switch input[type="checkbox"]');
    const body = document.body;

    const translations = {
        en: {
            english: 'English',
            ukrainian: 'Ukrainian',
            addNewTask: 'Add New Task',
            myTasks: 'My Tasks',
            tagline: 'Plan it. Do it. Live it.',
            taskNameLabel: 'Task Name',
            taskDescriptionLabel: 'Describe Task',
            taskDeadlineLabel: 'Deadline',
            saveButton: 'Save',
            sampleTask: 'Sample Task'
        },
        uk: {
            english: 'Англійська',
            ukrainian: 'Українська',
            addNewTask: 'Додати нове завдання',
            myTasks: 'Мої завдання',
            tagline: 'Плануй. Роби. Живи цим.',
            taskNameLabel: 'Назва завдання',
            taskDescriptionLabel: 'Опишіть завдання',
            taskDeadlineLabel: 'Дедлайн',
            saveButton: 'Зберегти',
            sampleTask: 'Приклад завдання'
        }
    };

    let currentLang = dropdownBtn.dataset.currentLang || 'en';

    function setLanguage(lang) {
        currentLang = lang;
        dropdownBtn.dataset.currentLang = lang;

        dropdownBtn.querySelector('[data-key="english"]').textContent = translations[lang].english;

        if (lang === 'en') {
            ukrainianOption.style.display = 'block';
            englishOption.style.display = 'none';
        } else {
            ukrainianOption.style.display = 'none';
            englishOption.style.display = 'block';
        }

        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.dataset.key;
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        if (modalTaskInput) {
             modalTaskInput.placeholder = (lang === 'uk' ? 'Завдання' : 'Task');
        }
        if (taskDeadlineInput) {
            taskDeadlineInput.placeholder = (lang === 'uk' ? 'Виберіть дедлайн' : 'Select a deadline');
        }
    }

    function toggleTheme() {
        body.classList.toggle('dark-theme');
        if (body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeSwitch.checked = true;
    } else {
        body.classList.remove('dark-theme');
        themeSwitch.checked = false;
    }

    setLanguage(currentLang);
    themeSwitch.addEventListener('change', toggleTheme);

    const flatpickrInstance = flatpickr(taskDeadlineInput, {
        dateFormat: "Y-m-d",
        minDate: "today",
        appendTo: taskModal,
        onOpen: function(selectedDates, dateStr, instance) {
            taskModal.style.display = 'flex';
        },
        onClose: function(selectedDates, dateStr, instance) {
        }
    });

    openCalendarIcon.addEventListener('click', () => {
        flatpickrInstance.open();
    });

    function closeAndClearModal() {
        taskModal.style.display = 'none';
        modalTaskInput.value = '';
        taskNameInput.value = '';
        taskDescriptionInput.value = '';
        taskDeadlineInput.value = '';
        flatpickrInstance.clear();
    }

    addTaskButton.addEventListener('click', () => {
        taskModal.style.display = 'flex';
        modalTaskInput.focus();
        taskDeadlineInput.value = '';
        flatpickrInstance.clear();
    });

    closeModalButton.addEventListener('click', closeAndClearModal);

    window.addEventListener('click', (event) => {
        if (event.target === taskModal && !event.target.closest('.flatpickr-calendar')) {
            closeAndClearModal();
        }
    });

    modalTaskInput.addEventListener('input', () => {
        taskNameInput.value = modalTaskInput.value;
    });

    taskNameInput.addEventListener('input', () => {
        modalTaskInput.value = taskNameInput.value;
    });

    saveTaskButton.addEventListener('click', () => {
        const taskText = taskNameInput.value.trim();
        const taskDeadline = taskDeadlineInput.value;
        if (taskText !== '') {
            const listItem = document.createElement('li');
            let deadlineDisplay = '';
            if (taskDeadline) {
                deadlineDisplay = ` <span class="task-deadline">(до ${taskDeadline})</span>`;
            }
            listItem.innerHTML = `
                <label>
                    <input type="checkbox"> <span>${taskText}</span>${deadlineDisplay}
                </label>
                <span class="material-icons delete-task">delete</span>
            `;
            taskList.appendChild(listItem);
            closeAndClearModal();
        } else {
            alert(currentLang === 'uk' ? 'Будь ласка, введіть назву завдання!' : 'Please enter a task name!');
        }
    });
    taskList.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-task')) {
            const listItem = event.target.closest('li');
            if (listItem) {
                listItem.remove();
            }
        }
    });
    dropdownBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    });
    dropdownContent.addEventListener('click', (event) => {
        event.preventDefault();
        const selectedLang = event.target.dataset.lang;
        if (selectedLang && selectedLang !== currentLang) {
            setLanguage(selectedLang);
        }
        dropdownContent.style.display = 'none';
    });
    window.addEventListener('click', (event) => {
        if (!event.target.matches('.dropbtn') && !event.target.closest('.dropdown-content')) {
            if (dropdownContent.style.display === 'block') {
                dropdownContent.style.display = 'none';
            }
        }
    });
});