
document.addEventListener('mouseup',function(event) {
    if (event.shiftKey) {
        var sel = window.getSelection().toString();
        if(sel.length) {
            highlightText(event.target);
            chrome.runtime.sendMessage(
                {
                    from: "content",
                    subject: "selectedText",
                    url: event.target.href,
                    data: sel
                });
        }
        if (event.altKey) {
            chrome.runtime.sendMessage(
                {
                    from: "content",
                    subject: "selectedText",
                    url: event.target.href,
                    data: ""
                });
        }
    }
})

var selectedText = null

document.addEventListener('mousedown',function(event) {
    if (event.shiftKey) {
        if (event.target.nodeName == "IMG") {
            highlightImg(event.srcElement);
            chrome.runtime.sendMessage(
                {
                    from: "content",
                    subject: "imageUrl",
                    url: event.target.href,
                    data: event.target.src
                });
        }
        if (event.ctrlKey) {
            if (event.target.nodeName == "P") {
                highlightText(event.target);
                if (selectedText == null) {
                    selectedText = event.target.innerText
                } else {
                    selectedText += event.target.innerText
                }
                chrome.runtime.sendMessage(
                    {
                        from: "content",
                        subject: "selectedText",
                        url: event.target.href,
                        data: selectedText
                    });
            }
        } else if (event.target.nodeName == "P") {
            highlightText(event.target);
            selectedText = event.target.innerText
            chrome.runtime.sendMessage(
                {
                    from: "content",
                    subject: "selectedText",
                    url: event.target.href,
                    data: selectedText
                });
        }
    }
})

var prevText = null;
var MOUSE_SELECTED_TEXT_CLASSNAME = 'mouse_selected_text';
function highlightText(srcElement) {
    if (prevText != null) {
        prevText.classList.remove(MOUSE_SELECTED_TEXT_CLASSNAME);
    }
    srcElement.classList.add(MOUSE_SELECTED_TEXT_CLASSNAME);
    prevText = srcElement;
    
}


var prevImg = null;
var MOUSE_SELECTED_IMG_CLASSNAME = 'mouse_selected_image';
function highlightImg(srcElement) {
    if (prevImg != null) {
        prevImg.classList.remove(MOUSE_SELECTED_IMG_CLASSNAME);
    }
    srcElement.classList.add(MOUSE_SELECTED_IMG_CLASSNAME);
    prevImg = srcElement;
}

