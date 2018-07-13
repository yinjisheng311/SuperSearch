//chrome.runtime.onInstalled.addLisener(function() {
// Initialization 

// Set up Listeners
//});


chrome.webNavigation.onDOMContentLoaded.addListener(
    function(details) {
        // inject content script which checks if it is a valid google search page
        chrome.tabs.executeScript({
            file: 'googleSearchContentScript.js'
        });
    }, {
        url: [{
            urlMatches: 'https://www\.google[^/]+/search\?.*'
        }]
    }
)
