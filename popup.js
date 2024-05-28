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

        // Sort each group by timestamp in descending order
        for (const date in grouped) {
            grouped[date].sort((a, b) => b.timestamp - a.timestamp);
        }

        return grouped;
    }



    function displayAnnotations(groupedAnnotations) {
        const annotationList = document.getElementById('annotationList');
        annotationList.innerHTML = ''; // Clear the list first

        // Get dates in descending order
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
                const reversedAnnotations = rannotations;
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
        annotationList.innerHTML = ''; // Clear the list first

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
        annotationList.innerHTML = ''; // Clear the list first

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
                // Refresh the display after deletion
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
        const json = JSON.stringify(annotations, null, 2); // Convert annotations to JSON string with pretty print
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        // Create a temporary anchor element to initiate the download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'annotations.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Clean up the URL object
    });
}




