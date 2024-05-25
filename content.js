chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == 'highlight') {
        highlightSelection(request.color);
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






//   function addNoteToSelection() {
//     const selection = window.getSelection();
//     if (selection.rangeCount > 0) {
//       const range = selection.getRangeAt(0);
//       const note = document.createElement('div');
//       note.contentEditable = true;
//       note.style.border = '1px solid black';
//       note.style.backgroundColor = 'yellow';
//       note.style.display = 'inline-block';
//       note.style.marginLeft = '5px';
//       note.style.padding = '5px';
//       note.textContent = 'New Note';
//       range.collapse(false);  // Collapse the range to the end point
//       range.insertNode(note);
//     }
//   }