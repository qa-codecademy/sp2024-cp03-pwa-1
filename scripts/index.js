
let currentTaskElapsedTime = 0;
let topDivActiveTask = document.getElementById('topDivActiveTask');
let timer = document.getElementById('timer');
let addTaskButton = document.getElementById('addTaskButton');
let startStopButton = document.getElementById('startStopButton');
let taskNameBox = document.getElementById('taskName');
let taskTimeBox = document.getElementById('taskTime');
let taskBox = document.getElementById('taskBox');
let currentActiveTaskId = -1;

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

    if (taskNameBox.value !== '') {
        if (!isNaN(taskTimeBox.value) && taskTimeBox.value !== '') {
            let pomodoros = parseFloat(taskTimeBox.value);
            
            if (tasks.length === 0) {
                assignedId = 1;
                ids.push(assignedId);
            } else {
                tasks.forEach(element => {
                    ids.push(element.id);
                });
                let maxValue = Math.max(...ids);
                assignedId = maxValue + 1;
                ids.push(assignedId);
            }
    
            taskTimeInMinutes = (pomodoros * 25).toFixed(2); // convert to minutes
            let taskObject = {
                'id': assignedId,
                'nameOfTask': taskNameBox.value,
                'time': taskTimeInMinutes,
                'remainingTime': taskTimeInMinutes * 60,
                'elapsedTime': 0,
                'totalPomodoros': pomodoros,
                'remainingPomodoros': 0
            };
            tasks.push(taskObject);
            taskTimeBox.value = '';
            taskNameBox.value = '';
            localStorage.setItem("tasks", JSON.stringify(tasks));
            showTasks();
            if (tasks.length >= 5) {
                addTaskButton.disabled = true;
            }
        } else {
            alert('Please enter a valid number for Pomodoros.');
        }
    } else {
        alert('Please enter a title.');
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
                topDivActiveTask.innerHTML = activeTask.nameOfTask; //  
                currentActiveTaskId = activeTask.id;
                timer.innerHTML = '25:00'; 

                showTasks();
            }
        }
    }
}, false);

// Start/Pause timer
startStopButton.addEventListener('click', function (e) {
    if (e.target.innerText === 'Start') {
        let currentTimeOnTimer = timer.innerHTML;
        let [minutes, seconds] = currentTimeOnTimer.split(':').map(part => parseInt(part, 10));

        if (minutes === 25 && seconds === 0) {
            e.target.innerText = 'Pause';
            addTaskButton.hidden = true;
            myInterval = setInterval(trackAndUpdateTimer, 1000);
        } else {
            alert('Please set the timer before starting.');
        }
    } else if (e.target.innerText === 'Pause') {
        e.target.innerText = 'Start';
        addTaskButton.hidden = false;
        clearInterval(myInterval);
    }
});

function trackAndUpdateTimer() {
    currentTaskElapsedTime++;
    currentTime = timer.innerHTML;
    prints = currentTime.split(':');
    minutes = prints[0];
    seconds = prints[1];
    if (minutes == 0 && seconds == 0) {
        clearInterval(myInterval);

        let itemsFromStorage = localStorage.getItem('tasks');
        let tasks = JSON.parse(itemsFromStorage) || [];
        let getActiveTaskIndex = tasks.findIndex(object => { return object.id == currentActiveTaskId });

        if (getActiveTaskIndex !== -1) {
            tasks[getActiveTaskIndex].remainingTime -= currentTaskElapsedTime;
            localStorage.setItem("tasks", JSON.stringify(tasks));

            if (tasks[getActiveTaskIndex].remainingTime > 0) {
                alert('Pomodoro finished. Take a break :-)');
                startStopButton.innerText = 'Start';
                timer.innerHTML = '25:00';
                topDivActiveTask.innerText = 'No Active Task';
                addTaskButton.hidden = false;
            } else {
                tasks.splice(getActiveTaskIndex, 1);
                alert('Task focus is finished. Take a break :-)');
                startStopButton.innerText = 'Start';
                timer.innerHTML = '25:00';
                topDivActiveTask.innerText = 'No Active Task';
                addTaskButton.hidden = false;
                localStorage.setItem("tasks", JSON.stringify(tasks));
            }
        }

        currentTaskElapsedTime = 0;
        showTasks();
    }

    seconds--;
    if (seconds >= 0) {
        timer.innerHTML = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    } else {
        if (minutes > 0) {
            minutes--;
            seconds = 59;
            timer.innerHTML = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        }
    }
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
                        <h5 class="card-title">${task.nameOfTask}</h5>
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
        checkbox.addEventListener('click', function() {
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






