console.log("injecting all the necessary libraries");
var link = document.createElement("link");
link.href = "https://code.getmdl.io/1.3.0/material.indigo-pink.min.css";
link.rel = "stylesheet";
document.getElementsByTagName("head")[0].appendChild(link);

var script = document.createElement("script");
script.defer = true;
script.src = "https://code.getmdl.io/1.3.0/material.min.js";
document.getElementsByTagName("head")[0].appendChild(script);

// var link2 = document.createElement("link");
// link2.href = "https://cdn.graphalchemist.com/alchemy.min.css";
// link2.rel = "stylesheet";
// document.getElementsByTagName("head")[0].appendChild(link2);


// var link3 = document.createElement("link");
// link3.href = "https://cdn.graphalchemist.com/alchemy.0.2.min.css";
// link3.rel = "stylesheet";
// document.getElementsByTagName("head")[0].appendChild(link3);

// var script3 = document.createElement("script");
// script3.type = "text/javascript";
// script3.src = "https://cdn.graphalchemist.com/alchemy.0.2.min.js";
// document.getElementsByTagName("head")[0].appendChild(script3);

var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
if (!location.ancestorOrigins.contains(extensionOrigin)) {
    // var script2 = document.createElement("script");
    // script2.type = "text/javascript";
    // script2.src = chrome.runtime.getURL("d3/d3.min.js");
    // document.getElementsByTagName("head")[0].appendChild(script2);

    // var link2 = document.createElement("link");
    // link2.href = chrome.runtime.getURL("sigma_build/styles/vendor.css");
    // link2.rel = "stylesheet";
    // document.getElementsByTagName("head")[0].appendChild(link2);

    // var link3 = document.createElement("link");
    // link3.href = chrome.runtime.getURL("alchemy.js/alchemy.css");
    // link3.rel = "stylesheet";
    // document.getElementsByTagName("head")[0].appendChild(link3);

    // var script2 = document.createElement("script");
    // script2.type = "text/javascript";
    // script2.src = chrome.runtime.getURL("sigma_build/sigma.min.js");
    // document.getElementsByTagName("body")[0].appendChild(script2);

    // var script3 = document.createElement("script");
    // script3.type = "text/javascript";
    // script3.src = chrome.runtime.getURL("sigma_build/plugins/sigma.parsers.json.min.js");
    // document.getElementsByTagName("body")[0].appendChild(script3);
}
// <link rel="stylesheet" type="text/css" href="path/to/vendor.css">
// <link rel="stylesheet" href="path/to/alchemy.css">
// <script type="text/javascript" src="path/to/vendor.js">
// <script type="text/javascript" src="path/to/alchemy.js">
// "alchemy.js/alchemy.css",
// "alchemy.js/styles/vendor.css",
// "alchemy.js/scripts/vendor.js",
// "alchemy.js/alchemy.js"