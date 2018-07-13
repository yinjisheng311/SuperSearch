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


function get_search_query() {
    return document.getElementById('lst-ib').value
}


function insert_analysis_chart(query) {
    // TODO This function will wait for data response from api script 
    console.log('inserting bar charts');
    var top_result_bar = document.getElementById("appbar");

    var container_div = document.createElement("div");
    container_div.setAttribute("class", "container");
    container_div.setAttribute("style", "padding-left:150px; display:flex;");
    var top_keywords_div = document.createElement("div");
    top_keywords_div.setAttribute("class", "keywords-container");
    top_keywords_div.setAttribute("style", "max-width:20%");
    var header_h4 = document.createElement("h4");
    header_h4.innerHTML = "Top 5 Occurring Keywords";
    var each_keywords_h5 = document.createElement("h5");
    each_keywords_h5.innerHTML = "Whatever";
    top_keywords_div.appendChild(header_h4);
    top_keywords_div.appendChild(each_keywords_h5);
    container_div.appendChild(top_keywords_div);

    var bar_chart_canvas = document.createElement("canvas");
    bar_chart_canvas.setAttribute("id", "barChart");
    bar_chart_canvas.setAttribute("style", "max-width:60%; max-height:50%")
    container_div.appendChild(bar_chart_canvas);

    top_result_bar.insertAdjacentElement("afterend", container_div);

    var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
    if (!location.ancestorOrigins.contains(extensionOrigin)) {
        var script3 = document.createElement("script");
        script3.src = chrome.runtime.getURL("/components/iframe-graph/bar-chart.js");
        container_div.insertAdjacentElement("afterend", script3);
    }
    console.log('done inserting bar charts');

    // // console.log('inserting graph button');
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

    download_button.onclick = function(){open_network_graph(query);};
}


function open_network_graph(query) {
    console.log("sent open network graph");
    var message = {
        type: 'open_network_graph',
        query: query
    }
    chrome.runtime.sendMessage(message);
}


function send_data(query, links) {
    var message = {
        type: 'links',
        query: query,
        links: links
    };
    console.log(message);
    chrome.runtime.sendMessage(message);
}


function recieve_data_callback() {
    return
}


function main() {
    if (is_page_at_google_all_menu()) {
        var links = scrape_search_results();
        var query = get_search_query();

        //
        console.log("List of links ====");
        console.log(links);
        console.log("Query:" + query)

        // listener to render graphs
        chrome.runtime.onMessage.addListener(recieve_data_callback);

        send_data(query, links);
        insert_analysis_chart(query);

    }
}

main();
