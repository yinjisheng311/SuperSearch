console.log('super search launched');
var main_body_div = document.getElementById("rcnt");
var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
if (!location.ancestorOrigins.contains(extensionOrigin)) {
    var iframe = document.createElement('iframe');
    // iframe.setAttribute("class", "iframe-con");
    // Must be declared at web_accessible_resources in manifest.json
    iframe.src = chrome.runtime.getURL('./components/iframe-graph/iframe-graph.html');
    iframe.style.src = "./components/iframe-graph/iframe-graph.css";
    // Some styles for a fancy sidebar
    main_body_div.appendChild(iframe);
}