#pad
Robert Pohlman

robertpohlman@gmail.com

http://pohlman.co/



###About
* Pad is a Bootstrap based notepad that stores your notes in your browsers local storage.
* It should adapt to any size screen and run on any modern browser.
* I've tested it on Chrome, Firefox, Chrome for Android, Safari, and Mobile Safari (iPhone 5s, 6, 6Plus) through XCode's iOS simulator. Viewport is set based on device width and should stay in frame nicely.
* In the Javascript, NoteManager runs the show. Aside from keeping track of all your notes, it manages the grid view of your notes, takes care of creating new notes, and handles operations dealing with the modal.
* Notes is both a base class and the generic 'Text' type of note. This boring note type only really has a title and body. It handles itself where it wouldn't be appropriate for NoteManager to interfere.
* Todo is an example of a extension of the base Note type. It changes the body up with a list of items for completion, each with a checkbox. It overrides methods of the base class where necessary.



###Usage
* Usage is simple, load it up and click the big green plus to start creating notes!
* From the grid view, click on any of your notes to edit them.
* Pad makes use of contentEditable, so to edit the body or title of your note, just click into them and start typing!
* Saving and closing a note happens both when you click outside the modal, or when you click the green check. If you create a blank note, but never open it, it will not save. Both options are there since clicking outside the modal may be difficult on a smaller screen.
* To delete a note, first open it, then click the red trashcan.


###Next
* These are just some thoughts I had while designing on the direction I would take this if I were to keep going.
* More types of notes, possibly a type with a calendar picker.
* Note colors. Maybe colors are used to differentiate between types easily, or just selected by preference.
* Incorporating date created or date edited onto the notes. Maybe on the grid view it would say '5 days ago' or '3 minutes ago'.
* Realistically, local storage isn't a great solution. At the very least it would need to be encrypted and have a local password in order to prevent snoopers and support multiple users on the same system.
* Ideally, websockets interacting asynchronously with a NoSQL DB like Redis would be the best solution. OAuth could make login easy.
* Make the grid more dynamic. Resizable notes? Prioritizing or pinning notes to the top?
* Filters/sorting/search in title bar or below it. This could be useful if you have a lot of notes.
* Make a custom checkbox on the Todo note, instead of keeping the ugly default input style.
* Make grid padding smaller on devices with a smaller screen.

###Resources
Resource | URL
------------- | -------------
jQuery 1.x | https://jquery.com/
Bootstrap 3  | http://getbootstrap.com/
Font Awesome icons | https://fortawesome.github.io/Font-Awesome/
Indie Flower font | https://www.google.com/fonts/specimen/Indie+Flower
Sticky Note Colors | http://www.colourlovers.com/palette/381093/Sticky_Note
GUID Generator function | http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
