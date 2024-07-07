
let currentTaskElapsedTime = 0
let activeTaskIdPassed
let topDivActiveTask = document.getElementById('topDivActiveTask')
let timer = document.getElementById('timer')
let addTaskButton = document.getElementById('addTaskButton')
let startStopButton = document.getElementById('startStopButton')
let taskNameBox = document.getElementById('taskName')
let taskTimeBox = document.getElementById('taskTime')
let taskDateBox = document.getElementById('taskDate')
let taskBox = document.getElementById('taskBox')
let currentActiveTaskId = -1

let beforeRefreshingPage = (e) => {
    e.preventDefault();
};

window.addEventListener("beforeunload", beforeRefreshingPage)

showTasks()
//Create task
addTaskButton.addEventListener('click', function () {
    let itemsFromStirage = localStorage.getItem('tasks') //string
    let tasks = JSON.parse(itemsFromStirage)
    ids = []
    let assignedId
    if (taskNameBox.value !== '') {
        if (taskTimeBox !== '') {
            let pomodoros = parseFloat(taskTimeBox.value)
            if (parseFloat(pomodoros) === false) {
                alert('Please enter Pomodoros')
            } else {
                if (tasks === null || tasks.length === 0) {
                    tasks = []
                    assignedId = 1
                    ids.push(assignedId)
                } else {
                    tasks.forEach(element => {
                        ids.push(element.id)
                    });
                    let maxValue = Math.max(...ids);
                    assignedId = maxValue + 1
                    ids.push(assignedId)
                }
                taskTimeInMinutes = (pomodoros * 25).toFixed(2) //convert to minutes
                let taskObject = { 'id': assignedId, 'nameOfTask': taskNameBox.value, 'time': taskTimeInMinutes, 'remainingTime': taskTimeInMinutes * 60, 'elapsedTime': 0, 'totalPomodoros': pomodoros, 'remainingPomodoros': 0 }

                tasks.push(taskObject)
                taskTimeBox.value = ''
                taskNameBox.value = ''
                localStorage.setItem("tasks", JSON.stringify(tasks))
                showTasks()
            }
        } else {
            alert('Please enter Pomodoros')
        }
    } else {
        alert('Please enter title')
    }
})


//Remove task
document.addEventListener('click', function (e) {
    let itemsFromStirage = localStorage.getItem('tasks') //string
    let tasks = JSON.parse(itemsFromStirage)
    if (e.target.classList.contains('removeButton')) {
        let removeId = tasks.findIndex(object => { return object.id == e.target.parentNode.id })

        if (confirm('Are you sure that you want to remove the task?')) {
            tasks.splice(removeId, 1)
            e.target.remove()
            localStorage.setItem("tasks", JSON.stringify(tasks));
            for (i = 0; i < tasks.length; i++) {
                console.log(`Remainng task is: ${tasks[i].nameOfTask} with time ${tasks[i].time} with id: ${tasks[i].id}`)
            }
            showTasks()
        }
    }
}, false);

//Set timer
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('set_timer')) {
        itemsFromStorage = localStorage.getItem('tasks')
        tasks = JSON.parse(itemsFromStorage)
        activeTaskId = e.target.parentNode.id
        let getActiveTaskIndex = tasks.findIndex(object => { return object.id == activeTaskId })
        let activeTask = tasks[getActiveTaskIndex] //Get specific task object

        topDivActiveTask.innerHTML = activeTask.nameOfTask
        currentActiveTaskId = activeTask.id
        let screenMinutes = '00'
        let screenSeconds = '00'

        let activeTaskRemainingTime = activeTask.remainingTime //taken task time in seconds
        if (activeTaskRemainingTime != 0) {
            if (activeTaskRemainingTime >= 1500) {
                screenMinutes = '25'
                screenSeconds = '00'
            } else if (600 <= activeTaskRemainingTime < 1500) {
                screenMinutes = `${Math.floor(activeTaskRemainingTime / 60)}`
                if (activeTaskRemainingTime % 60 < 10) {
                    screenSeconds = `0${activeTaskRemainingTime % 60}`
                } else {
                    screenSeconds = `${activeTaskRemainingTime % 60}`
                }
            } else {
                screenMinutes = `${Math.Floor(activeTaskRemainingTime / 60)}`
                if (activeTaskRemainingTime % 60 < 10) {
                    screenSeconds = `0${activeTaskRemainingTime % 60}`
                } else {
                    screenSeconds = `${activeTaskRemainingTime % 60}`
                }
            }

            timer.innerHTML = `${screenMinutes}:${screenSeconds}`
        }
    }
    showTasks()
}, false);

