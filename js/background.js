chrome.runtime.onMessage.addListener(function (message, sender) {
    if (message.reqFocus)
        chrome.tabs.update(sender.tab.id, { active: true });
});