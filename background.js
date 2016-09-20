chrome.webNavigation.onDOMContentLoaded.addListener(function(details) {
    chrome.tabs.executeScript(null,{file:"content.js"});
});