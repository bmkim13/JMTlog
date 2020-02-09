console = chrome.extension.getBackgroundPage().console;

chrome.browserAction.onClicked.addListener(function(tab) {
});

var gSelectedInfo = {
    url: "",
    selectedText: "",
    imageUrl: "",
  };

var clickHandler = function (e) {
    gSelectedInfo.url =  e.pageUrl;
    console.log("url : " + gSelectedInfo.url);
    if (e.selectionText) {
        gSelectedInfo.selectedText = e.selectionText;
        console.log("text : " + gSelectedInfo.selectedText);
    }
    if (e.mediaType === 'image') {
        gSelectedInfo.imageUrl = e.srcUrl;
        console.log("image : " + gSelectedInfo.imageUrl);
    }
};

chrome.contextMenus.create({
    "title" : "JMT",
    "contexts" : ["selection", "image"],
    "onclick" : clickHandler
});

// Listen for messages from the popup.
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    console.log("onMessage : " + msg);
    if ((msg.from === 'popup') && (msg.subject === 'selectedInfo')) {
      response(gSelectedInfo);
    }
});
