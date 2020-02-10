console = chrome.extension.getBackgroundPage().console;

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
        chrome.runtime.sendMessage(
            {
                from: "content",
                subject: "selectedText",
                url: gSelectedInfo.url,
                data: gSelectedInfo.selectedText
            });
    }
    if (e.mediaType === 'image') {
        gSelectedInfo.imageUrl = e.srcUrl;
        console.log("image : " + gSelectedInfo.imageUrl);
        chrome.runtime.sendMessage(
            {
                from: "content",
                subject: "imageUrl",
                url: gSelectedInfo.url,
                data: gSelectedInfo.imageUrl
            });
    }
};

chrome.contextMenus.create({
    "title" : "JMT",
    "contexts" : ["selection", "image"],
    "onclick" : clickHandler,
});

// Listen for messages from the popup.
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    console.log("onMessage : " + msg.from);
    if ((msg.from === 'window') && (msg.subject === 'selectedInfo')) {
      response(gSelectedInfo);
    }
    else if ((msg.from === 'content') && (msg.subject === 'selectedText')) {
      gSelectedInfo.selectedText = msg.data
      gSelectedInfo.url = msg.url
    } 
    else if ((msg.from === 'content') && (msg.subject === 'imageUrl')) {
      gSelectedInfo.imageUrl = msg.data
      gSelectedInfo.url = msg.url
    } 
});

chrome.browserAction.onClicked.addListener(function(tab) {
    showWindows(function (result) {
    })
});

var bShowWindow = false
var windowId = -1
function showWindows (callback) {
    if (bShowWindow) {
        bShowWindow = false
        chrome.windows.get(windowId, function(win) {
            if (win === undefined) {
                createWindow(callback)
            } else {
                chrome.windows.remove(windowId)
                chrome.windows.onRemoved.removeListener(windowRemovedListener);
                callback(bShowWindow)
            }
        });
    } else {
        return createWindow(callback)
    }
}

function createWindow(callback) {
    var windowWidth = 450;
    var windowHeight = 325;
    chrome.windows.create(
        {
            url: chrome.runtime.getURL("window.html"),
            type: "popup",
            width : windowWidth,
            height : windowHeight
        }, 
        function(win) {
            windowId = win.id
            bShowWindow = true
            chrome.windows.onRemoved.addListener(windowRemovedListener);
            callback(bShowWindow)
        }
    );
}

function windowRemovedListener(winId) {
    if (winId == windowId) {
        bShowWindow = false
    }
}
