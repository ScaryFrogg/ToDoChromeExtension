const notesContainer = document.querySelector('[data-notes-lists]');
const activeDisplay = document.querySelector('[data-list-display-container]');
const newNoteInput = document.querySelector('[data-new-note-input]');

const LOCAL_STORAGE_NOTE_KEY = 'note.lists';
const LOCAL_STORAGE_NOTE_KEY = 'lists.lists';
const LOCAL_STORAGE_SELECTED_ID = 'object.selected.id';

let notes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NOTE_KEY)) || [];
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NOTE_KEY)) || [];

let selectedId = localStorage.getItem(LOCAL_STORAGE_SELECTED_ID);
let active = null;
let activeIndex =0;


//action listener for list items
notesContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() == 'li') {
        activeDisplay.classList.remove("hidden");
        selectedId = e.target.dataset.noteId;
        console.log(e.target.dataset.noteId)
        save();
        render();
    }
});
//create new note on submit
document.querySelector('[data-new-note-form]').addEventListener('submit', e => {
    e.preventDefault()
    const noteName = newNoteInput.value
    if (noteName == null || noteName === '') return
    const note = createNote(noteName)
    selectedId= note.id;
    newNoteInput.value = null
    notes.push(note)
    save();
    render();
})

//clearing element
function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
//creating note object
function createNote(name) {
    return { id: Date.now().toString(), name: name, text: "" }
}

//delete button
document.querySelector('[data-delete-button]').addEventListener('click', e => {
    notes = notes.filter(list => list.id !== selectedId);
    selectedId = null;
    save();
    render();
});
//saving data
function save() {
    localStorage.setItem(LOCAL_STORAGE_NOTE_KEY, JSON.stringify(notes));
    localStorage.setItem(LOCAL_STORAGE_SELECTED_ID, selectedId);
}
//displaying data
function render() {
    clearActive();
    if (selectedId == "null" || selectedId === null) {
        activeDisplay.classList.add("hidden");
    } else {
        for(let i=0;i<notes.length;i++){
            if (notes[i].id == selectedId) {
                active = notes[i];
                activeIndex=i;
                break
            }
            
        }
        activeDisplay.querySelector("h2").innerHTML=active.name;
        const textArea =document.createElement("p");
        textArea.contentEditable=true;
        textArea.addEventListener('keypress',()=>{
            notes[activeIndex].text=textArea.innerText;
            save();
        })
        textArea.innerHTML=active.text;
        activeDisplay.querySelector(".todo-body").append(textArea);
    }

    clearElement(notesContainer);
    notes.forEach(note => {
        const listElement = document.createElement('li');
        listElement.dataset.noteId = note.id;
        listElement.classList.add("list-name");
        listElement.innerHTML = note.name;
        if (note.id === selectedId) {
            listElement.classList.add("active-list");
        }
        notesContainer.appendChild(listElement);
    });
}
function clearActive(){
    activeDisplay.querySelector("h2").innerHTML=""
    let p=activeDisplay.querySelector("p")
    if(p!=null){
        p.outerHTML=""
    }

}
render();