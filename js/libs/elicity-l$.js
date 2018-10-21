var l$ = (function(window) {
    let prefix = formatDate(new Date()) + ' elicit -- ';

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        hour = '' + d.getHours();
        minutes = '' + d.getMinutes();
        seconds = '' + d.getSeconds();
        milliseconds = '' + d.getMilliseconds();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-') + ' ' + [hour, minutes, seconds].join(':') + '.' + milliseconds;
    }

    const show = function(el) {
        el.style.display = "inline";
    }

    const hide = function(el) {
        el.style.display = "none";
    }

    const getCoordinates = function(el) {
        let box = el.getBoundingClientRect();

        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };
    }

    const id = function(el) {
        return document.getElementById(el);
    }

    const info = function(...msg) {
        console.log(prefix, msg.join(' '));
    }
    const debug = function(...msg) {
        console.debug(prefix, msg.join(' '));
    }
    const err = function(...msg) {
        console.error(prefix, msg.join(' '));
    }
    return {
        err: err,
        debug: debug,
        info: info
    }
})(window);