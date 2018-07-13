console.log('super search launched');


var result_stats_bar = document.getElementById("resultStats");
var download_button = document.createElement("button");


download_button.setAttribute("class", "mdl-button mdl-js-button mdl-button--raised");
// download_button.innerHTML = "Relationship Graph";
download_button.setAttribute("style", "float:right; margin-right:1rem; margin-top:1rem;");
var versions_icon = document.createElement("i");
versions_icon.setAttribute("class", "material-icons")
versions_icon.innerHTML = "mood";
download_button.appendChild(versions_icon);
result_stats_bar.insertAdjacentElement("afterend", download_button);

var top_result_bar = document.getElementById("appbar");
console.log('this is loading');
var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
if (!location.ancestorOrigins.contains(extensionOrigin)) {
    var iframe = document.createElement("iframe");
    iframe.src = chrome.runtime.getURL("/components/iframe-graph/iframe-graph.html");
    iframe.width = '1000';
    iframe.height = '200';
    top_result_bar.insertAdjacentElement("afterend", iframe);
}
console.log('this is loaded');