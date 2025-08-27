document.addEventListener('DOMContentLoaded', function () {
    // Структура roadmap
    const roadmapData = [
        {
            id: 'python',
            title: 'Python',
            icon: 'fab fa-python',
            subcategories: [
                {
                    title: 'Python Fundamentals',
                    icon: 'fas fa-code',
                    tasks: [
                        'Variables and data types',
                        'Loops (for, while) and conditional statements (if, elif, else)',
                        'Functions and scope'
                    ]
                },
                {
                    title: 'Data Structures',
                    icon: 'fas fa-layer-group',
                    tasks: [
                        'Arrays, lists, tuples and sets',
                        'Stacks and queues',
                        'Dictionaries',
                        'Comprehensions',
                        'Generator expressions'
                    ]
                },
                // Остальные подкатегории для Python
            ]
        },
        {
            id: 'git',
            title: 'Version Control (Git)',
            icon: 'fab fa-git-alt',
            subcategories: [
                {
                    title: 'Setup and Configuration',
                    icon: 'fas fa-cog',
                    tasks: [
                        'init', 'clone', 'config'
                    ]
                },
                // Остальные подкатегории для Git
            ]
        },
        // Остальные категории согласно предоставленному списку
    ];

    const roadmapContainer = document.getElementById('roadmap');
    const progressBar = document.getElementById('progress');
    const progressText = document.getElementById('progress-text');
    const expandAllBtn = document.getElementById('expand-all');
    const collapseAllBtn = document.getElementById('collapse-all');
    const resetBtn = document.getElementById('reset');

    // Инициализация roadmap
    function initRoadmap() {
        roadmapContainer.innerHTML = '';
        roadmapData.forEach(category => {
            const categoryElement = createCategoryElement(category);
            roadmapContainer.appendChild(categoryElement);
        });
        updateProgress();
    }

    // Создание элемента категории
    function createCategoryElement(category) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.innerHTML = `
            <div class="category-header">
                <h2><i class="${category.icon}"></i> ${category.title}</h2>
                <span class="toggle-icon"><i class="fas fa-chevron-down"></i></span>
            </div>
            <div class="category-content"></div>
        `;

        const contentDiv = categoryDiv.querySelector('.category-content');
        category.subcategories.forEach(subcategory => {
            const subcategoryElement = createSubcategoryElement(subcategory, category.id);
            contentDiv.appendChild(subcategoryElement);
        });

        // Обработчик клика для сворачивания/разворачивания
        const header = categoryDiv.querySelector('.category-header');
        header.addEventListener('click', () => {
            contentDiv.classList.toggle('expanded');
            const icon = header.querySelector('.toggle-icon i');
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-up');
        });

        return categoryDiv;
    }

    // Создание элемента подкатегории
    function createSubcategoryElement(subcategory, categoryId) {
        const subcategoryDiv = document.createElement('div');
        subcategoryDiv.className = 'subcategory';
        subcategoryDiv.innerHTML = `
            <h3><i class="${subcategory.icon}"></i> ${subcategory.title}</h3>
            <ul class="tasks"></ul>
        `;

        const tasksList = subcategoryDiv.querySelector('.tasks');
        subcategory.tasks.forEach(task => {
            const taskElement = createTaskElement(task, categoryId, subcategory.title);
            tasksList.appendChild(taskElement);
        });

        return subcategoryDiv;
    }

    // Создание элемента задачи
    function createTaskElement(task, categoryId, subcategoryTitle) {
        const taskId = `${categoryId}-${subcategoryTitle}-${task}`.replace(/\s+/g, '-').toLowerCase();

        const taskLi = document.createElement('li');
        taskLi.className = 'task';
        taskLi.innerHTML = `
            <input type="checkbox" id="${taskId}">
            <label for="${taskId}">${task}</label>
        `;

        const checkbox = taskLi.querySelector('input');
        // Загрузка состояния из localStorage
        const isChecked = localStorage.getItem(taskId) === 'true';
        checkbox.checked = isChecked;

        // Сохранение состояния при изменении
        checkbox.addEventListener('change', () => {
            localStorage.setItem(taskId, checkbox.checked);
            updateProgress();
        });

        return taskLi;
    }

    // Обновление прогресса
    function updateProgress() {
        const totalTasks = document.querySelectorAll('.task input[type="checkbox"]').length;
        const completedTasks = document.querySelectorAll('.task input[type="checkbox"]:checked').length;
        const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${percentage}% завершено`;
    }

    // Обработчики кнопок
    expandAllBtn.addEventListener('click', () => {
        document.querySelectorAll('.category-content').forEach(content => {
            content.classList.add('expanded');
        });
        document.querySelectorAll('.toggle-icon i').forEach(icon => {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        });
    });

    collapseAllBtn.addEventListener('click', () => {
        document.querySelectorAll('.category-content').forEach(content => {
            content.classList.remove('expanded');
        });
        document.querySelectorAll('.toggle-icon i').forEach(icon => {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        });
    });

    resetBtn.addEventListener('click', () => {
        if (confirm('Вы уверены, что хотите сбросить весь прогресс? Это действие нельзя отменить.')) {
            document.querySelectorAll('.task input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
                localStorage.setItem(checkbox.id, 'false');
            });
            updateProgress();
        }
    });

    // Инициализация при загрузке
    initRoadmap();
});