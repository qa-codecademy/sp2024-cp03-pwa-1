tasks = []

let taskNameBox = document.getElementById('taskName');
let taskTimeBox = document.getElementById('taskTime')
let taskBox = document.getElementById('taskBox');
let addTaskButton = document.getElementById('addTaskButton');

showTasks()
//Create unique ID for the task
addTaskButton.addEventListener('click', function () {
    //let usedIds = tasks.map(a => a.id);
    if (tasks.length === 0) {
        usedIds = []
    } else {
        usedIds = tasks.map(a => a.id);
    }
    let assignedId = 0
    while (assignedId == 0) {
        let random = Math.random()
        candidateId = Math.round(random * 100)
        if (!usedIds.includes(candidateId)) {
            assignedId = candidateId
        }
    }
    console.log(`Assigned ID is: ${assignedId}, usedId length is ${usedIds.length + 1}`)
    if (taskNameBox.value === '') {
        alert('Please enter title')
    } else {
        addTask(assignedId)
    }
})
//Add task in the list
function addTask(assignedId) {
    let taskTimeEstimate = parseInt(taskTimeBox.value)
    if (Number.isInteger(taskTimeEstimate) === false) {
        alert('Please enter number')
    } else {
        let taskObject = { 'id': assignedId, 'nameOfTask': taskNameBox.value, 'time': taskTimeEstimate }
        tasks.push(taskObject)
        taskTimeBox.value = ''
        taskNameBox.value = ''
        localStorage.setItem("tasks", JSON.stringify(tasks));
        showTasks()
    }
}
//Remove
document.addEventListener('click', function (e) {
    // console.log(e.target.className)
    // console.log(e.target.className.split(' ')[0])

    if (e.target.classList.contains('removeButton')) {
        let removeId = tasks.findIndex(object => { return object.id == e.target.parentNode.id })
        console.log('Id to remove is', removeId)

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
}, false);

function showTasks() {
    let itemsFromStirage = localStorage.getItem('tasks') //string
    let tasks = JSON.parse(itemsFromStirage) //object
    // tasks = tasksLibraryItems
    // console.log(tasks)
    // console.log(tasksLibraryItems)

    taskBox.innerHTML = ''
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
            <button type="button" class="btn btn-secondary btn-sm">Set Timer</button>
            <button type="button" class="removeButton btn btn-secondary btn-sm">Remove</button>
            </div>
        </div><br/>`
    }
}

