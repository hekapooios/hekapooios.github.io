var template = undefined;
var sort = undefined;
var filter = undefined;
var query = undefined;
var __inited = false;
var __search = undefined;

const __sort_map = {
    "date" : "__date_sort",
    "version" : "__version_sort"
}

function enableSettings(enable) {
    if (enable) {
        document.getElementById("sort-container").classList.remove("disabled");
        document.getElementById("filter-container").classList.remove("disabled");
    } else {
        document.getElementById("sort-container").classList.add("disabled");
        document.getElementById("filter-container").classList.add("disabled");
    }
}

function updateView() {
    if (!__inited) {
        return;
    }

    if (query) {
        enableSettings(false);

        search_results = __search.search(query);
        results = new Array();

        search_results.forEach(function (value, index) {
            results.push(value["item"]);
        })

    } else {
        enableSettings(true);

        var sort_key = __sort_map[sort];
        results = map[filter].roms.sort(function (a, b) {
            return b[sort_key] - a[sort_key];
        });
    }

    rendered = new Array();

    results.forEach(function (value, index) {
        rendered.push(Mustache.render(template, value));
    });

    contents = document.getElementById("contents");

    if (rendered.length) {
        contents.innerHTML = rendered.join("<div class=\"divider\" style=\"margin: 20px auto;\"></div>");
    } else {
        contents.innerHTML = "<div class=\"notfound\">Nothing found!</div>";
    }
}

function segmentControlInit(sortControls, callback) {
    elements = sortControls.querySelectorAll(".segment-control");

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

function initSearch() {
    var map_normalised = new Array();

    for (key in map) {
        map[key].roms.forEach(function (item, _) {
            map_normalised.push(item);
        });
    };

    __search = new Fuse(map_normalised, {
        keys : [
            "name",
            "version",
            "from",
            "desc"
        ],
        threshold : 0.3
    });
}

function initCount() {
    var totalLength = 0;

    for (key in map) {
        totalLength += map[key].roms.length;
    };

    document.getElementById("count").innerText = totalLength;
}

function init() {
    initSearch();

    initCount();

    segmentControlInit(document.getElementById("sort-controls"), function (id) {
        sort = id;
        updateView();
    });

    segmentControlInit(document.getElementById("filter-controls"), function (id) {
        filter = id;
        updateView();
    });

    document.getElementById("search-controls").addEventListener("input", function (event) {
        var srcElement = event.srcElement;
        query = srcElement.value.trim();
        updateView();
    });

    __inited = true;
    updateView();
}

function main() {
    var templatePath = "templates/rom.html?v=4";
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
