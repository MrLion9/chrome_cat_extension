function setInfo(info) {
    if(info.type == 'img'){
        info.data.forEach(function(changeEl){
            var item = document.createElement("div");
            item.className = "item";
            item.innerHTML = "<img src='"+changeEl.value+"' class='ui image' height='50'>Replaced by"+
                "<img src='"+changeEl.changedBy+"' class='ui image' height='50'>";
            document.getElementById("img-changes").appendChild(item);
        });
    }

    if(info.type == 'text'){
        document.getElementById("text-chages").innerHTML = info.data + " changed words on page!";
    }
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