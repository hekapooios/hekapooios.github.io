var template = undefined;
var sortNewFirst = undefined;
var type = undefined;
var query = undefined;
var __inited = false;
var __search_map = new Array();

function enableSettings(enable) {
    if (enable) {
        document.getElementById("sort-controls").classList.remove("disabled");
    } else {
        document.getElementById("sort-controls").classList.add("disabled");
    }
}

var NOT_FOUND_HTML = "<div class=\"notfound\">Nothing found!</div>";

function updateView() {
    if (!__inited) {
        return;
    }

    if (query) {
        enableSettings(false);

        search_results = __search_map[type].search(query);
        results = new Array();

        search_results.forEach(function (value, index) {
            results.push(value["item"]);
        })

    } else {
        enableSettings(true);
        results = map[type].slice();
    }

    contents = document.getElementById("contents");

    if (results.length) {
        if (!query && sortNewFirst) {
            results.reverse();
        }

        // fuck JavaScript for not having a sane way to make a deep copy
        results[results.length-1]["last"] = true;
        contents.innerHTML = Mustache.render(template, results);
        results[results.length-1]["last"] = false;

    } else {
        contents.innerHTML = NOT_FOUND_HTML;
    }
}

function initSearch() {
    for (key in map) {
        __search_map[key] = new Fuse(map[key], {
            keys : [
                "title",
                "subtitle",
                "devices",
                "roms.title"
            ],
            threshold : 0.0,
            minMatchCharLength : true,
            ignoreLocation : true
        });
    };
}

function initCount() {
    var totalLength = 0;

    for (key in map) {
        for (soc of map[key]) {
            totalLength += soc.roms.length;
        }
    }

    document.getElementById("count").innerText = totalLength;
}

function init() {
    initCount();
    initSearch();

    segmentControlInit(document.getElementById("type-controls"), function (id) {
        type = id;
        updateView();
    });

    sortNewFirst = true;
    document.getElementById("sort-controls").onclick = function (e) {
        sortNewFirst = !sortNewFirst;
        if (!sortNewFirst) {
            e.srcElement.setAttribute("style", "transform: rotate(" + 180 + "deg)");
        } else {
            e.srcElement.setAttribute("style", undefined);
        }
        updateView();
    };

    document.getElementById("search-controls").addEventListener("input", function (event) {
        var srcElement = event.srcElement;
        query = srcElement.value.trim();
        updateView();
    });

    __inited = true;
    updateView();
}

function main() {
    var templatePath = "templates/soc.html?v=0";
    var xhr = new XMLHttpRequest();

    xhr.open("GET", templatePath, true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;

        if (xhr.status != 200) {
            alert("Wow, this is unexpected, but we really couldn't load the template!");
        } else {
            template = xhr.responseText;
            init();
        }
    }
}

function segmentControlInit(rootElement, callback) {
    elements = rootElement.querySelectorAll(".segment-control");

    for (var index = 0; index < elements.length; index++) {
        const element = elements[index];
        element.onclick = function (event) {
            var srcElement = event.srcElement;
            srcElement.parentElement.querySelector(".segment-control-active").classList.remove("segment-control-active");
            srcElement.classList.add("segment-control-active");
            callback(srcElement.id);
        };

        if (index == 0) {
            element.classList.add("segment-control-active");
            callback(element.id);
        }
    }
}
