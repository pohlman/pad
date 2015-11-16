// Add this extension to the note type list
Note.types.TODO = Todo;

// Todo is an example of a extension of the base Note type. It changes the body up with a list of items for completion, each with a checkbox. It overrides methods of the base class where necessary.
function Todo(obj){

    Note.call(this,obj); // Call the base constructor

    if (obj) this.fromObject(obj);
    else {
        this.type = 'TODO';
        this.title = 'New Todo List';
        this.content = [];
    }

}

Todo.prototype = Object.create(Note.prototype); // Inherit from Note's prototype


// Todo's save is different than the base class since the summary for the grid is handled differently
Todo.prototype.save = function save(){

    this.summary = '';
    this.dateModified = new Date().getTime();

    for (var i=0;i<this.content.length;i++){
        var iconClass = this.content[i].done ? 'fa fa-fw fa-check-square-o' : 'fa fa-fw fa-square-o';

        this.summary += '<i class="' + iconClass + '"></i>';
        this.summary += ' ' + this.content[i].text;
        this.summary += '<br>';
    }

    // Make a copy to delete view and viewTarget (HTML Nodes)
    var copy = JSON.parse(JSON.stringify(this));
    copy.view = null;
    copy.viewTarget = null;
    localStorage.setItem(copy.id, JSON.stringify(copy));

};


// Build todo's UL based body
Todo.prototype.build = function build() {

    var self = this;

    var title = document.createElement('div');
    title.setAttribute('contenteditable','true');
    title.setAttribute('class','editable');
    title.textContent = this.title;
    title.onkeyup = function(){
      self.title = this.textContent;
    };


    var body = document.createElement('div');
    body.setAttribute('class','todo');

    var ul = body.appendChild(document.createElement('ul'));

    function addItem(item){

        if (!item) {
            item = {done:false,text:''};
            self.content.push(item);
        }

        item.view = ul.appendChild(document.createElement('li'));


        var controls = item.view.appendChild(document.createElement('div'));
        controls.setAttribute('class','controls');

        var remove = controls.appendChild(document.createElement('div'));
        remove.setAttribute('href','javascript:void(0)');
        var icon = remove.appendChild(document.createElement('i'));
        icon.setAttribute('class','fa fa-fw fa-times');

        remove.onclick = function(){

            for (var i=0;i<self.content.length;i++){
                if (self.content[i].done === item.done && self.content[i].text === item.text){
                    self.content.splice(i,1);
                    break;
                }
            }

            item.view.parentNode.removeChild(item.view);

        };


        var checkbox = controls.appendChild(document.createElement('input'));
        checkbox.setAttribute('type','checkbox');
        if (item.done) checkbox.setAttribute('checked','');
        checkbox.onchange = function(e) {
            item.done = this.checked;
            if (item.done) text.setAttribute('class','text strike');
            else text.setAttribute('class','text');
        };

        var text = item.view.appendChild(document.createElement('div'));
        text.setAttribute('class','text');
        text.setAttribute('contenteditable','true');
        text.textContent = item.text;
        text.onkeyup = function(){
            item.text = text.textContent;
        };

    }


    // Build out existing items
    for (var i=0;i<this.content.length;i++){
        addItem(this.content[i]);
    }

    // Add blank entry if none or last one isn't empty
    if (this.content.length === 0 || this.content[this.content.length-1].text.length !== 0) addItem();


    var addRow = body.appendChild(document.createElement('div'));
    var icon = addRow.appendChild(document.createElement('i'));
    icon.setAttribute('class','fa fa-fw fa-plus');

    addRow.onclick = function(){
        addItem();
    };


    return {title:title,body:body};

};