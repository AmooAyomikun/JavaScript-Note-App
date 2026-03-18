const createNoteEl = document.getElementById('addnote-btn')
const noteModalEl = document.getElementById('note-modal')
const noteTitleInput = document.getElementById('note-title')
const noteContentInput = document.getElementById('note-content')
const saveNoteBtn = document.getElementById('save-note-btn')
const cancelNoteBtn = document.getElementById('cancel-btn')
const notesContainerEl = document.getElementById('notes-container')
const errorMsgEl = document.querySelector('.error-msg')
const doneEditingBtnEl = document.getElementById('edit-btn')
const searchInputEl = document.getElementById('search-input')
const allNotes = document.getElementById('all-notes')
const favorites = document.getElementById('favorites')

const date = new Date()
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', "October", 'November', 'December']
const currentMonth = date.getMonth()
const monthName = months[currentMonth]

const day = date.getDate()
const year = date.getFullYear()

let notes = JSON.parse(localStorage.getItem('notes')) || []

notes.forEach(function(note){
    if(note.isFavorite === undefined){
        note.isFavorite = false
    }
})
updateLocalStorage()

let editNoteId = null

searchInputEl.addEventListener('input', function(e){
    let searchValue = e.target.value.toLowerCase()

    let filteredNote = notes.filter(function(note){
        if(note.title.toLowerCase().includes(searchValue) || note.content.toLowerCase().includes(searchValue)){
            return true
        }else{
            return false
        }
    })  
    
    notesContainerEl.innerHTML = ""

    if(filteredNote.length > 0){
        filteredNote.forEach(function(note){
            let newdiv = document.createElement('div')
            newdiv.classList.add('note-card')
            newdiv.dataset.id = note.uniqueId

            let h3El = document.createElement('h3')
            h3El.textContent = note.title

            let paragraph = document.createElement('p')
            paragraph.textContent = note.content

            let nextDiv = document.createElement("div")
            nextDiv.classList.add('notebtn')

            let spanEl = document.createElement('span')
            spanEl.classList.add('date')
            spanEl.textContent = note.timeStamp
            
            let actionDiv = document.createElement('div')
            actionDiv.classList.add('actions')
            
            let editBtn = document.createElement('button')
            editBtn.classList.add('edit-btn')
            editBtn.textContent = "Edit"

            let deleteBtn = document.createElement('button')
            deleteBtn.classList.add('delete-btn')
            deleteBtn.textContent = "Delete"

            actionDiv.appendChild(editBtn)
            actionDiv.appendChild(deleteBtn)
            nextDiv.appendChild(spanEl)
            nextDiv.appendChild(actionDiv)

            newdiv.appendChild(h3El)
            newdiv.appendChild(paragraph)
            newdiv.appendChild(nextDiv)

            notesContainerEl.appendChild(newdiv)
        })
    }else{
        notesContainerEl.textContent = "No results found"
    }
    
    if(searchValue === ''){
        displayNote()
    }
})

function openModal(){
    noteModalEl.classList.remove('hidden')
    setMode('create')
    noteTitleInput.value = ""
    noteContentInput.value = ""
}

function createNewNote(){
    let noteTitleValue = noteTitleInput.value
    let noteContentValue = noteContentInput.value

    if(noteTitleValue.trim() && noteContentValue.trim()){
        let noteObj = {
            uniqueId: Date.now(),
            title: noteTitleValue,
            content: noteContentValue,
            timeStamp: `${monthName} ${day}, ${year}`,
            isFavorite: false
        }
        notes.push(noteObj)
        updateLocalStorage()
        displayNote()
        noteTitleInput.value =
         ""
        noteContentInput.value = ""
        noteModalEl.classList.add('hidden')
        errorMsgEl.style.visibility = 'hidden'
    }else{
        errorMsgEl.style.visibility = 'visible'
    }
}

function cancelNote(){
    noteTitleInput.value = ""
    noteContentInput.value = ""
    noteModalEl.classList.add('hidden')
}

function updateLocalStorage(){
    localStorage.setItem('notes', JSON.stringify(notes))
}

