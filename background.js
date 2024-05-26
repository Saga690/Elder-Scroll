// chrome.commands.onCommand.addListener((command) => {
//     if (command === "highlight-text") {
//       chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         chrome.tabs.sendMessage(tabs[0].id, { action: 'highlight', color: document.getElementById('highlightColor').value });
//       });
//     }
//   });
  


chrome.commands.onCommand.addListener((command) => {
    if (command === "highlight-text") {
      chrome.storage.sync.get('highlightColor', (data) => {
        const color = data.highlightColor || '#03daf6';
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'highlight', color: color });
        });
      });
    }
    else if (command === "add-note") {
      chrome.storage.sync.get('highlightColor', (data) => {
        const color = data.highlightColor || '#03daf6';
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'addNote', color: color });
        });
      });
    }
  });
  