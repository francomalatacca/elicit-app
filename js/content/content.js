let elicitApp = (function(settings) {
    let comment = null;
    let service = null;

    class CommentManager {
        loadCommentsByURLProject(url, topic) {
            highlightElements.forEach(el => {
                el.removeEventListener("mouseover", addClassHighLight, false);
                el.removeEventListener("mouseleave", removeClassHighlight);
                el.removeEventListener("click", addDialog);
                disposeCommentDialog();
            });
        }



        enableHighlight() {
            [].forEach.call(document.body.querySelectorAll('*'), function(element) {
                if (element.id.indexOf('elicit') < 0) {
                    highlightElements.push(element);
                    element.addEventListener("mouseover", addClassHighLight, false);
                    element.addEventListener("mouseleave", removeClassHighlight);
                    element.addEventListener("click", addDialog);
                }
            });
        }

        showNewCommentDialog() { console.log("commentDialog:New:show") }

        hideNewCommentDialog() { console.log("commentDialog:New:hide") }

        showListOfComments() { console.log("commentDialog:List:show") }

        hideListOfComments() { console.log("commentDialog:List:hide") }
    }

    class ServiceManager {
        saveComment() {

        }
        loadCommentsByUrl() {

        }
    }

    //#region pre-init
    let preinit = () => {
        __watchOnChromeRuntime(__addListenerToChromeRuntime, settings.chromeRuntimeWatchInterval || 100);
    }

    const __watchOnChromeRuntime = (callback, interval) => {
        let t = setInterval(function() {
            if (chrome && chrome.runtime && chrome.runtime.onMessage) {
                clearInterval(t);
                callback();
            }
            l$.debug("content - watch on chrome runtime ***");
        }, interval);
    }

    const __addListenerToChromeRuntime = () => {
        if (chrome && chrome.runtime && chrome.runtime.onMessage) {
            l$.debug("chrome.runtime and onMessage are defined");
            chrome.runtime.onMessage.addListener(__dispatchActionOnRequest);
        }
    }

    //#endregion

    const __dispatchActionOnRequest = (request, sender, sendResponse) => {
        if (request.action === 'enable' && (!status)) {
            __action = "enable";
            //start();
        } else if (request.action === 'disable' && (status)) {
            __action = "disable";
            //stop()
        } else if (request.action === 'status' && status !== undefined) {
            __action = status ? "enabled" : "disabled";
        }
        sendResponse({ "action": __action });
        return true;
    }

    const start = () => {
        service = new Service();
        cm = new CommentManager();
        __action = "enable";
        this.credentials = request.credentials;
        window.elicit = window.elicit || {};
        window.elicit.credentials = request.credentials;
        window.elicit.alias = request.alias;
        window.elicit.status = true;
        setupController(cm);
    }

    const setupController = (cm) => {
        //loadCommentsByURLProject(location.href, "public");
        document.getElementById("elicit-menu-button-show-comments").addEventListener("click", function() {
            cm.loadCommentsByURLProject(location.href, "public");
        });
        document.getElementById("elicit-menu-button-write-comments").addEventListener("click", function() {
            cm.enableHighlight();
        });

    }

    const stop = () => {
        unbindEvents();
        dismissController();
    }

})({
    chromeRuntimeWatchInterval: 100
});