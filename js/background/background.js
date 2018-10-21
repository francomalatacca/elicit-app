chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "enable" || request.action === "disable" || request.action === "status") {
        chrome.tabs.query({ active: true }, function(tabs) {
            if (tabs.length === 0) {
                sendResponse({});
                return true;
            }
            for (var tab in tabs) {
                chrome.tabs.sendMessage(tabs[tab].id, { action: request.action, credentials: request.credentials, alias: request.alias }, function(response) {
                    console.log(response.action);
                    sendResponse({ "action": response.action });
                    return true;
                });
            }
            return true;
        });
        return true;
    }
});