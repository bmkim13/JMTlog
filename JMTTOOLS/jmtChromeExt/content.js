'use strict';

document.addEventListener('mouseup',function(event) {
    if (event.ctrlKey && event.shiftKey) {
        var sel = window.getSelection().toString();
        if(sel.length) {
            removeAllElements();
            selectedTexts = "";
            chrome.runtime.sendMessage(
                {
                    from: "content",
                    subject: "selectedText",
                    url: event.target.href,
                    data: sel
                });
        }
    }
})

var selectedTexts = ""
document.addEventListener('mousedown',function(event) {
    if (event.ctrlKey && !event.altKey) {
        if (event.target.nodeName == "IMG") {
            highlightImg(event.srcElement);
            chrome.runtime.sendMessage(
                {
                    from: "content",
                    subject: "imageUrl",
                    url: event.target.href,
                    data: event.target.src
                });
        } else if (isTextTag(event.target.nodeName)) {
            if (isAdded(event.target)) {
                removeElement(event.target);
                selectedTexts = makeTextFromSelected();
            } else {
                addElement(event.target);
                selectedTexts += event.target.innerText
            }
            chrome.runtime.sendMessage(
                {
                    from: "content",
                    subject: "selectedText",
                    url: event.target.href,
                    data: selectedTexts
                });
        }
    } else if (event.ctrlKey && event.altKey) {
        selectedTexts = ""
        removeAllElements();
        chrome.runtime.sendMessage(
            {
                from: "content",
                subject: "selectedText",
                url: event.target.href,
                data: ""
            });
    }
})

function makeTextFromSelected() {
    var result = "";
    for (var i = 0; i < selectedElements.length; i++) {
        result += selectedElements[i].innerText
    }
    return result;
}

function isTextTag(nodeName){
    if (nodeName == "P")
        return true;
    if (nodeName == "BLOCKQUOTE")
        return true;

    if (nodeName.innerText !== undefined && !(nodeName.innerText.length === 0 || !nodeName.innerText.trim()))
        return true;
        
    return false;
}

var selectedElements = [];
function isAdded(srcElement) {
     return selectedElements.includes(srcElement)
}

var MOUSE_SELECTED_TEXT_CLASSNAME = 'mouse_selected_text';
function addElement(srcElement) {
    srcElement.classList.add(MOUSE_SELECTED_TEXT_CLASSNAME);
    selectedElements.push(srcElement);
}

function removeElement(srcElement) {
    srcElement.classList.remove(MOUSE_SELECTED_TEXT_CLASSNAME);
    selectedElements = selectedElements.filter(function( obj ) {
        return obj !== srcElement;
    });
}

function removeAllElements() {
    for (var i = 0; i < selectedElements.length; i++) {
        selectedElements[i].classList.remove(MOUSE_SELECTED_TEXT_CLASSNAME);
    }
    selectedElements = [];
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