//Start/Pause timer
document.addEventListener('click', function (e) {
    // timeTaskIsActive = 0
    if (topDivActiveTask.innerText !== 'No Active Task') {
        if (e.target.id === 'startStopButton') {
            if (e.target.innerText === 'Start') {
                addTaskButton.hidden = true
                myInterval = setInterval(trackAndUpdateTimer, 1000)
                e.target.innerText = 'Pause'
            }
            else if (e.target.innerText === 'Pause') {
                addTaskButton.hidden = false
                clearInterval(myInterval)

                itemsFromStorage = localStorage.getItem('tasks')
                tasks = JSON.parse(itemsFromStorage)
                activeTaskId = e.target.parentNode.id
                let getActiveTaskIndex = tasks.findIndex(object => { return object.id == currentActiveTaskId })
                let activeTask = tasks[getActiveTaskIndex] //Get specific task object
                activeTaskIdPassed = activeTask
                activeTask.remainingTime = activeTask.remainingTime - currentTaskElapsedTime
                localStorage.setItem("tasks", JSON.stringify(tasks))
                currentTaskElapsedTime = 0
                e.target.innerText = 'Start'
            }
        }
    }
})

function trackAndUpdateTimer() {
    currentTaskElapsedTime++
    currentTime = timer.innerHTML
    prints = currentTime.split(':')
    minutes = prints[0]
    seconds = prints[1]
    if (minutes == 0 && seconds == 0) {
        clearInterval(myInterval)

        itemsFromStorage = localStorage.getItem('tasks')
        tasks = JSON.parse(itemsFromStorage)
        let getActiveTaskIndex = tasks.findIndex(object => { return object.id == currentActiveTaskId })
        tasks[getActiveTaskIndex].remainingTime = tasks[getActiveTaskIndex].remainingTime - currentTaskElapsedTime

        currentTaskElapsedTime = 0
        //
        if (tasks[getActiveTaskIndex].remainingTime > 0) {
            alert('Pomodoro finished. Take a break :-)')
            startStopButton.innerText = 'Start'
            timer.innerHTML = '25:00'
            topDivActiveTask.innerText = 'No Active Task'
            addTaskButton.hidden = false
            localStorage.setItem("tasks", JSON.stringify(tasks));
            showTasks()

        } else if(tasks[getActiveTaskIndex].remainingTime <= 0) {
            tasks.splice(getActiveTaskIndex, 1)

            alert('Task focus is finished. Take a break :-)')
            startStopButton.innerText = 'Start'
            timer.innerHTML = '25:00'
            topDivActiveTask.innerText = 'No Active Task'
            addTaskButton.hidden = false
            localStorage.setItem("tasks", JSON.stringify(tasks));
            showTasks()
        }
        //
    }
    seconds--
    if (seconds >= 0) {
        if (seconds < 10) {
            timer.innerHTML = `${minutes}:0${seconds}`
        } else {
            timer.innerHTML = `${minutes}:${seconds}`
        }
    } else {
        if (minutes > 0) {
            minutes--
            seconds = 59
            if (seconds < 10) {
                timer.innerHTML = `${minutes}:0${seconds}`
            } else {
                timer.innerHTML = `${minutes}:${seconds}`
            }
        }
    }
}



function showTasks() {
    let itemsFromStirage = localStorage.getItem('tasks') //string
    let tasks = JSON.parse(itemsFromStirage) //object
    taskBox.innerHTML = ''
    if (tasks) {
        for (i = 0; i < tasks.length; i++) {
            taskBox.innerHTML += `
                <div id="${tasks[i].id}" class="card ${tasks[i].id}" style="width: 18rem;">
                    <div class="card-body ${tasks[i].id}">
                        <h5 class="card-title ${tasks[i].id}">${tasks[i].nameOfTask}</h5>
                    </div>
                    <ul class="list-group list-group-flush ${tasks[i].id}">
                        <li class="list-group-item ${tasks[i].id}">${tasks[i].time} min</li>
                    </ul>
                    <div id="${tasks[i].id}" class="center">
                        <button type="button" class="btn btn-secondary btn-sm set_timer">Set Timer</button>
                        <button type="button" class="removeButton btn btn-secondary btn-sm">Remove</button>
                    </div>
                </div><br/>`
        }
    }
}