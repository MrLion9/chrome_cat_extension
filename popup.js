function setInfo(info) {
    document.getElementById('total').textContent   = info;
}

window.addEventListener('DOMContentLoaded', function () {
    // query for the active tab
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        // and send a request for the DOM info
        chrome.tabs.sendMessage(
            tabs[0].id,
            {from: 'popup', subject: 'info'},setInfo);
    });
});