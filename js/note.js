
// const Note Types used globally
Note.types = {
    TEXT:Note
};


// Notes is both a base class and the generic 'Text' type of note. This boring note type only really has a title and body. It handles itself where it wouldn't be appropriate for NoteManager to interfere.
function Note(obj){

    if (obj) this.fromObject(obj);

    else {

        this.id = genGuid();
        this.view = null;
        this.viewTarget = null;
        this.type = 'TEXT'; // default Note type is text
        this.dateModified = new Date().getTime();
        this.title = 'New Note';
        this.content = ''; // content should be able to be overwritten in an extension of this base class
        this.summary = '';

    }

}

// Rebuilds a note object from local storage JSON
Note.prototype.fromObject = function fromObject(obj) {

    for (var prop in obj) this[prop] = obj[prop];

};


// Strips out HTML Element properties and saves to local storage
Note.prototype.save = function save(){

    this.summary = this.content;
    this.dateModified = new Date().getTime();
    // Make a copy to delete view and viewTarget (HTML Nodes)
    var copy = JSON.parse(JSON.stringify(this));
    copy.view = null;
    copy.viewTarget = null;
    localStorage.setItem(copy.id, JSON.stringify(copy));

};


// Called by NoteManager's remove to delete from local storage
Note.prototype.remove = function remove(){

    localStorage.removeItem(this.id);

};

// Builds the title and body elements for the main modal view
Note.prototype.build = function build() {

    var self = this;

    var title = document.createElement('div');
    title.setAttribute('contenteditable','true');
    title.setAttribute('class','editable');
    title.textContent = this.title;
    title.onkeyup = function() {
      self.title = this.textContent;
    };

    var body = document.createElement('div');
    body.setAttribute('contenteditable','true');
    body.setAttribute('class','editable');
    body.innerHTML = this.content;
    body.onkeyup = function(){
        self.content = this.innerHTML; // .textContent doesn't support line breaks;
    };

    return {title:title,body:body};

};