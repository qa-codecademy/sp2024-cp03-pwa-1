// Mock data for demonstration purposes
const taskData = [
    { id: 1, name: "Task 1", category: "work", status: "completed", completionTime: "2024-06-01 14:00" },
    { id: 2, name: "Task 2", category: "personal", status: "completed", completionTime: "2024-06-02 10:00" },
    { id: 3, name: "Task 3", category: "work", status: "in progress", completionTime: "2024-06-03 16:00" },
    // Add more mock tasks as needed
];

// Function to filter tasks based on selected filters
function filterTasks(tasks, filters) {
    const filtered = tasks.filter(task => {
        const matchCategory = filters.category === 'all' || task.category === filters.category;
        return matchCategory;
    });
    return filtered;
}

// Function to update the overview cards
function updateOverviewCards(tasks) {
    const totalTasks = tasks.length;
    const averageTime = totalTasks ? (totalTasks * 1.5).toFixed(1) : 0; // Mock average time calculation
    document.getElementById('total-tasks').textContent = totalTasks;
    document.getElementById('average-time').textContent = `${averageTime} hrs`;
}

// Function to update the task list
function updateTaskList(tasks) {
    const taskTableBody = document.getElementById('taskTable').querySelector('tbody');
    taskTableBody.innerHTML = '';
    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.name}</td>
            <td>${task.category}</td>
            <td>${task.status}</td>
            <td>${task.completionTime}</td>
        `;
        taskTableBody.appendChild(row);
    });
}

// Function to render the tasks over time chart
function renderTasksOverTimeChart(tasks) {
    const ctx = document.getElementById('tasksOverTimeChart').getContext('2d');
    const dates = tasks.map(task => new Date(task.completionTime).toDateString());
    const uniqueDates = [...new Set(dates)];
    const taskCounts = uniqueDates.map(date => dates.filter(d => d === date).length);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: uniqueDates,
            datasets: [{
                label: 'Tasks Completed',
                data: taskCounts,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Function to render the tasks by category chart
function renderTasksByCategoryChart(tasks) {
    const ctx = document.getElementById('tasksByCategoryChart').getContext('2d');
    const categories = tasks.map(task => task.category);
    const uniqueCategories = [...new Set(categories)];
    const taskCounts = uniqueCategories.map(category => categories.filter(cat => cat === category).length);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: uniqueCategories,
            datasets: [{
                label: 'Tasks by Category',
                data: taskCounts,
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Function to render the completion rate chart
function renderCompletionRateChart(tasks) {
    const ctx = document.getElementById('completionRateChart').getContext('2d');
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in progress').length;
    const deferredTasks = tasks.filter(task => task.status === 'deferred').length;

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Completed', 'In Progress', 'Deferred'],
            datasets: [{
                label: 'Task Status',
                data: [completedTasks, inProgressTasks, deferredTasks],
                backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Function to update all parts of the statistics tab
function updateStatistics() {
    const filters = {
        dateRange: document.getElementById('date-range').value,
        category: document.getElementById('category').value
    };

    const filteredTasks = filterTasks(taskData, filters);

    updateOverviewCards(filteredTasks);
    updateTaskList(filteredTasks);
    renderTasksOverTimeChart(filteredTasks);
    renderTasksByCategoryChart(filteredTasks);
    renderCompletionRateChart(filteredTasks);
}

// Event listeners for filters
document.getElementById('date-range').addEventListener('change', updateStatistics);
document.getElementById('category').addEventListener('change', updateStatistics);

// Initial update
updateStatistics();