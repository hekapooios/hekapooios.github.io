function fillTab(tab, tabContents) {
    if (tab.id == "ap-tab") {
        tabContents.innerHTML = Mustache.render(template, map["aps"]);
    } else if (tab.id == "sep-tab") {
        tabContents.innerHTML = Mustache.render(template, map["seps"]);
    } else if (tab.id == "rtkit-tab") {
        tabContents.innerHTML = Mustache.render(template, map["rtkits"]);
    } else if (tab.id == "samsung-tab") {
        tabContents.innerHTML = Mustache.render(template, map["samsungs"]);
    }

    tab.inited = 1;
}

function tabHandler(event) {
    var requestedTab = event.srcElement;
    var activeTab = document.getElementById("tabs").getElementsByClassName("tab-active-dark")[0];

    if (requestedTab == activeTab) 
        return;

    if (activeTab) {
        activeTab.classList.remove("tab-active-dark");
        document.getElementById(activeTab.id + "-contents").hidden = true;
    }

    requestedTab.classList.add("tab-active-dark");

    var requestedTabContents = document.getElementById(requestedTab.id + "-contents");
    requestedTabContents.hidden = false;

    if (!requestedTab.inited) {
        fillTab(requestedTab, requestedTabContents);
    }
}

var template = undefined;

function main() {
    var templatePath = "templates/rom.html?v=3";
    var xhr = new XMLHttpRequest();

    xhr.open("GET", templatePath, true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;

        if (xhr.status != 200) {
            alert("Wow, this is unexpected, but we really couldn't load the template!");
        } else {
            template = xhr.responseText;
            
            var tabs = document.getElementById("tabs").getElementsByClassName("tab");

			for (var i = 0; i < tabs.length; i++) {
				tabs[i].onclick = tabHandler;
			}

            tabHandler({srcElement : document.getElementById("ap-tab")});
        }
    }
}
