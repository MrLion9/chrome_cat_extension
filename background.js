// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//         console.log(sender.tab ?
//         "from a content script:" + sender.tab.url :
//             "from the extension");
//         if (request.greeting == "hello")
//             sendResponse({farewell: "goodbye"});
//     });

chrome.webNavigation.onDOMContentLoaded.addListener(function(details) {
    chrome.tabs.executeScript(null,{file:"content.js"});
});