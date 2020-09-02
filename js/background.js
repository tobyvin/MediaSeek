console.log("Extension Loaded")
var activeTab;
chrome.runtime.onMessage.addListener(function (message, sender) {
    console.log(message)
    activeTab = sender.tab.id;
    if (message.reqFocus)
        chrome.tabs.update(activeTab, { active: true });
});