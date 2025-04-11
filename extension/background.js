const blackList = {};
const whiteList = {};

fetch(chrome.runtime.getURL('black-list.json'))
    .then(response => response.json())
    .then(data => {
        Object.assign(blackList, data);
    })
    .catch(error => console.error('Error loading black-list.json:', error));

fetch(chrome.runtime.getURL('white-list.json'))
    .then(response => response.json())
    .then(data => {
        Object.assign(whiteList, data);
    })
    .catch(error => console.error('Error loading white-list.json:', error));


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    scanAllTabs();
});

function scanAllTabs(){
    chrome.tabs.query({}, function(tabs) {
        tabs.forEach(tab => {
            CheckandClose(tab.id, tab.url, tab.title);
        });
    });
}
function CheckandClose(tab_id,tab_url,tab_title){
    const url = new URL(tab_url);
    const mainUrl = url.hostname.replace(/^www\./, '');
    let exists_in_black = Object.values(blackList).includes(mainUrl);
    let exists_in_white = Object.values(whiteList).includes(mainUrl);
    if (exists_in_white) {
        // If the main URL is in the white-list, skip further checks
        console.log("vibe check passed");
    }else if (exists_in_black) {
        // If the main URL is in the black-list, close the tab
        chrome.tabs.remove(tab_id, () => {
            console.log(`Closed tab with Url: ${tab_url} and Title: ${tab_title}`);
        });
    }else{
        console.log("yellow");
    }

    // Add further logic here if needed
}