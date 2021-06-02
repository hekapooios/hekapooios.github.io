function fillTab(tab, tabContents) {

	if (!parsed) {
		tabContents.innerHTML = "Error loading tab";
		return;
	}

	var template = "templates/rom.html";

	var xhr = new XMLHttpRequest();

	xhr.open("GET", template, true);
	xhr.send();
	xhr.onreadystatechange = function() {

		if (xhr.readyState != 4) return;

		if (xhr.status != 200) {
		    tabContents.innerHTML = "Error loading template";
		} else {

			var templateText = xhr.responseText;

			if (tab.id == "ap-tab")
				tabContents.innerHTML = Mustache.render(templateText, parsed["aps"]);
			else if (tab.id == "sep-tab")
				tabContents.innerHTML = Mustache.render(templateText, parsed["seps"]);

			tab.inited = 1;

		}

	}

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

var parsed = undefined;

function main() {

	var mainElement = document.getElementById("main");
	var errorElement = document.getElementById("error");
	var footerElement = document.getElementsByTagName("footer")[0];

	var xhr = new XMLHttpRequest();

	xhr.open("GET", "resources/index.json?v=9", true);
	xhr.send();
	xhr.onreadystatechange = function() {

		if (xhr.readyState != 4) return;

		if (xhr.status != 200) {
		    errorElement.hidden = false;
		} else {

			try {
				parsed = JSON.parse(xhr.responseText);
			} catch (error) {
				errorElement.hidden = false;
				return;
			}

			var tabs = document.getElementById("tabs").getElementsByClassName("tab");

			for (var i = 0; i < tabs.length; i++) {
				tabs[i].onclick = tabHandler;
			}

			tabHandler({srcElement : document.getElementById("ap-tab")});

		    mainElement.hidden = false;
		    footerElement.hidden = false;

		}

		
	};

	return false;

}
