'use strict';

var gSelectedInfo;

function sendData() {
    var category = document.getElementById('category').value
    alert(category)
}

function loadDataFromBackground() {
    chrome.runtime.sendMessage(
        {from: "popup",
        subject: "selectedInfo"},
        function (response) {
            gSelectedInfo = response;
            document.getElementById('selectedText').textContent = response.selectedText
            document.getElementById('selectedImage').src = response.imageUrl
        });
}

document.addEventListener('DOMContentLoaded', () => {
    loadDataFromBackground();
    document.getElementById("send").addEventListener('click', sendData);
});
