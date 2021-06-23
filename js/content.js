chrome.storage.sync.get({ seekStep: 5 }, function (items) {
    seekStep = parseFloat(items.seekStep);
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace == "sync") {
        if ("seekStep" in changes)
            seekStep = parseFloat(changes.seekStep.newValue);
    }
});

const controller = () => {
    var vid = document.querySelector('Video');

    if (!vid)
        return;

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
    
    setTimeout(handlers, 1000)
    vid.onplaying = handlers;
}

if (location.href.match("^https?:\/\/www\.youtube\.com\/.*$"))
    window.addEventListener("yt-navigate-finish", controller);
else
    window.addEventListener("load", controller);