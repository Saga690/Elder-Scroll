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


});




