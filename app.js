//Define UI variables
const form = document.querySelector("#task-form");  //Form that holds our input field and add task btn
const taskList = document.querySelector(".collection");  //Our ul list
const clearBtn = document.querySelector(".clear-tasks");  
const filter = document.querySelector("#filter");  //Filter input field (dynamic; no filter btn)
const taskInput = document.querySelector("#task"); 

//Load all event listeners function call
loadEventListeners();

//Load all event listeners function code
function loadEventListeners(){
    //DOM Load event; will fire off as soon as the DOM is loaded
    document.addEventListener("DOMContentLoaded", getTasks);  //When DOM is loaded, getTasks from localStorage
    //Add task event
    form.addEventListener("submit", addTask);  //Submit-type event listener on form; addTask function call
    //Remove task event
    taskList.addEventListener("click", removeTask);  //Remove-type event listener on ul list; removeTask function call
    //Clear task event
    clearBtn.addEventListener("click", clearTasks);
    filter.addEventListener("keyup", filterTasks);
}

//Get tasks from local storage upon DOM load (Function code)
function getTasks(){
    let tasks;
    if (localStorage.getItem("tasks") === null){  //If there are no items, and therefor no array...
        tasks = [];  //...Create an array
    }   else {
        tasks = JSON.parse(localStorage.getItem("tasks"));  //Get all items from array; parse back into original form
    }

    //If there are items to fetch, we will need to create their li elements in order to display them in the UI, just like we did with the addTask function. We will use a forEach to perform each element's recreation.
    tasks.forEach(function(task){  //Pass in task as our iterator variable; it will hold our value each loop
        //Create li element
        const li = document.createElement("li");
        //Add the collection-item classname to newly created li element
        li.className = "collection-item";
        //Create a text node to display the text value and then append it to the li 
        li.appendChild(document.createTextNode(task));  //Pass in the source of the text value
        //Create the link element for deleting the task
        const link = document.createElement("a");
        //Add deletion link element classes
        link.className = "delete-item secondary-content";
        //Add the HTML for the deletion icon (i.e. turn the link into an icon)
        link.innerHTML = "<i class='fa fa-remove'></li>";
        //Append the new iconized link to the li
        li.appendChild(link);
        //Append the li to the ul
        taskList.appendChild(li);
    });
}

//Add task function code
function addTask(e) {  //Passing in event object
    if(taskInput.value === "") { 
        alert("Add a task");
    }

    //Create li element
    const li = document.createElement("li");
    //Add the collection-item classname to newly created li element
    li.className = "collection-item";
    //Create a text node to display our input value and then append it to the li 
    li.appendChild(document.createTextNode(taskInput.value));
    //Create the link element for deleting the task
    const link = document.createElement("a");
    //Add deletion link element classes
    link.className = "delete-item secondary-content";
    //Add the HTML for the deletion icon (i.e. turn the link into an icon)
    link.innerHTML = "<i class='fa fa-remove'></li>";
    //Append the new iconized link to the li
    li.appendChild(link);

    //Append the li to the ul
    taskList.appendChild(li);

    //Store in local storage (function call)
    storeTaskInLocalStorage(taskInput.value);  //Passing in value to store

    //Clear input field for fresh text
    taskInput.value = "";


    //Prevent the default behavior of the submit event, which would reload the page
    e.preventDefault();
}

//Store inputted task in local storage (function code)
function storeTaskInLocalStorage(task){  //Pass in our function variable
    let tasks;  //Use our function variable
    if(localStorage.getItem("tasks") === null){  //Check if at least one task has already been stored, if not...
        tasks = [];  //...then create the array for storing tasks
    } else {  //If array is holding at least one item, then it obviously already exists, so...
        tasks = JSON.parse(localStorage.getItem("tasks"));  //Get array of name "tasks"; parse items back into regular form from strings
    }

    //Use push method to insert new task into array
    tasks.push(task);

    //Parsing tasks array back into strings & setting in local storage
    localStorage.setItem("tasks", JSON.stringify(tasks));
    //Note that the above passes "tasks" in first as a string because we're specifying what the object will be called in local storage, and then the second use of tasks is passed in as a variable because it is the actual array of values we want parsed before the storage occurs. Normally they would both be in quotes as follows: localStorage.setItem('myCat', 'Tom');
}

//Remove task function code
function removeTask(e) {
    //Target of click event should be the icon; parent should be link element. Use if statement to confirm the right element is selected, then use get parent of parent to target li element  
    if(e.target.parentElement.classList.contains("delete-item")) {  //Condition confirms whether we have correct target
        if(confirm("Are you sure?")) {  //Asks the user if they are certain they want to remove the task from the list
            e.target.parentElement.parentElement.remove();

            //Remove task from local storage as well
            removeTaskFromLocalStorage(e.target.parentElement.parentElement);
        }
    }
}

//Remove from local storage
function removeTaskFromLocalStorage(taskItem){
    let tasks;
    if(localStorage.getItem("tasks") === null){  //Check if at least one task has already been stored, if not...
        tasks = [];  //...then create the array for storing tasks
    } else {  //If array is holding at least one item, then it obviously already exists, so...
        tasks = JSON.parse(localStorage.getItem("tasks"));  //Get array of name "tasks"; parse items back into regular form from strings so we can find the thing to delete
    }

    //Create forEach loop for iterating through array until item to delete is found
    tasks.forEach(function(task, index){  //Task holds an item from the array each loop; index holds item's location
        if(taskItem.textContent === task){  //Comparing text of taskItem to delete with that of current item in task
            tasks.splice(index, 1);  //If matching, then we have the right one. Get its index & splice item out.
        }
    });

    //Now set remaining items back into local storage
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//Clear tasks function code
function clearTasks() {
    while(taskList.firstChild) {  //Will evaluate to true as long as there is still at least one task in the list
        taskList.removeChild(taskList.firstChild);
    }

    //Clear tasks from local storage (function call)
    clearTasksFromLocalStorage();
}

//Clear tasks from local storage (function code)
function clearTasksFromLocalStorage(){
    localStorage.clear();  //Call the clear method on the localStorage object
}

//Filter tasks function code
function filterTasks(e) {
    const text = e.target.value.toLowerCase();  //Target is filter input field; keys typed will be captured in variable "text". Is converted to lowercase to avert case matching issues
    
    //Get all items as node list and loop through using forEach to find if filter criteria matches any
    document.querySelectorAll(".collection-item").forEach(function(task){ //Passing in anon. function & iterator var 
        const item = task.firstChild.textContent;
        if(item.toLowerCase().indexOf(text) != -1) {  //Convert items to lowercase to avert case matching issues
            task.style.display = "block";
        } else {
            task.style.display = "none";
        }
    });
}