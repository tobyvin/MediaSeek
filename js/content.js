chrome.storage.sync.get({ seekStep: 5 }, function (items) {
    seekStep = parseFloat(items.seekStep);
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace == "sync") {
        if ("seekStep" in changes)
            seekStep = parseFloat(changes.seekStep.newValue);
    }
});

var controller = () => {
    var vid = document.querySelector('Video');

    const focus = () =>
        chrome.runtime.sendMessage({ reqFocus: true });


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
        chrome.runtime.sendMessage({ handlers: true });
    }

    // const onplay = () =>
    //     focus

    // const onseeked = () =>
    //     focus

    setTimeout(handlers, 1000)
    vid.onplaying = handlers;
    vid.onplay = focus;
    vid.onseeked = focus;
}

window.addEventListener("yt-navigate-finish", controller);
window.addEventListener("load", controller);