function displayNote(notesToDisplay = notes){
    notesContainerEl.innerHTML = ""

    if(notesToDisplay.length === 0){
        notesContainerEl.innerHTML = "<p>No notes yet</p>"
        return
    }

    notesToDisplay.forEach(function(note){
        let newdiv = document.createElement('div')
        newdiv.classList.add('note-card')
        newdiv.dataset.id = note.uniqueId

        let h3El = document.createElement('h3')
        h3El.textContent = note.title

        let paragraph = document.createElement('p')
        paragraph.textContent = note.content

        let nextDiv = document.createElement("div")
        nextDiv.classList.add('notebtn')

        let spanEl = document.createElement('span')
        spanEl.classList.add('date')
        spanEl.textContent = note.timeStamp
        
        let actionDiv = document.createElement('div')
        actionDiv.classList.add('actions')
        
        let editBtn = document.createElement('button')
        editBtn.classList.add('edit-btn')
        editBtn.textContent = "Edit"

        let favoriteBtn = document.createElement('button')
        favoriteBtn.classList.add('favorite-btn')
        if(note.isFavorite){
            favoriteBtn.innerHTML = `<i class="fas fa-heart"></i>`
        }else{
            favoriteBtn.innerHTML = `<i class="far fa-heart"></i>`
        }
        

        let deleteBtn = document.createElement('button')
        deleteBtn.classList.add('delete-btn')
        deleteBtn.textContent = "Delete"

        actionDiv.appendChild(editBtn)
        actionDiv.appendChild(favoriteBtn)
        actionDiv.appendChild(deleteBtn)
        nextDiv.appendChild(spanEl)
        nextDiv.appendChild(actionDiv)

        newdiv.appendChild(h3El)
        newdiv.appendChild(paragraph)
        newdiv.appendChild(nextDiv)

        notesContainerEl.appendChild(newdiv)
    })
}

function viewNote(noteId){
    let selectedNote = notes.find(function(note){
        return note.uniqueId === noteId
    })

    if(selectedNote){
        noteModalEl.classList.remove('hidden')
        setMode('view')
        noteTitleInput.value = selectedNote.title
        noteContentInput.value = selectedNote.content
    }
}

function editNote(noteId){
    let currentNote = notes.find(function(note){
        return note.uniqueId === noteId
    })

    if(currentNote){
        editNoteId = noteId
        noteModalEl.classList.remove('hidden')
        setMode('edit')

        noteTitleInput.value = currentNote.title
        noteContentInput.value = currentNote.content
    }else{
        return
    }
}

function deleteNote(noteId){
    let currentNoteIndex = notes.findIndex(function(note){
        return note.uniqueId === noteId
    })

    if(currentNoteIndex !== -1){
        notes.splice(currentNoteIndex, 1)
    }
    updateLocalStorage()
    displayNote()
}

function favoriteNote(noteId){
    const favoriteNote = notes.find(function(note){
        return note.uniqueId === noteId
    })

    if(favoriteNote){
        if(favoriteNote.isFavorite === true){
            favoriteNote.isFavorite = false
        }else{
            favoriteNote.isFavorite = true
        }
        updateLocalStorage()
        displayNote()
    }
}

function setMode(mode){
    if(mode === 'create'){
        doneEditingBtnEl.style.display = 'none'
        noteTitleInput.readOnly = false
        noteContentInput.readOnly = false
        saveNoteBtn.style.display = 'block'
    }
    
    if(mode === "view"){
        noteTitleInput.readOnly = true
        noteContentInput.readOnly = true
        saveNoteBtn.style.display = 'none'
        doneEditingBtnEl.style.display = 'none'
    }

    if(mode === 'edit'){
        saveNoteBtn.style.display = 'none'
        doneEditingBtnEl.style.display = 'block'
        noteTitleInput.readOnly = false
        noteContentInput.readOnly = false
    }
}

notesContainerEl.addEventListener('click', function(e){
    const clickedNote = e.target.closest('.note-card')
    if(!clickedNote)return;

    const clickedNoteId = Number(clickedNote.dataset.id)

    if(e.target.closest('.delete-btn')){
        deleteNote(clickedNoteId)
        return
    }

    if(e.target.closest('.edit-btn')){
        editNote(clickedNoteId)
        return
    }

    if(e.target.closest('.favorite-btn')){
        favoriteNote(clickedNoteId)
        return
    }

    viewNote(clickedNoteId)
})

createNoteEl.addEventListener('click', openModal)
saveNoteBtn.addEventListener('click',createNewNote)
cancelNoteBtn.addEventListener('click',cancelNote)

doneEditingBtnEl.addEventListener('click',function(){
    let currentNote = notes.find(function(note){
        return note.uniqueId === editNoteId
    })

    if(currentNote){
        currentNote.title = noteTitleInput.value
        currentNote.content = noteContentInput.value

        updateLocalStorage()
        displayNote()
        noteModalEl.classList.add('hidden')
    }
})

allNotes.addEventListener('click', function(){
    favorites.classList.remove('active')
    allNotes.classList.add('active')
    displayNote()
})

favorites.addEventListener('click', function(){
    allNotes.classList.remove('active')
    favorites.classList.add('active')
    
    const favoriteNotes = notes.filter(function(note){
        return note.isFavorite === true
    })

    if(favoriteNotes.length === 0){
        notesContainerEl.textContent = "No Favorite note yet"
    }

    displayNote(favoriteNotes)
})

displayNote()

