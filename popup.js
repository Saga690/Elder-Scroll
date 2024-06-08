document.addEventListener('DOMContentLoaded', () => {



    chrome.storage.sync.get('highlightColor', (data) => {           //for getting highlight color
        const color = data.highlightColor || '#03daf6'; //mera original color lmfaoo
        document.getElementById('highlightColor').value = color;
    });



    document.getElementById('highlightColor').addEventListener('change', (event) => {           //for setting highlight color on changing
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
        const groupedAnnotations = groupAnnotationsByDate(annotations);
        displayAnnotations(groupedAnnotations);
    });

    function groupAnnotationsByDate(annotations) {
        const grouped = {};

        annotations.forEach(annotation => {
            const date = new Date(annotation.timestamp).toLocaleDateString();
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(annotation);
        });

        
        for (const date in grouped) {
            grouped[date].sort((a, b) => b.timestamp - a.timestamp);
        }

        return grouped;
    }



    function displayAnnotations(groupedAnnotations) {
        const annotationList = document.getElementById('annotationList');
        annotationList.innerHTML = ''; 

        //descending order of dates
        const dates = Object.keys(groupedAnnotations).sort((a, b) => new Date(b) - new Date(a));

        dates.forEach(date => {
            const dateHeader = document.createElement('li');
            dateHeader.textContent = date;
            dateHeader.style.fontWeight = 'bold';
            dateHeader.style.color = '#CBCED8';
            annotationList.appendChild(dateHeader);

            const annotations = groupedAnnotations[date];
            const rannotations = annotations.slice().reverse();

            if (rannotations.length > 3) {
                const recentAnnotations = rannotations.slice(-3).reverse();
                recentAnnotations.forEach(annotation => {
                    const li = document.createElement('li');
                    li.style.color = annotation.color;
                    if (annotation.type == 'note') {
                        li.textContent = `${annotation.select} : ${annotation.text} (${new URL(annotation.url).hostname})`;
                    }
                    else {
                        li.textContent = `${annotation.text} (${new URL(annotation.url).hostname})`;
                    }
                    const deleteIcon = document.createElement('span');
                    deleteIcon.textContent = ' \u2716';
                    deleteIcon.style.color = 'red';
                    deleteIcon.style.cursor = 'pointer';
                    deleteIcon.style.marginLeft = '5px';
                    deleteIcon.addEventListener('click', () => {
                        deleteAnnotation(annotation);
                    });
                    li.appendChild(deleteIcon);
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
                const reversedAnnotations = rannotations.slice().reverse();
                reversedAnnotations.forEach(annotation => {
                    const li = document.createElement('li');
                    li.style.color = annotation.color;
                    if (annotation.type == 'note') {
                        li.textContent = `${annotation.select}: ${annotation.text} (${new URL(annotation.url).hostname})`;
                    }
                    else {
                        li.textContent = `${annotation.text} (${new URL(annotation.url).hostname})`;
                    }
                    const deleteIcon = document.createElement('span');
                    deleteIcon.textContent = ' \u2716';
                    deleteIcon.style.color = 'red';
                    deleteIcon.style.cursor = 'pointer';
                    deleteIcon.style.marginLeft = '5px';
                    deleteIcon.addEventListener('click', () => {
                        deleteAnnotation(annotation);
                    });
                    li.appendChild(deleteIcon);
                    annotationList.appendChild(li);
                });
            }
        })
    };

    function displayAllAnnotations(annotations) {
        const annotationList = document.getElementById('annotationList');
        annotationList.innerHTML = ''; 

        const date = new Date(annotations[0].timestamp).toLocaleDateString();
        const dateHeader = document.createElement('li');
        dateHeader.textContent = date;
        dateHeader.style.fontWeight = 'bold';
        dateHeader.style.color = '#CBCED8';
        annotationList.appendChild(dateHeader);

        annotations.forEach(annotation => {
            const li = document.createElement('li');
            li.style.color = annotation.color;
            if (annotation.type === 'note') {
                li.textContent = `${annotation.select}: ${annotation.text} (${new URL(annotation.url).hostname})`;
            } else {
                li.textContent = `${annotation.text} (${new URL(annotation.url).hostname})`;
            }
            const deleteIcon = document.createElement('span');
            deleteIcon.textContent = ' \u2716';
            deleteIcon.style.color = 'red';
            deleteIcon.style.cursor = 'pointer';
            deleteIcon.style.marginLeft = '5px';
            deleteIcon.addEventListener('click', () => {
                deleteAnnotation(annotation);
            });
            li.appendChild(deleteIcon);
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
        annotationList.innerHTML = ''; 

        const groupedAnnotations = groupAnnotationsByDate(annotations);
        const dates = Object.keys(groupedAnnotations).sort((a, b) => new Date(b) - new Date(a));

        dates.forEach(date => {
            const dateHeader = document.createElement('li');
            dateHeader.textContent = date;
            dateHeader.style.fontWeight = 'bold';
            dateHeader.style.color = '#CBCED8';
            annotationList.appendChild(dateHeader);

            const dateAnnotations = groupedAnnotations[date];

            dateAnnotations.forEach(annotation => {
                const li = document.createElement('li');
                li.style.color = annotation.color;
                if (annotation.type === 'note') {
                    li.textContent = `${annotation.select}: ${annotation.text} (${new URL(annotation.url).hostname})`;
                } else {
                    li.textContent = `${annotation.text} (${new URL(annotation.url).hostname})`;
                }
                const deleteIcon = document.createElement('span');
                deleteIcon.textContent = ' \u2716';
                deleteIcon.style.color = 'red';
                deleteIcon.style.cursor = 'pointer';
                deleteIcon.style.marginLeft = '5px';
                deleteIcon.addEventListener('click', () => {
                    deleteAnnotation(annotation);
                });
                li.appendChild(deleteIcon);
                annotationList.appendChild(li);
            });
        })
    }


    function deleteAnnotation(annotationToDelete) {
        chrome.storage.sync.get({ annotations: [] }, (data) => {
            const annotations = data.annotations;
            const updatedAnnotations = annotations.filter(annotation => annotation.timestamp !== annotationToDelete.timestamp);
            chrome.storage.sync.set({ annotations: updatedAnnotations }, () => {
                
                const groupedAnnotations = groupAnnotationsByDate(updatedAnnotations);
                displayAnnotations(groupedAnnotations);
            });
        });
    }



});









document.getElementById('exportIcon').addEventListener('click', () => {
    exportAnnotations();
});

function exportAnnotations() {
    chrome.storage.sync.get({ annotations: [] }, (data) => {
        const annotations = data.annotations;
        const json = JSON.stringify(annotations, null, 2); 
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        //temp div download ke liye
        const a = document.createElement('a');
        a.href = url;
        a.download = 'annotations.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); 
    });
}




