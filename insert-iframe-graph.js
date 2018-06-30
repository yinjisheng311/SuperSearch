console.log('hello');
var main_body_div = document.getElementById("rcnt");
var iframe_div = document.createElement("iframe");
var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
console.log(extensionOrigin);
if (!location.ancestorOrigins.contains(extensionOrigin)) {
    var iframe = document.createElement('iframe');
    // Must be declared at web_accessible_resources in manifest.json
    iframe.src = chrome.runtime.getURL('./components/iframe-graph/iframe-graph.html');

    // Some styles for a fancy sidebar
    // iframe.style.cssText = 'position:fixed;top:0;left:0;display:block;' +
    //     'width:300px;height:100%;z-index:1000;';
    main_body_div.appendChild(iframe);
}
iframe_div.src = "./components/iframe-graph/iframe-graph.html";