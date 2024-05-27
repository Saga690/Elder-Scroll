document.addEventListener('DOMContentLoaded', () => {



    chrome.storage.sync.get('highlightColor', (data) => {
        const color = data.highlightColor || '#03daf6';
        document.getElementById('highlightColor').value = color;
    });



    document.getElementById('highlightColor').addEventListener('change', (event) => {
        chrome.storage.sync.set({ highlightColor: event.target.value });
    });



    document.getElementById('highlightBtn').addEventListener('click', () => {
        chrome.storage.sync.get('highlightColor', (data) => {
            const color = data.highlightColor || '#03daf6';
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'highlight', color: color });
            });
        });
    });



    document.getElementById('noteBtn').addEventListener('click', () => {
        chrome.storage.sync.get('highlightColor', (data) => {
            const color = data.highlightColor || '#03daf6';
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'addNote', color: color });
            });
        });
    });



    chrome.storage.sync.get({ annotations: [] }, (data) => {
        const annotations = data.annotations;
        const annotationList = document.getElementById('annotationList');
        annotationList.innerHTML = ''; // Clear the list first

        if (annotations.length > 3) {
            const recentAnnotations = annotations.slice(-3).reverse();
            recentAnnotations.forEach(annotation => {
                const li = document.createElement('li');
                li.style.color = annotation.color;
                if (annotation.type == 'note') {
                    li.textContent = `${annotation.select} : ${annotation.text} (${new URL(annotation.url).hostname})`;
                }
                else {
                    li.textContent = `${annotation.text} (${new URL(annotation.url).hostname})`;
                }
                annotationList.appendChild(li);
            });
            const moreLi = document.createElement('li');
            moreLi.textContent = '...more';
            moreLi.classList.add('more-item');
            moreLi.addEventListener('click', () => {
                displayAllAnnotations(annotations);
            });
            annotationList.appendChild(moreLi);
        } else {
            const reversedAnnotations = annotations.reverse();
            reversedAnnotations.forEach(annotation => {
                const li = document.createElement('li');
                li.style.color = annotation.color;
                if (annotation.type == 'note') {
                    li.textContent = `${annotation.select}: ${annotation.text} (${new URL(annotation.url).hostname})`;
                }
                else {
                    li.textContent = `${annotation.text} (${new URL(annotation.url).hostname})`;
                }
                annotationList.appendChild(li);
            });
        }
    });

    function displayAllAnnotations(annotations) {
        const annotationList = document.getElementById('annotationList');
        annotationList.innerHTML = ''; // Clear the list first

        annotations.reverse().forEach(annotation => {
            const li = document.createElement('li');
            li.style.color = annotation.color;
            if (annotation.type === 'note') {
                li.textContent = `${annotation.select}: ${annotation.text} (${new URL(annotation.url).hostname})`;
            } else {
                li.textContent = `${annotation.text} (${new URL(annotation.url).hostname})`;
            }
            annotationList.appendChild(li);
        });
    }



    document.getElementById('searchBtn').addEventListener('click', () => {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        chrome.storage.sync.get({ annotations: [] }, (data) => {
            const annotations = data.annotations;
            const filteredAnnotations = annotations.filter(annotation => {
                const annotationText = annotation.type === 'note'
                    ? `${annotation.select}: ${annotation.text}`
                    : annotation.text;
                return annotationText.toLowerCase().includes(searchTerm);
            });
            displayFilteredAnnotations(filteredAnnotations);
        });
    });


    function displayFilteredAnnotations(annotations) {
        const annotationList = document.getElementById('annotationList');
        annotationList.innerHTML = ''; // Clear the list first

        annotations.reverse().forEach(annotation => {
            const li = document.createElement('li');
            li.style.color = annotation.color;
            if (annotation.type === 'note') {
                li.textContent = `${annotation.select}: ${annotation.text} (${new URL(annotation.url).hostname})`;
            } else {
                li.textContent = `${annotation.text} (${new URL(annotation.url).hostname})`;
            }
            annotationList.appendChild(li);
        });
    }


});




