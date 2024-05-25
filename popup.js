document.getElementById('highlightBtn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'highlight', color: document.getElementById('highlightColor').value });
    });
});


// document.addEventListener('DOMContentLoaded', () => {
//     document.getElementById('highlightBtn').addEventListener('click', () => {
//         chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//             if (tabs[0]) {
//                 chrome.tabs.sendMessage(tabs[0].id, { action: 'highlight', color: document.getElementById('highlightColor').value }, (response) => {
//                     if (chrome.runtime.lastError) {
//                         console.error(chrome.runtime.lastError);
//                     }
//                 });
//             }
//         });
//     });
// });


// window.addEventListener('load', (event) => {
//     chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
//         chrome.scripting.executeScript({ target: { tabId: tabs[0].id } }, {
//             file: 'content.js', //my content script
//         }, () => {
//             connect() //this is where I call my function to establish a connection
//         });
//     });

// });