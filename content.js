chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == 'highlight') {
        highlightSelection(request.color);
    }
    else if (request.action === 'addNote') {
        addNoteToSelection();
    }
});


function highlightSelection(color) {
    const selection = window.getSelection();
    if (!selection.rangeCount) {
        alert('Please select some text to highlight.');
        return;
    }

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (selectedText) {
        const span = document.createElement('span');
        span.style.backgroundColor = color;

        const documentFragment = range.extractContents();

        documentFragment.childNodes.forEach(node => {
            if (node.nodeType === 1 && node.style.backgroundColor) {
                node.style.backgroundColor = '';
            }
        });

        span.appendChild(documentFragment);

        range.insertNode(span);

        selection.removeAllRanges();
    }
    else {
        alert('Please select some text to highlight.');
    }
}



console.log("Content Script Loaded");






// function addNoteToSelection() {
//     const selection = window.getSelection();
//     if (selection.rangeCount > 0) {
//         const range = selection.getRangeAt(0);
//         const note = document.createElement('div');
//         note.contentEditable = true;
//         note.style.border = '1px solid black';
//         note.style.backgroundColor = 'yellow';
//         note.style.display = 'inline-block';
//         note.style.marginLeft = '5px';
//         note.style.padding = '5px';
//         note.style.fontSize = '0.8em'; // Set the font size smaller
//         note.textContent = 'New Note';

//         const rect = range.getBoundingClientRect(); // Get the position of the selected text
//         note.style.position = 'absolute';
//         note.style.top = (rect.top - note.offsetHeight - 25) + 'px'; // Position the note above the selected text
//         note.style.left = rect.left + 'px';

//         document.body.appendChild(note); // Append the note to the body

//         // Adjust note position on window resize
//         window.addEventListener('resize', () => {
//             const rect = range.getBoundingClientRect();
//             note.style.top = (rect.top - note.offsetHeight - 5) + 'px';
//             note.style.left = rect.left + 'px';
//         });

//         // Adjust note position on scroll
//         window.addEventListener('scroll', () => {
//             const rect = range.getBoundingClientRect();
//             note.style.top = (rect.top - note.offsetHeight - 5) + 'px';
//             note.style.left = rect.left + 'px';
//         });
//     }
// }






function addNoteToSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const note = document.createElement('div');
        note.contentEditable = true;
        note.style.border = '1px solid black';
        note.style.borderRadius = '5%';
        note.style.backgroundColor = '#c6f3f5';
        note.style.display = 'inline-block';
        note.style.marginLeft = '5px';
        note.style.padding = '3px';
        note.style.fontSize = '0.8em';
        note.textContent = 'add note...';
        range.collapse(false);  // Collapse the range to the end point
        range.insertNode(note);
    }
}