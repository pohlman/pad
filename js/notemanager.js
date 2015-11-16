
// NoteManager is a singleton that runs the show. Aside from keeping track of all your notes, it manages the grid view of your notes, takes care of creating new notes, and handles operations dealing with the modal.
function NoteManager(){

    if (NoteManager._instance) return NoteManager._instance; // singleton that allows calling NoteManager() from anywhere to return the single instance of this class. See last line of this file.

    this.notes = {};

    this.tileView = document.getElementsByClassName('notes')[0];
    this.noNotes = {};
    this.noNotes.on = true;
    this.noNotes.view = document.getElementsByClassName('no-notes')[0];
    this.modal = {};
    this.modal.view = document.getElementsByClassName('modal')[0];
    this.modal.title = document.getElementsByClassName('modal-title')[0];
    this.modal.body = document.getElementsByClassName('modal-body')[0];
    this.modal.delete = document.getElementsByClassName('delete')[0];

    this.setupNewHandler();
    this.getNotesFromStorage();
    this.populateGrid();

}


// Hooks up the new note button to a create new note modal
NoteManager.prototype.setupNewHandler = function setupNewHandler() {

    var self = this;

    var newButton = document.getElementsByClassName('new')[0];

    var createNote = function(){
        self.modal.view.setAttribute('class','modal fade new');
        self.modal.title.textContent = 'Type?';
        self.modal.body.innerHTML = null;
        // Make Buttons for Note Types
        for (var type in Note.types){

            var btn = self.modal.body.appendChild(document.createElement('div'));
            btn.setAttribute('class','btn');
            btn.textContent = type;
            btn.onclick = function(e){
                var type = e.currentTarget.textContent; // since btn is assigned in a loop, this pulls the correct type based on the button clicked
                $(self.modal.view).modal('hide');
                self.newNote(type);
            };

        }


        $(self.modal.view).modal();


    };

    newButton.onclick = createNote;

};

// Helper for creating a new note. Used both on loading from local storage and when creating a new note
NoteManager.prototype.newNote = function newNote(type) {
    if (!type) type = 'TEXT';

    var Type = Note.types[type];
    var n = new Type();
    this.notes[n.id] = n;
    this.addNoteToGrid(n);

};

// Pulls the notes from local storage into memory
NoteManager.prototype.getNotesFromStorage = function getNotesFromStorage(){

    var key,val;
    for (var i=0;i<localStorage.length;i++) {

        key = localStorage.key(i);
        try {
            val = JSON.parse(localStorage[key]);
            var Type = Note.types[val.type];
            this.notes[key] = new Type(val);
        } catch (e) {
            console.log('Failed to parse, removing note: ', localStorage[key]);
            localStorage.removeItem(key);
        }

    }

};

// Called after the notes are pulled from local storage. Puts the most recently modified notes first.
NoteManager.prototype.populateGrid = function populateGrid() {

    var sortedNotes = [];

    for (var key in this.notes) sortedNotes.push(this.notes[key]);

    sortedNotes.sort(function(a,b){ return a.dateModified > b.dateModified; });

    for (var i=0;i<sortedNotes.length;i++) this.addNoteToGrid(sortedNotes[i]);

};

// Builds the note into grid and hooks up click handler.
NoteManager.prototype.addNoteToGrid = function addNoteToGrid(note) {

    var self = this;

    note.viewTarget = document.createElement('div');
    note.viewTarget.setAttribute('class','col-xs-12 col-sm-6 col-md-4 col-lg-3');
    note.view = note.viewTarget.appendChild(document.createElement('div'));
    note.view.setAttribute('href', 'javascript:void(0);');
    note.view.setAttribute('class','note');
    note.view.onclick = function(){
        self.openNote(note);
    };


    var noteTitle = note.view.appendChild(document.createElement('div'));
    noteTitle.setAttribute('class','title');
    noteTitle.textContent = note.title || '';

    var noteSummary = note.view.appendChild(document.createElement('div'));
    noteSummary.setAttribute('class','summary');
    noteSummary.innerHTML = note.summary || '';

    // Disable No notes message if there
    if (this.noNotes.on){
        this.noNotes.on = false;
        this.noNotes.view.setAttribute('class','no-notes hidden');
    }

    this.tileView.insertBefore(note.viewTarget,this.tileView.firstChild);

};


// Calls the notes build function. The note object builds it's own body and title, NoteManager just manages where they go and the modal functions.
NoteManager.prototype.openNote = function openNote(note) {

    var self = this;

    var parts = note.build();
    var ignoreHidden = false;

    this.modal.view.setAttribute('class','modal fade');
    this.modal.title.innerHTML = null;
    this.modal.title.appendChild(parts.title);
    this.modal.body.innerHTML = null;
    this.modal.body.appendChild(parts.body);
    this.modal.delete.onclick = function(){
        ignoreHidden = true;
        $(self.modal.view).modal('hide');
        self.removeNote(note);
    };


    $(this.modal.view).one('hidden.bs.modal', function(){
        if (!ignoreHidden){
            note.save();
            note.viewTarget.parentNode.removeChild(note.viewTarget); // Delete from grid if existing to rebuild
            self.addNoteToGrid(note);
        }
    });

    $(this.modal.view).modal();

    // Focus the body to avoid confusion on contenteditable field, however either the modal fade or the browser reflow prevent immediate focusing.
    setTimeout(function(){
        parts.body.focus();
    },200);

};

// Remove a note from memory, the grid, and from local storage
NoteManager.prototype.removeNote = function removeNote(note) {

    delete this.notes[note.id]; // Remove from NoteManager memory;
    note.viewTarget.parentNode.removeChild(note.viewTarget); // Delete from grid
    note.remove(); // Delete from localStorage

    // Enable No notes message if removing last notes
    if (Object.keys(this.notes).length < 1){
        this.noNotes.on = true;
        this.noNotes.view.setAttribute('class','no-notes');
    }

};


NoteManager._instance = new NoteManager(); // Create the singleton


