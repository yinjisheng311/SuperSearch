console.log("injecting all the necessary libraries");
var link = document.createElement("link");
link.href = "https://code.getmdl.io/1.3.0/material.indigo-pink.min.css";
link.rel = "stylesheet";
document.getElementsByTagName("head")[0].appendChild(link);

var script = document.createElement("script");
script.defer = true;
script.src = "https://code.getmdl.io/1.3.0/material.min.js";
document.getElementsByTagName("head")[0].appendChild(script);

// var script2 = document.createElement("script");
// script2.defer = true;
// script2.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.js";
// document.getElementsByTagName("head")[0].appendChild(script2);

var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
if (!location.ancestorOrigins.contains(extensionOrigin)) {
    
    var script2 = document.createElement("script");
    script2.src = chrome.runtime.getURL("Chart.js");
    document.getElementsByTagName("head")[0].appendChild(script2);
    console.log('loading chart js');

}
console.log('finished loading libraries');