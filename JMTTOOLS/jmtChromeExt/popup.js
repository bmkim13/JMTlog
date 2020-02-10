// need to add "default_popup" : "popup.html" at manifest.json
'use strict';

var gIsShowWindow;

function sendData() {
    showWindow();
}

function showWindow() {
    chrome.runtime.sendMessage(
        {from: "popup",
        subject: "showWindow"},
        function (response) {
            gIsShowWindow = response
        });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("show").addEventListener('click', sendData);
});

