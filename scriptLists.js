const listsContainer = document.querySelector('[data-lists]');
const activeDisplay = document.querySelector('[data-list-display-container]');
const newListInput = document.querySelector('[data-new-list-input]');
const newTaskCreator = document.querySelector('.new-task-creator');
const tasksContainer = document.querySelector('[data-tasks]');
const taskTemplate = document.getElementById('task-template');

const LOCAL_STORAGE_LIST_KEY = 'list.lists';
const LOCAL_STORAGE_SELECTED_ID = 'object.selected.id';

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];

let selectedId = localStorage.getItem(LOCAL_STORAGE_SELECTED_ID);
let active = null;
let activeIndex = 0;


//action listener for list items
listsContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() == 'li') {
        activeDisplay.classList.remove("hidden");
        selectedId = e.target.dataset.listId;
        save();
        render();
    }
});
//create new list on submit
document.querySelector('[data-new-list-form]').addEventListener('submit', e => {
    e.preventDefault()
    const listName = newListInput.value
    if (listName == null || listName === '') return
    const list = createList(listName)
    selectedId = list.id;
    newListInput.value = null;
    lists.push(list);
    activeDisplay.classList.remove("hidden");
    save();
    render();
})


//clearing element
function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
//creating list object
function createList(name) {
    return { id: Date.now().toString(), name: name, tasks: [] }
}
function createTask(name) {
    return { id: Date.now().toString(), name: name, complete: false }
}

//delete button
document.querySelector('[data-delete-button]').addEventListener('click', e => {
    lists = lists.filter(list => list.id !== selectedId);
    selectedId = null;
    save();
    render();
});
//saving data
function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_ID, selectedId);
}
//displaying data
function render() {
    clearActive();
    if (selectedId == "null" || selectedId === null) {
        activeDisplay.classList.add("hidden");
    } else {
        activeDisplay.classList.remove("hidden")
        if (true) {
            for (let i = 0; i < lists.length; i++) {
                if (lists[i].id == selectedId) {
                    active = lists[i];
                    activeIndex = i;
                    break
                }
            }
            renderTasks(lists[activeIndex])
            const form = document.createElement("form");
            form.innerHTML = `<input type="text" data-new-task-input class="new task" placeholder="new task name" aria-label="new task name" />
                    <button class="btn create" aria-label="create new task">+</button>`;
            //create new task inside list on submit
            form.addEventListener('submit', e => {
                e.preventDefault();
                const newTaskInput = form.querySelector('[data-new-task-input]')
                const taskName = newTaskInput.value;
                if (taskName == null || taskName === '') return;
                const task = createTask(taskName);
                newTaskInput.value = null;
                const selectedList = lists[activeIndex];
                selectedList.tasks.push(task);
                save();
                render()
                
            })
            newTaskCreator.appendChild(form);
            activeDisplay.querySelector("h2").innerHTML = active.name;
            newTaskCreator.append(form);
        }
    }

    clearElement(listsContainer);
    lists.forEach(list => {
        const listElement = document.createElement('li');
        listElement.dataset.listId = list.id;
        listElement.classList.add("list-name");
        listElement.innerHTML = list.name;
        if (list.id === selectedId) {
            listElement.classList.add("active-list");
        }
        listsContainer.appendChild(listElement);
    });
}
function renderTasks(selectedList){
    selectedList.tasks.forEach(task => {
        const taskElement = document.importNode(taskTemplate.content, true)
        const checkbox = taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete
        const label = taskElement.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)
        tasksContainer.appendChild(taskElement)
    })
}
function clearActive() {
    activeDisplay.querySelector("h2").innerHTML = "";
    newTaskCreator.innerHTML="";
    tasksContainer.innerHTML="";
    
    let p = activeDisplay.querySelector("p");
    if (p != null) {
        p.outerHTML = "";
    }

}
render();
