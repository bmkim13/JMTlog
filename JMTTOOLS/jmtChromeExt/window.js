'use strict';

var gSelectedInfo;

var tfidf;

function tfidfProcess(text) {
    tfidf = new TFIDF();
    // Process this data into the tfidf object
    tfidf.termFreq(text);
    // doc 이 1개기 때문에 word counter와 같음 
    tfidf.docFreq(text);
    tfidf.finish(1);
    tfidf.sortByScore();
    return tfidf.getKeys()[0];
}

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
            updateString();
            document.getElementById('selectedImage').src = response.imageUrl
        });
}

function updateString() {
    document.getElementById('selectedText').textContent = gSelectedInfo.selectedText;
    if (gSelectedInfo.selectedText.length != 0) {
        var keyword = tfidfProcess(gSelectedInfo.selectedText);
        document.getElementById('category').value = keyword;
    }
}

chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    if ((msg.from === 'content') && (msg.subject === 'selectedText')) {
        gSelectedInfo.selectedText = msg.data
        gSelectedInfo.url = msg.url
        updateString()
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

