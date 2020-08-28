chrome.storage.sync.get({ seekStep: 5, autoView: 'focus' }, function (items) {
    seekStep = parseFloat(items.seekStep);
    autoView = items.autoView;
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace == "sync") {
        if ("seekStep" in changes)
            seekStep = parseFloat(changes.seekStep.newValue);
        if ("autoView" in changes)
            autoView = changes.autoView.newValue;
    }
});

window.addEventListener("yt-navigate-finish", () => {
    var vid = document.querySelector('Video');
    
    const focus = (cmd) => {
        if (cmd == 1)
            chrome.runtime.sendMessage({ reqFocus: true })
        else if (cmd == 0)
            return
        else {
            vid.onplay = () => { focus(1); };
            vid.onseeked = () => { focus(1); };
            vid.onpause = () => { focus(0); };
        }
    }

    const pip = (cmd) => {
        chrome.runtime.sendMessage({ reqInfo: true }, (response) => {
            if (cmd == 1 && !document.pictureInPictureElement && !response.active)
                vid.requestPictureInPicture();
            else if (cmd == 0 && document.pictureInPictureElement && response.active)
                document.exitPictureInPicture();
            else {
                vid.onplay = () => { pip(1); };
                vid.onseeked = () => { pip(1); };
                vid.onpause = () => { pip(0); };
                vid.onfocus = () => { pip(0); };
            }
        });
    }

    const seek = (details) => {
        switch (details.action) {
            case "nexttrack":
                vid.currentTime = Math.min(vid.duration, vid.currentTime + seekStep);
                break;
            case "previoustrack":
                vid.currentTime = Math.max(0, vid.currentTime - seekStep);
                break;
        }
    }

    const handlers = () => {
        navigator.mediaSession.setActionHandler('previoustrack', seek);
        navigator.mediaSession.setActionHandler('nexttrack', seek);
    }

    if (autoView === "focus")
        focus();
    else if (autoView === "pip")
        pip();

    setTimeout(handlers, 1000)
    vid.onplaying = handlers;
});
