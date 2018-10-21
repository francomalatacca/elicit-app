var e$ = (function(window) {
    const show = function(el) {
        el.style.display = 'block';
        el.style.opacity = 1;
    }

    const hide = function(el) {
        el.style.display = 'none';
    }

    const id = function(el) {
        return document.getElementById(el);
    }


    const getSelector = function(el) {
        if (!el) {
            return;
        }
        var stack = [];
        var isShadow = false;
        while (el.parentNode != null) {
            // console.log(el.nodeName);
            var sibCount = 0;
            var sibIndex = 0;
            // get sibling indexes
            for (var i = 0; i < el.parentNode.childNodes.length; i++) {
                var sib = el.parentNode.childNodes[i];
                if (sib.nodeName == el.nodeName) {
                    if (sib === el) {
                        sibIndex = sibCount;
                    }
                    sibCount++;
                }
            }
            // if ( el.hasAttribute('id') && el.id != '' ) { no id shortcuts, ids are not unique in shadowDom
            //   stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
            // } else
            var nodeName = el.nodeName.toLowerCase();
            if (isShadow) {
                nodeName += "::shadow";
                isShadow = false;
            }
            if (sibCount > 1) {
                stack.unshift(nodeName + ':nth-of-type(' + (sibIndex + 1) + ')');
            } else {
                stack.unshift(nodeName);
            }
            el = el.parentNode;
            if (el.nodeType === 11) { // for shadow dom, we
                isShadow = true;
                el = el.host;
            }
        }
        stack.splice(0, 1); // removes the html element
        return stack.join(' > ');

    }

    /**
     * prettyDate - generates a nice to read date/time
     * @param {*} time - date/time in JavaScript
     */
    var prettyDate = function(time) {
        var date = new Date((time || "").replace(/-/g, "/").replace(/[TZ]/g, " ")),
            diff = (((new Date()).getTime() - date.getTime()) / 1000),
            day_diff = Math.floor(diff / 86400);

        if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31)
            return;

        return day_diff == 0 && (
                diff < 60 && "just now" ||
                diff < 120 && "1 minute ago" ||
                diff < 3600 && Math.floor(diff / 60) + " minutes ago" ||
                diff < 7200 && "1 hour ago" ||
                diff < 86400 && Math.floor(diff / 3600) + " hours ago") ||
            day_diff == 1 && "Yesterday" ||
            day_diff < 7 && day_diff + " days ago" ||
            day_diff < 31 && Math.ceil(day_diff / 7) + " weeks ago";
    }

    /**
     * md5 - generates a md5 hash for a given string
     */
    const md5 = function() {
        var t = function(n, t) { var r = (65535 & n) + (65535 & t); return (n >> 16) + (t >> 16) + (r >> 16) << 16 | 65535 & r }

        var r = function(n, t) { return n << t | n >>> 32 - t }

        var e = function(n, e, o, u, c, f) { return t(r(t(t(e, n), t(u, f)), c), o) }

        var o = function(n, t, r, o, u, c, f) { return e(t & r | ~t & o, n, t, u, c, f) }

        var u = function(n, t, r, o, u, c, f) { return e(t & o | r & ~o, n, t, u, c, f) }

        var c = function(n, t, r, o, u, c, f) { return e(t ^ r ^ o, n, t, u, c, f) }

        var f = function(n, t, r, o, u, c, f) { return e(r ^ (t | ~o), n, t, u, c, f) }

        var i = function(n, r) {
            n[r >> 5] |= 128 << r % 32, n[14 + (r + 64 >>> 9 << 4)] = r;
            var e, i, a, d, h, l = 1732584193,
                g = -271733879,
                v = -1732584194,
                m = 271733878;
            for (e = 0; e < n.length; e += 16) i = l, a = g, d = v, h = m, g = f(g = f(g = f(g = f(g = c(g = c(g = c(g = c(g = u(g = u(g = u(g = u(g = o(g = o(g = o(g = o(g, v = o(v, m = o(m, l = o(l, g, v, m, n[e], 7, -680876936), g, v, n[e + 1], 12, -389564586), l, g, n[e + 2], 17, 606105819), m, l, n[e + 3], 22, -1044525330), v = o(v, m = o(m, l = o(l, g, v, m, n[e + 4], 7, -176418897), g, v, n[e + 5], 12, 1200080426), l, g, n[e + 6], 17, -1473231341), m, l, n[e + 7], 22, -45705983), v = o(v, m = o(m, l = o(l, g, v, m, n[e + 8], 7, 1770035416), g, v, n[e + 9], 12, -1958414417), l, g, n[e + 10], 17, -42063), m, l, n[e + 11], 22, -1990404162), v = o(v, m = o(m, l = o(l, g, v, m, n[e + 12], 7, 1804603682), g, v, n[e + 13], 12, -40341101), l, g, n[e + 14], 17, -1502002290), m, l, n[e + 15], 22, 1236535329), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 1], 5, -165796510), g, v, n[e + 6], 9, -1069501632), l, g, n[e + 11], 14, 643717713), m, l, n[e], 20, -373897302), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 5], 5, -701558691), g, v, n[e + 10], 9, 38016083), l, g, n[e + 15], 14, -660478335), m, l, n[e + 4], 20, -405537848), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 9], 5, 568446438), g, v, n[e + 14], 9, -1019803690), l, g, n[e + 3], 14, -187363961), m, l, n[e + 8], 20, 1163531501), v = u(v, m = u(m, l = u(l, g, v, m, n[e + 13], 5, -1444681467), g, v, n[e + 2], 9, -51403784), l, g, n[e + 7], 14, 1735328473), m, l, n[e + 12], 20, -1926607734), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 5], 4, -378558), g, v, n[e + 8], 11, -2022574463), l, g, n[e + 11], 16, 1839030562), m, l, n[e + 14], 23, -35309556), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 1], 4, -1530992060), g, v, n[e + 4], 11, 1272893353), l, g, n[e + 7], 16, -155497632), m, l, n[e + 10], 23, -1094730640), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 13], 4, 681279174), g, v, n[e], 11, -358537222), l, g, n[e + 3], 16, -722521979), m, l, n[e + 6], 23, 76029189), v = c(v, m = c(m, l = c(l, g, v, m, n[e + 9], 4, -640364487), g, v, n[e + 12], 11, -421815835), l, g, n[e + 15], 16, 530742520), m, l, n[e + 2], 23, -995338651), v = f(v, m = f(m, l = f(l, g, v, m, n[e], 6, -198630844), g, v, n[e + 7], 10, 1126891415), l, g, n[e + 14], 15, -1416354905), m, l, n[e + 5], 21, -57434055), v = f(v, m = f(m, l = f(l, g, v, m, n[e + 12], 6, 1700485571), g, v, n[e + 3], 10, -1894986606), l, g, n[e + 10], 15, -1051523), m, l, n[e + 1], 21, -2054922799), v = f(v, m = f(m, l = f(l, g, v, m, n[e + 8], 6, 1873313359), g, v, n[e + 15], 10, -30611744), l, g, n[e + 6], 15, -1560198380), m, l, n[e + 13], 21, 1309151649), v = f(v, m = f(m, l = f(l, g, v, m, n[e + 4], 6, -145523070), g, v, n[e + 11], 10, -1120210379), l, g, n[e + 2], 15, 718787259), m, l, n[e + 9], 21, -343485551), l = t(l, i), g = t(g, a), v = t(v, d), m = t(m, h);
            return [l, g, v, m]
        }

        var a = function(n) {
            var t, r = "",
                e = 32 * n.length;
            for (t = 0; t < e; t += 8) r += String.fromCharCode(n[t >> 5] >>> t % 32 & 255);
            return r
        }

        var d = function(n) { var t, r = []; for (r[(n.length >> 2) - 1] = void 0, t = 0; t < r.length; t += 1) r[t] = 0; var e = 8 * n.length; for (t = 0; t < e; t += 8) r[t >> 5] |= (255 & n.charCodeAt(t / 8)) << t % 32; return r }

        var h = function(n) { return a(i(d(n), 8 * n.length)) }

        var l = function(n, t) {
            var r, e, o = d(n),
                u = [],
                c = [];
            for (u[15] = c[15] = void 0, o.length > 16 && (o = i(o, 8 * n.length)), r = 0; r < 16; r += 1) u[r] = 909522486 ^ o[r], c[r] = 1549556828 ^ o[r];
            return e = i(u.concat(d(t)), 512 + 8 * t.length), a(i(c.concat(e), 640))
        }

        var g = function(n) { var t, r, e = ""; for (r = 0; r < n.length; r += 1) t = n.charCodeAt(r), e += "0123456789abcdef".charAt(t >>> 4 & 15) + "0123456789abcdef".charAt(15 & t); return e }

        var v = function(n) { return unescape(encodeURIComponent(n)) }

        var m = function(n) { return h(v(n)) }

        var p = function(n) { return g(m(n)) }

        var s = function(n, t) { return l(v(n), v(t)) }

        var C = function(n, t) { return g(s(n, t)) }

        var A = function(n, t, r) { return t ? r ? s(t, n) : C(t, n) : r ? m(n) : p(n) }

        return {
            calculate: A
        }
    }

    const getNavigatorInfo = function(navigator) {
        return {
            appCodeName: navigator.appCodeName,
            appName: navigator.appName,
            appVersion: navigator.appVersion,
            connection: {
                downlink: navigator.connection.downlink,
                effectiveType: navigator.connection.effectiveType
            },
            cookieEnabled: navigator.cookieEnabled,
            language: navigator.language,
            maxTouchPoints: navigator.maxTouchPoints,
            platform: navigator.platform,
            product: navigator.product,
            productSub: navigator.productSub,
            userAgent: navigator.userAgent,
            vendor: navigator.vendor
        }
    }

    const getCoordinates = function(el) {
        let box = el.getBoundingClientRect();
        return {
            "top": box.top,
            "left": box.left,
            "right": box.right,
            "bottom": box.bottom,
            "height": (box).heightbox,
            "width": (box).width,
            "x": box.x,
            "y": box.y,
            "screen_height": window.screen.height,
            "screen_width": window.screen.width,
            "window_height": window.innerHeight,
            "window_width": window.innerWidth,
            "document_height": Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight),
            "document_width": Math.max(document.body.scrollWidth, document.body.offsetWidth, document.documentElement.clientWidth, document.documentElement.scrollWidth, document.documentElement.offsetWidth)
        }
    }

    const getLocation = function(location) {
        return {
            "host": location.host,
            "hostname": location.hostname,
            "href": location.href,
            "origin": location.origin,
            "pathname": localStorage.pathname,
            "port": location.port,
            "protocol": location.protocol,
            "protocol": location.search
        }
    }

    const getSelectionText = function(document) {
        var text = "";
        var activeEl = document.activeElement;
        var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
        if (
            (activeElTagName == "textarea") || (activeElTagName == "input" &&
                /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
            (typeof activeEl.selectionStart == "number")
        ) {
            text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
        } else if (window.getSelection) {
            text = window.getSelection().toString();
        }
        return text;
    }

    const fadeOut = function(el) {
        el.style.opacity = 1;

        (function fade() {
            if ((el.style.opacity -= .1) < 0) {
                el.style.display = "none";
            } else {
                requestAnimationFrame(fade);
            }
        })();
    }

    return {
        id: id,
        show: show,
        hide: hide,
        fadeOut: fadeOut,
        getSelector: getSelector,
        getSelectionText: getSelectionText,
        prettyDate: prettyDate,
        getCoordinates: getCoordinates,
        getNavigatorInfo: getNavigatorInfo,
        getLocation: getLocation,
        md5: md5

    }
})(window);