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
        span.textContent = selectedText;

        // Create a temporary div to get the HTML representation of the span
        const tempDiv = document.createElement('div');
        tempDiv.appendChild(span);
        const spanHTML = tempDiv.innerHTML;

        // Get the HTML content of the range
        const container = range.commonAncestorContainer;
        const containerElement = container.nodeType === 3 ? container.parentNode : container;
        const containerHTML = containerElement.innerHTML;

        // Replace the selected text with the span HTML
        const highlightedHTML = containerHTML.replace(selectedText, spanHTML);

        // Update the container's HTML
        containerElement.innerHTML = highlightedHTML;

        // Clear the selection
        selection.removeAllRanges();
    }
    else {
        alert('Please select some text to highlight.');
    }
}



console.log("Content Script Loaded");



// function highlightSelection(color) {
//     const selection = window.getSelection();
//     if (selection.rangeCount > 0) {
//         const range = selection.getRangeAt(0);
//         const selectedText = range.toString();

//         if (selectedText) {
//             const span = document.createElement('span');
//             span.style.backgroundColor = color;
//             span.textContent = selectedText;

//             // Create a temporary div to get the HTML representation of the span
//             const tempDiv = document.createElement('div');
//             tempDiv.appendChild(span);
//             const spanHTML = tempDiv.innerHTML;

//             // Get the HTML content of the range
//             const container = range.commonAncestorContainer;
//             const containerHTML = container.innerHTML || container.parentNode.innerHTML;

//             // Replace the selected text with the span HTML
//             const highlightedHTML = containerHTML.replace(selectedText, spanHTML);

//             // Update the container's HTML
//             if (container.innerHTML !== undefined) {
//                 container.innerHTML = highlightedHTML;
//             } else {
//                 container.parentNode.innerHTML = highlightedHTML;
//             }

//             // Clear the selection
//             selection.removeAllRanges();
//         } else {
//             alert('Please select some text to highlight.');
//         }
//     } else {
//         alert('Please select some text to highlight.');
//     }
// }





// alert(selection);
// if (selection) {
//   const span = document.createElement('span');
//   span.style.backgroundColor = color;
//   span.textContent = selection;
//   const range = window.getSelection().getRangeAt(0);
//   range.deleteContents();
//   range.insertNode(span);
// //   saveAnnotation({ type: 'highlight', content: selection, color: color });
// }


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