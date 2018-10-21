/** 
 * GLOBAL VARIABLES
 */

const __ENVIRONMENT = 'dev';


/**
 * getBaseUrlByNameEnv - manage URL used within the solution
 */
const getBaseUrlByNameEnv = function() {
        let baseUrl = {
            "login": {
                "dev": "http://localhost:3000/users/login",
                "prod": "https://elicit.herokuapp.com/users/login",
            },
            "status": {
                "dev": "http://localhost:3000/status",
                "prod": "https://elicit.herokuapp.com/status"
            }
        }

        function getURL(name, env, obj) {
            return baseUrl[name][env].replace(/{(\w+)}/g, function(_, k) {
                return encodeURIComponent(obj[k]);
            });
        }

        return {
            getURL: getURL
        }
    }
    /* Events */


$(document).ready(function() {
    hideEnableDisable();
    hideCourtain();
    serviceStatus(ManageLoginInterface, ServiceIsUnavailable)
    toggleLoadingView(false);
    __bind();
    gotoCredentialTab();
});

window.onload = function() {
    watchOnChromeRuntime(checkCurrentActivityStatus);
}

function ServiceIsUnavailable() {
    showCourtain("Service Unavailable")
}

function ManageLoginInterface(response) {
    if (response.status && !response.authentication) {
        toggleEnterCredentialView(true);
        gotoCredentialTab();
        updateWithLocalInformationCredentialsView();
    } else if (response.status && response.authentication) {
        toggleEnterCredentialView(false);
    }
}

function gotoCredentialTab() {
    $(".nav-tabs a[href='#elicit-popup-credentials']").tab('show');
    disableFeatures();
}

function hideEnableDisable() {
    $("#elicit-popup-features-on-btn").hide();
    $("#elicit-popup-features-off-btn").hide();
}

function __bind() {
    $("#elicit-popup-features-on-btn").unbind("click").click(function() {
        sendActionToContentScript("enable");
    });

    $("#elicit-popup-features-off-btn").unbind("click").click(function() {
        sendActionToContentScript("disable");
    });

    $("#elicit-popup-credentials-logout-btn").unbind("click").click(function() {
        clearCookies();
        disableFeatures();
        toggleEnterCredentialView(true);
    });

    $("#elicit-popup-credentials-login-btn").unbind("click").click(function() {
        doLogin();
    });
}

/* Messaging */
function checkCurrentActivityStatus() {
    chrome.runtime.sendMessage({ action: "status", credentials: getCredentials(), alias: getAlias() },
        function(response) {
            if (response && response.action != "disabled") {
                toggleFeatureEnableSection(false);
            } else if (response && response.action != "enabled") {
                toggleFeatureEnableSection(true);
            } else {
                console.log("Can't get messages from background");
            }
        });
}

function sendActionToContentScript(action) {
    chrome.runtime.sendMessage({ action: action, credentials: getCredentials(), alias: getAlias() },
        function(response) {
            if (response && response.action == action) {

                if (action === 'disable') {
                    toggleFeatureEnableSection(false);
                }
                if (action === 'enable') {
                    toggleFeatureEnableSection(true);
                }
            } else {
                console.log("Can't get messages from background");
            }
        });
}

function isCredentialInformationStoredLocally() {
    var storedObject = getStoredInformation();
    return storedObject.alias != undefined && storedObject.email != undefined && storedObject.password != undefined;
}

function getStoredInformation() {
    var email = $.cookie('email');
    var alias = $.cookie('alias');
    var password = $.cookie('password');
    return { "email": email, "alias": alias, "password": password }
}

function updateWithLocalInformationCredentialsView() {
    var storedObject = getStoredInformation();

    if (storedObject.email != undefined && storedObject.password != undefined) {
        $("#elicit-popup-credentials-email").val(storedObject.email);
        $("#elicit-popup-credentials-password").val(storedObject.password);
        doLogin();
        $("#elicit-popup-credentials-logout-alias").html('<i>' + storedObject.alias || 'an user' + '</i>');
    }
}

/* View */

function toggleLoadingView(show) {
    $("#elicit-popup-credentials-message").text("");
    $("#elicit-popup-credentials-message").hide();
    if (show) {
        $("#elicit-popup-loading").show();
    } else {
        $("#elicit-popup-loading").hide();
    }
}

