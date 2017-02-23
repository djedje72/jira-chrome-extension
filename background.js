chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {          
    if (changeInfo.status == 'complete') {   
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const value = localStorage.getItem("value");
            chrome.tabs.sendMessage(tabs[0].id, { type: "refresh", value: value?value:200});
        });
    }
});