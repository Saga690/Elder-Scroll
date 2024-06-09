chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action == 'highlight') {
        highlightSelection(request.color);
    }
    else if (request.action === 'addNote') {
        addNoteToSelection(request.color);
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

        const uniqueSelector = getUniqueSelector(span.parentElement);

        const annotation = {
            text: selectedText,
            url: window.location.href,
            color: color,
            type: 'highlight',
            timestamp: Date.now(),
            selector: uniqueSelector
        };

        chrome.storage.sync.get({ annotations: [] }, (data) => {
            const annotations = data.annotations;
            annotations.push(annotation);
            chrome.storage.sync.set({ annotations: annotations });
        });

    }
    else {
        alert('Please select some text to highlight.');
    }
}



function restoreHighlights() {
    chrome.storage.sync.get('annotations', function (result) {
        const highlights = result.annotations || [];
        highlights.forEach(function (highlight) {
            const elements = document.querySelectorAll(highlight.selector);
            elements.forEach(function (element) {
                const innerHTML = element.innerHTML;
                const highlightedText = `<span style="background-color:${highlight.color}">${highlight.text}</span>`;
                element.innerHTML = innerHTML.replace(highlight.text, highlightedText);
            });
        });
    });
}


function getUniqueSelector(element) {
    if (element.id) {
        return `#${element.id}`;
    }
    if (element.className) {
        return `.${element.className.trim().split(/\s+/).join('.')}`;
    }
    return element.tagName.toLowerCase();
}



// document.addEventListener('DOMContentLoaded', function () {
    restoreHighlights();
// });






function addNoteToSelection(color) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        
        highlightSelection(color);  //imp

        const note = document.createElement('div');
        note.contentEditable = true;
        note.style.border = '0.5px dashed black';
        note.style.backgroundColor = color;
        note.style.display = 'inline-block';
        note.style.marginLeft = '5px';
        note.style.padding = '3px';
        note.style.fontSize = '0.8em';
        note.textContent = 'add note...';
        range.collapse(false);
        range.insertNode(note);

        const annotation = {
            text: note.textContent,
            url: window.location.href,
            color: color,
            type: 'note',
            select: selectedText,
            timestamp: Date.now()
        };

        chrome.storage.sync.get({ annotations: [] }, (data) => {
            const annotations = data.annotations;
            annotations.push(annotation);
            chrome.storage.sync.set({ annotations: annotations });
        });

        note.addEventListener('input', () => {
            annotation.text = note.textContent;
            chrome.storage.sync.get({ annotations: [] }, (data) => {
                const annotations = data.annotations;
                const index = annotations.findIndex(a => a.timestamp === annotation.timestamp);
                if (index > -1) {
                    annotations[index] = annotation;
                    chrome.storage.sync.set({ annotations: annotations });
                }
            });
        });
    }
}





console.log("Content Script Loaded");
