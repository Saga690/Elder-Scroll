document.getElementById('highlightBtn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'highlight', color: document.getElementById('highlightColor').value });
    });
});



document.getElementById('noteBtn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'addNote', color: document.getElementById('highlightColor').value });
    });
});