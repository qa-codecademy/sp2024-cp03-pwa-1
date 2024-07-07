
let currentTaskElapsedTime = 0;
let topDivActiveTask = document.getElementById('topDivActiveTask');
let timer = document.getElementById('timer');
let addTaskButton = document.getElementById('addTaskButton');
let startStopButton = document.getElementById('startStopButton');
let taskNameBox = document.getElementById('taskName');
let taskTimeBox = document.getElementById('taskTime');
let taskBox = document.getElementById('taskBox');
let currentActiveTaskId = -1;
let timerInterval;
let currentTimeInSeconds = 1500;

let beforeRefreshingPage = (e) => {
    e.preventDefault();
};

window.addEventListener("beforeunload", beforeRefreshingPage);

showTasks();

// Create task
addTaskButton.addEventListener('click', function () {
    let itemsFromStorage = localStorage.getItem('tasks');
    let tasks = JSON.parse(itemsFromStorage) || [];
    let ids = [];

    // Task Limit (1-5)
    if (tasks.length >= 5) {
        alert('You can only add up to 5 tasks.');
        return;
    }

    let taskName = taskNameBox.value.trim();
    if (taskName === '') {
        alert('Task name should not be empty.');
        return;
    }

    let pomodorosInput = taskTimeBox.value.trim();
    if (pomodorosInput === '') {
        alert('Pomodoros input should not be empty.');
        return;
    }
    if (!/^\d*\.?\d*$/.test(pomodorosInput)) {
        alert('Pomodoros input should only contain numbers.');
        return;
    }
    let pomodoros = parseFloat(pomodorosInput);
    if (pomodoros <= 0) {
        alert('Pomodoros input should be a positive number.');
        return;
    }

    let assignedId = (ids.length === 0) ? 1 : Math.max(...ids) + 1;
    let taskTimeInMinutes = (pomodoros * 25).toFixed(2);
    let taskObject = {
        'id': assignedId,
        'name': taskNameBox.value.trim(),
        'time': taskTimeInMinutes,
        'remainingTime': taskTimeInMinutes * 60,
        'elapsedTime': 0,
        'totalPomodoros': pomodoros,
        'remainingPomodoros': 0,
        'completionTime': "2024-06-03 16:00",
        'status': "deferred",
        'category': "work"
    };

    tasks.push(taskObject);
    taskTimeBox.value = '';
    taskNameBox.value = '';
    localStorage.setItem('tasks', JSON.stringify(tasks));
    showTasks();

    if (tasks.length >= 5) {
        addTaskButton.disabled = true;
    }
});

// Remove task
document.addEventListener('click', function (e) {
    let itemsFromStorage = localStorage.getItem('tasks');
    let tasks = JSON.parse(itemsFromStorage) || [];
    if (e.target.classList.contains('removeButton')) {
        let removeId = tasks.findIndex(object => { return object.id == e.target.parentNode.id });

        if (confirm('Are you sure that you want to remove the task?')) {
            tasks.splice(removeId, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            showTasks();

            if (tasks.length < 5) {
                addTaskButton.disabled = false;
            }
        }
    }
}, false);

// Set timer
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('set_timer')) {
        let itemsFromStorage = localStorage.getItem('tasks');
        let tasks = JSON.parse(itemsFromStorage) || [];

        let activeTaskId = parseInt(e.target.parentNode.parentNode.id);
        if (!isNaN(activeTaskId)) {
            let activeTask = tasks.find(task => task.id === activeTaskId);

            if (activeTask) {
                topDivActiveTask.style.display = 'block';
                topDivActiveTask.innerHTML = activeTask.name;
                currentActiveTaskId = activeTask.id;
                activeTask.remainingTime = currentTimeInSeconds;
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
        }
    }
}, false);

// Start/Pause timer
startStopButton.addEventListener('click', function (e) {
    if (e.target.innerText === 'Start') {
        localStorage.getItem("tasks")
        e.target.innerText = 'Pause';
        timerInterval = setInterval(trackAndUpdateTimer, 1000);

        if (currentActiveTaskId === -1) {
            topDivActiveTask.style.display = 'none';
        }
    } else if (e.target.innerText === 'Pause') {
        e.target.innerText = 'Start';
        clearInterval(timerInterval);

        if (currentActiveTaskId === -1) {
            topDivActiveTask.style.display = 'block';
        }
    }
});

function trackAndUpdateTimer() {
    let currentTime = timer.innerHTML;
    let [minutes, seconds] = currentTime.split(':').map(part => parseInt(part, 10));

    if (minutes === 0 && seconds === 0) {
        clearInterval(timerInterval);
        alert('Pomodoro finished. Take a break :-)');
        startStopButton.innerText = 'Start';
        timer.innerHTML = '25:00';
        currentTimeInSeconds = 1500;
        return;
    }

    seconds--;
    if (seconds < 0) {
        seconds = 59;
        minutes--;
    }

    currentTimeInSeconds = minutes * 60 + seconds;
    timer.innerHTML = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

function showTasks() {
    let itemsFromStorage = localStorage.getItem('tasks');
    let tasks = JSON.parse(itemsFromStorage) || [];
    taskBox.innerHTML = '';

    if (tasks.length > 0) {
        tasks.forEach(task => {
            let importantCheckbox = task.important ? 'checked' : '';
            taskBox.innerHTML += `
                <div id="${task.id}" class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">${task.name}</h5>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">${task.time} min</li>
                    </ul>
                    <div class="center">
                        <button type="button" class="btn btn-secondary btn-sm set_timer">Set Timer</button>
                        <button type="button" class="removeButton btn btn-secondary btn-sm">Remove</button>
                        <input type="checkbox" class="importantCheckbox" data-taskid="${task.id}" ${importantCheckbox}>
                        <label for="importantCheckbox">Mark as Important</label>
                    </div>
                </div><br/>
            `;
        });
    }

    if (tasks.length >= 5) {
        addTaskButton.disabled = true;
    } else {
        addTaskButton.disabled = false;
    }

    let importantCheckboxes = document.querySelectorAll('.importantCheckbox');
    importantCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function () {
            let taskId = parseInt(checkbox.getAttribute('data-taskid'));
            let taskToUpdate = tasks.find(task => task.id === taskId);
            if (taskToUpdate) {
                taskToUpdate.important = checkbox.checked;
                localStorage.setItem('tasks', JSON.stringify(tasks));
                showTasks();
            }
        });
    });
}






