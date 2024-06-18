let assignedId
let timer = document.getElementById('timer')
let taskNameBox = document.getElementById('taskName');
let taskTimeBox = document.getElementById('taskTime')
let taskBox = document.getElementById('taskBox');
let addTaskButton = document.getElementById('addTaskButton');

showTasks()
//Create unique ID for the task
addTaskButton.addEventListener('click', function () {
    let itemsFromStirage = localStorage.getItem('tasks') //string
    let tasks = JSON.parse(itemsFromStirage)
    if (taskNameBox.value !== '') {
        if (taskTimeBox !== '') {
            let taskTimeEstimate = parseInt(taskTimeBox.value)
            if (Number.isInteger(taskTimeEstimate) === false) {
                alert('Please enter time in minutes')
            } else {
                if (tasks === null) {
                    tasks = []
                    assignedId = 1
                } else {
                    assignedId = tasks.length + 1
                }                
                let taskObject = { 'id': assignedId, 'nameOfTask': taskNameBox.value, 'time': taskTimeEstimate }
                tasks.push(taskObject)
                taskTimeBox.value = ''
                taskNameBox.value = ''
                localStorage.setItem("tasks", JSON.stringify(tasks))
                console.log(`Assigned ID is: ${assignedId}, tasks length is ${tasks.length}`)
                showTasks()
            }
        } else {
            alert('Please enter time in minutes')
        }
    } else {
        alert('Please enter title')
    }
})

//Remove
document.addEventListener('click', function (e) {
    let itemsFromStirage = localStorage.getItem('tasks') //string
    let tasks = JSON.parse(itemsFromStirage)
    if (e.target.classList.contains('removeButton')) {
        let removeId = tasks.findIndex(object => { return object.id == e.target.parentNode.id })
        if (confirm('Are you sure that you want to remove the task?')) {
            tasks.splice(removeId, 1)
            e.target.remove()
            localStorage.setItem("tasks", JSON.stringify(tasks));
            console.log(`There are now ${tasks.length} objects in the Array.`)
            for (i = 0; i < tasks.length; i++) {
                console.log(`Remainng task is: ${tasks[i].nameOfTask} with time ${tasks[i].time} with id: ${tasks[i].id}`)
            }
            showTasks()
        }
    }

    if (e.target.classList.contains('set_timer')) {
        let itemsFromStirage = localStorage.getItem('tasks') //string
        let tasks = JSON.parse(itemsFromStirage)
        console.log(`ID of task is ${e.target.parentNode.id}`)
        tempId = e.target.parentNode.id
        id = Number(tempId)
        let setTaskTimeId = tasks.findIndex(object => { return object.id == id })
        console.log(setTaskTimeId)
        console.log(tasks[setTaskTimeId].time)
        timer.innerText = tasks[setTaskTimeId].time
    }

}, false);

function showTasks() {
    let itemsFromStirage = localStorage.getItem('tasks') //string
    let tasks = JSON.parse(itemsFromStirage) //object
    taskBox.innerHTML = ''
    if(tasks) {
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