function toggleFeatureEnableSection(show) {

    $("#elicit-popup-features-loading").hide();
    if (show) {
        $("#elicit-popup-features-on-btn").show();
        $("#elicit-popup-features-off-btn").hide();
    } else {
        $("#elicit-popup-features-on-btn").hide();
        $("#elicit-popup-features-off-btn").show();
    }
}

function disableFeatureEnableSection(disable) {
    if (disable) {
        $("#elicit-features-on").addClass("disabled");
    } else {
        $("#elicit-features-on").removeClass("disabled");
    }
}
/**
 * 
 * @param {*} show true shows the credentials form, false shows logo
 */
function toggleEnterCredentialView(show) {
    if (show) {
        $(".nav-tabs a[href='#elicit-popup-credentials']").tab('show')
        $("#elicit-popup-credentials-login").show();
        $("#elicit-popup-credentials-logout").hide();
    } else {
        $("#elicit-popup-credentials-login").hide();
        $("#elicit-popup-credentials-logout").show();
    }
}

function doLogin() {
    toggleLoadingView(true);
    serviceLogin(successLogin, failureLogin)
}

function successLogin(user) {
    toggleEnterCredentialView(false);
    toggleLoadingView(false);
    var email = user.email;
    var password = $("#elicit-popup-credentials-password").val();
    var alias = user.alias;
    $("#elicit-popup-credentials-logout-alias").html('<b>' + alias + '</b>');
    $.cookie('email', email, { expires: 14 });
    $.cookie('password', password, { expires: 14 });
    $.cookie('alias', alias, { expires: 14 });
    enableFeatures();
}

function failureLogin(a, b) {
    if (a.status == "401") {
        $("#elicit-popup-credentials-message").html("Username or password are wrong.");
    } else if (a.status == "500") {
        $("#elicit-popup-credentials-message").html("Service error");
    } else {
        $("#elicit-popup-credentials-message").html("Generic error");
    }
    $("#elicit-popup-credentials-message").show();
    toggleEnterCredentialView(true);
    toggleLoadingView(false);
}

/* Service */

function serviceLogin(success, error) {
    var basicAuthenticationString = getCredentials();
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": getBaseUrlByNameEnv().getURL("login", __ENVIRONMENT, {}),
        "method": "POST",
        "headers": {
            "authorization": basicAuthenticationString,
            "content-type": "application/json",
            "cache-control": "no-cache"
        },
        "processData": false
    }
    $.ajax(settings).success(success).error(error);
}

function serviceStatus(success, error) {
    var basicAuthenticationString = getCredentials();
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": getBaseUrlByNameEnv().getURL("status", __ENVIRONMENT, {}),
        "method": "GET",
        "headers": {
            "authorization": basicAuthenticationString,
            "content-type": "application/json",
            "cache-control": "no-cache"
        }
    }
    $.ajax(settings).success(success).error(error);
}

function serviceGetGroups() {}

/* Utils */

function getCredentials() {
    var email = $("#elicit-popup-credentials-email").val();
    var password = $("#elicit-popup-credentials-password").val();
    return baseAuthString(email, password);
}

function getAlias() {
    var alias = $("#elicit-popup-credentials-logout-alias").text();
    return alias
}

function baseAuthString(user, password) {
    var tok = user + ':' + password;
    var hash = btoa(tok);
    return 'Basic ' + hash;
}

function clearCookies() {
    $.removeCookie('email');;
    $.removeCookie('password');
    $.removeCookie('alias');
}

function watchOnChromeRuntime(callback) {
    var t = setInterval(function() {
        if (chrome && chrome.runtime) {
            console.debug("chrome runtime ready to go ***");
            clearInterval(t);
            callback();
        } else {
            //enablePopup();
        }
        console.debug("watch on chrome runtime ***");
    }, 100);
}

function showCourtain(msg) {
    $("#elicit-popup-curtain-text").text(msg)
    $("#elicit-popup-curtain").show();
}

function hideCourtain() {
    $("#elicit-popup-curtain").hide();
}

function disableFeatures() {
    $("ul.nav-tabs li:nth(0) > a").removeAttr("data-toggle");
    $("ul.nav-tabs li:nth(2) > a").removeAttr("data-toggle");
}

function enableFeatures() {
    $("ul.nav-tabs li:nth(0) > a").attr("data-toggle", "tab");
    $("ul.nav-tabs li:nth(2) > a").attr("data-toggle", "tab");
}