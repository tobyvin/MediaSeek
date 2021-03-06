// Saves options to chrome.storage
function save_options() {
    var seekStep = document.getElementById('seekStep').value;

    chrome.storage.sync.set({
        seekStep: seekStep
    }, function () {
        // Update status to let user know options were saved.
        var buttons = document.getElementById('buttons');
        var status = document.getElementById('status');
        buttons.style.display = 'none';
        status.style.display = 'block';
        setTimeout(function () {
            buttons.style.display = 'block';
            status.style.display = 'none';
        }, 750);
    });
}

// Restores state using the preferences stored in chrome.storage.
function restore_options() {
    // Use default value seekStep = 6, autoView = 'focus'
    chrome.storage.sync.get({
        seekStep: 5
    }, function (items) {
        document.getElementById('seekStep').value = items.seekStep;
    });
}

function reload() {
    chrome.runtime.reload()
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('reload').addEventListener('click', reload);