'use strict';

var gSelectedInfo;

function sendData() {
    var category = document.getElementById('category').value
    alert(category)
}

function loadDataFromBackground() {
    chrome.runtime.sendMessage(
        {from: "window",
        subject: "selectedInfo"},
        function (response) {
            gSelectedInfo = response;
            document.getElementById('selectedText').textContent = response.selectedText
            document.getElementById('selectedImage').src = response.imageUrl
        });
}

chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    if ((msg.from === 'content') && (msg.subject === 'selectedText')) {
        gSelectedInfo.imageUrl = msg.data
        gSelectedInfo.url = msg.url
        document.getElementById('selectedText').textContent = msg.data
    }
    else if ((msg.from === 'content') && (msg.subject === 'imageUrl')) {
        gSelectedInfo.imageUrl = msg.data
        gSelectedInfo.url = msg.url
        document.getElementById('selectedImage').src = msg.data
    } 
});

document.addEventListener('DOMContentLoaded', () => {
    loadDataFromBackground();
    document.getElementById("send").addEventListener('click', sendData);
});

