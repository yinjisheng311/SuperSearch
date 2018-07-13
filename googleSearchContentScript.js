function is_page_at_google_all_menu() {
    var matchesSnapshot = document.evaluate('//*[@id="hdtb-msb-vis"]/div[1]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    console.log("snapshot length" + matchesSnapshot.snapshotLength.toString());
    if (matchesSnapshot.snapshotLength == 1) {
        var innerhtml = matchesSnapshot.snapshotItem(0).innerHTML;
        var linkRegex = new RegExp('.*href=.*');
        if (!linkRegex.test(innerhtml)) {
            console.log("This is an ALL page");
            return true;
        } else {
            console.log("This is not the page we are looking for");
            return false
        }
    }
}


function scrape_search_results() {
    // scrape the google search results on the menu
    var matchesSnapshot = document.evaluate('//*[@id="rso"]/div/div/div/div/div/h3', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    var links = [];
    for (var i = 0; i < matchesSnapshot.snapshotLength; i++) {
        var match = matchesSnapshot.snapshotItem(i);

        var link = get_link_from_html(match.innerHTML);
        if (link != null) {
            links.push(link);
        }
    }
    return links;
}


function get_link_from_html(innerhtml) {
    // returns the first observed link contained in href='?' in innerhtml
    var regex = /href="([^"]*)"/;
    resultArray = regex.exec(innerhtml);
    //console.log(resultArray);
    if (resultArray == null) {
        return null;
    } else {
        return resultArray['1'];
    }
}


function get_search_query(){
	return document.getElementById('lst-ib').value
}


function insert_analysis_iframe(){
	// TODO This function will wait for data response from api script 
	var top_result_bar = document.getElementById("appbar");
	
	console.log('this is loading');
	var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
	if (!location.ancestorOrigins.contains(extensionOrigin)) {
	    var iframe = document.createElement("iframe");
	    iframe.src = chrome.runtime.getURL("/components/iframe-graph/iframe-graph.html");
	    iframe.width = '1000';
	    iframe.height = '200';
		iframe.className = '.super_iframe';
	    top_result_bar.insertAdjacentElement("afterend", iframe);
	}
	console.log('this is loaded');
}


function main() {
    if (is_page_at_google_all_menu()) {
        var links = scrape_search_results();
		var query = get_search_query();

        console.log("List of links ====");
        console.log(links);
		console.log("Query:"+query)
        // send to background.js

        var message = {
            type: 'links',
            query: query,
            links: links
        };
		console.log(message);
        chrome.runtime.sendMessage(message);
		insert_analysis_iframe()
    }
}

main();
