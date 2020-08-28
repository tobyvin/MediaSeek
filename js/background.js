chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log(message);
    if (message.reqInfo)
        sendResponse(sender.tab);

    if (message.reqFocus)
        chrome.tabs.update(sender.tab.id, { active: true });
});