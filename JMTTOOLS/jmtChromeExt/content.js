
document.addEventListener('mouseup',function(event) {
    if (event.shiftKey) {
        var sel = window.getSelection().toString();
        if(sel.length) {
            chrome.runtime.sendMessage(
                {
                    from: "content",
                    subject: "selectedText",
                    url: event.target.href,
                    data: sel
                });
        }

        if (event.target.nodeName == "IMG") {
            chrome.runtime.sendMessage(
                {
                    from: "content",
                    subject: "imageUrl",
                    url: event.target.href,
                    data: event.target.src
                });
        }
        
    }
})

