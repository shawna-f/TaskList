//Define UI variables
const form = document.querySelector("#task-form");
const taskList = document.querySelector(".collection");  //UL element
const clearBtn = document.querySelector(".clear-tasks");  
const filter = document.querySelector("#filter");  //Filter input field (dynamic; no filter btn)
const taskInput = document.querySelector("#task"); 

//Load all event listeners (function call)
loadEventListeners();

//Load all event listeners (function code)
function loadEventListeners(){
    //DOM Load event
    document.addEventListener("DOMContentLoaded", getTasks);  //getTasks fetches from localStorage
    //Add task event
    form.addEventListener("submit", addTask);
    //Remove task event
    taskList.addEventListener("click", removeTask);
    //Clear task event
    clearBtn.addEventListener("click", clearTasks);
    filter.addEventListener("keyup", filterTasks);
}

//Get tasks from local storage
function getTasks(){
    let tasks;
    if (localStorage.getItem("tasks") === null){  //If there are no tasks, then nothing has prompted creation of the storage array yet, in which case...
        tasks = [];  //...Create an array
    }   else {
        tasks = JSON.parse(localStorage.getItem("tasks"));  //Get the array; parse back into a JavaScript object
    }

    //Generate the display elements for each task
    tasks.forEach(function(task){ 
        //Create li element
        const li = document.createElement("li");
        //Add a classname
        li.className = "collection-item";
        //Create a text node; append it to the li 
        li.appendChild(document.createTextNode(task));  
        //Create link element for deleting the task 
        const link = document.createElement("a");
        //Add classes
        link.className = "delete-item secondary-content";
        //Turn the delete link into an icon
        link.innerHTML = "<i class='fa fa-remove'></li>";
        //Append the new iconized link to the li
        li.appendChild(link);
        //Append the li to the ul
        taskList.appendChild(li);
    });
}

//Add task (function code)
function addTask(e) {  
    if(taskInput.value === "") { 
        alert("Please type in a task"); 
    }

    //Create li element
    const li = document.createElement("li");
    //Add a classname
    li.className = "collection-item";
    //Create a text node; append it to the li
    li.appendChild(document.createTextNode(taskInput.value));
    //Create link element for deleting the task
    const link = document.createElement("a");
    //Add classes
    link.className = "delete-item secondary-content";
    //Turn the delete link into an icon
    link.innerHTML = "<i class='fa fa-remove'></li>";
    //Append the new iconized link to the li
    li.appendChild(link);
    //Append the li to the ul
    taskList.appendChild(li);

    //Store in local storage (function call)
    storeTaskInLocalStorage(taskInput.value);

    //Clear input field for fresh text
    taskInput.value = "";

    //Prevent default submit event behavior, which would reload the page
    e.preventDefault();
}

//Store inputted task in local storage (function code)
function storeTaskInLocalStorage(task){ 
    let tasks;  
    if(localStorage.getItem("tasks") === null){  
        tasks = [];  
    } else {  
        tasks = JSON.parse(localStorage.getItem("tasks"));  
    }

    //Push new method on to array for storage
    tasks.push(task);

    //Parse array into strings (JSON)
    localStorage.setItem("tasks", JSON.stringify(tasks));    
}

//Remove task (function code)
function removeTask(e) {
    ///Target of event is icon; get parent of parent to target li element
    if(e.target.parentElement.classList.contains("delete-item")) {  //Condition confirms whether we have correct element
        if(confirm("Are you sure?")) { 
            e.target.parentElement.parentElement.remove();

            //Remove task from local storage (function call)
            removeTaskFromLocalStorage(e.target.parentElement.parentElement);
        }
    }
}

//Remove from local storage (function code)
function removeTaskFromLocalStorage(taskItem){
    let tasks;
    if(localStorage.getItem("tasks") === null){
        tasks = [];
    } else { 
        tasks = JSON.parse(localStorage.getItem("tasks"));
    }

    //Iterate through array to find item to be deleted
    tasks.forEach(function(task, index){ 
        if(taskItem.textContent === task){  //Comparing an array task with task to be deleted
            tasks.splice(index, 1);  //If matching, then get array task index & splice out.
        }
    });

    //Set remaining items back into local storage
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//Clear tasks button (function code)
function clearTasks() {
    while(taskList.firstChild) {  //Will evaluate to true as long as there is still at least one task in the list
        taskList.removeChild(taskList.firstChild);
    }

    //Clear tasks from local storage (function call)
    clearTasksFromLocalStorage();
}

//Clear tasks from local storage (function code)
function clearTasksFromLocalStorage(){
    localStorage.clear(); 
}

//Filter tasks (function code)
function filterTasks(e) {
    const text = e.target.value.toLowerCase();  //Target is filter input field; input will be converted to lowercase to avoid case matching issues
    
    //Loop through nodelist to determine if filter criteria matches any tasks
    document.querySelectorAll(".collection-item").forEach(function(task){  
        const item = task.firstChild.textContent;
        if(item.toLowerCase().indexOf(text) != -1) {  //Convert existing tasks to lowercase to avert case matching issues
            task.style.display = "block";
        } else {
            task.style.display = "none";
        }
    });
}
