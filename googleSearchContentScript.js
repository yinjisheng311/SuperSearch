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
    // // TODO This function will wait for data response from api script 
    // console.log('inserting bar charts');
    // var top_result_bar = document.getElementById("appbar");

    // var container_div = document.createElement("div");
    // container_div.setAttribute("class", "container");
    // container_div.setAttribute("style", "padding-left:150px; display:flex;");
    // var top_keywords_div = document.createElement("div");
    // top_keywords_div.setAttribute("class", "keywords-container");
    // top_keywords_div.setAttribute("style", "max-width:20%; margin-right:2rem;");
    // var header_h4 = document.createElement("h6");
    // header_h4.innerHTML = "Top 5 Most Relevant Keywords";
    // var each_keywords = document.createElement("a");
    // each_keywords.innerHTML = "whatever";
    // top_keywords_div.appendChild(header_h4);
    // top_keywords_div.appendChild(each_keywords);
    // container_div.appendChild(top_keywords_div);

    // var bar_chart_canvas = document.createElement("canvas");
    // bar_chart_canvas.setAttribute("id", "barChart");
    // bar_chart_canvas.setAttribute("style", "max-width:40%; max-height:20%")
    // container_div.appendChild(bar_chart_canvas);

    // top_result_bar.insertAdjacentElement("afterend", container_div);

    // var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
    // if (!location.ancestorOrigins.contains(extensionOrigin)) {
    //     var script3 = document.createElement("script");
    //     script3.src = chrome.runtime.getURL("/components/iframe-graph/bar-chart.js");
    //     container_div.insertAdjacentElement("afterend", script3);
    // }
    // console.log('done inserting bar charts');

    // // // console.log('inserting graph button');
    // var result_stats_bar = document.getElementById("resultStats");
    // var relation_entity_button = document.createElement("button");


    // relation_entity_button.setAttribute("class", "mdl-button mdl-js-button mdl-button--raised");
    // relation_entity_button.innerHTML = "Relationship Graph";
    // relation_entity_button.setAttribute("style", "float:right; margin-right:1rem; margin-top:1rem;");
    // // var versions_icon = document.createElement("i");
    // // versions_icon.setAttribute("class", "material-icons")
    // // versions_icon.innerHTML = "mood";
    // // relation_entity_button.appendChild(versions_icon);
    // result_stats_bar.insertAdjacentElement("afterend", relation_entity_button);

    // relation_entity_button.onclick = function(){open_network_graph(query);};
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

var data = null
function recieve_data_callback(data) {
	//render G graphs
    return
}

function initialiseGraphs() {
    var top_result_bar = document.getElementById("appbar");

    var container_div = document.createElement("div");
    container_div.setAttribute("class", "container");
    container_div.setAttribute("style", "padding-left:150px; display:flex; align-items:center; justify-content:space-between;");

    // var top_keywords_div = document.createElement("div");
    // top_keywords_div.setAttribute("class", "keywords-container");

    var keywords_table = document.createElement("table");
    keywords_table.setAttribute("class", "mdl-data-table mdl-js-data-table mdl-shadow--2dp");
    var thead = document.createElement("thead");
    keywords_table.appendChild(thead);
    var tr = document.createElement("tr");
    thead.appendChild(tr);
    var th1 = document.createElement("th");
    th1.setAttribute("style", "mdl-data-table__cell--non-numeric");
    th1.innerHTML = "Keywords";
    tr.appendChild(th1);
    var th2 = document.createElement("th");
    th2.setAttribute("style", "mdl-data-table__cell--non-numeric");
    th2.innerHTML = "Score";
    tr.appendChild(th2);

    container_div.appendChild(keywords_table);

    var bar_chart_canvas = document.createElement("canvas");
    bar_chart_canvas.setAttribute("id", "barChart");
    bar_chart_canvas.setAttribute("style", "max-width:40%; max-height:20%");
    container_div.appendChild(bar_chart_canvas);
    top_result_bar.insertAdjacentElement("afterend", container_div);

}

function formatJson(json) {
    let labels = [];
    let data = [];
    for (let i = 0; i < json.length; i++) {
        labels.push(json[i].entity);
        data.push(json[i].frequency);
    }
    console.log(labels);
    console.log(data);
    return [labels, data];
}


function displayBarChart(json) {
    formattedJson = formatJson(json);
    labels = formattedJson[0];
    console.log(labels);
    data = formattedJson[1];
    console.log(data);
    console.log('loading barchart.js');
    var container_div = document.getElementsByClassName("container");

    var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
    if (!location.ancestorOrigins.contains(extensionOrigin)) {
        var script3 = document.createElement("script");
        script3.innerHTML = `console.log('running bar chart ');
        var ctx = document.getElementById("barChart").getContext('2d');

        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [` + data + `],
                datasets: [{
                    label: '# of Votes',
                    data: [` + data + `],
                    backgroundColor: [
                        'rgba(28, 115, 231, 1)',
                        'rgba(28, 115, 231, 0.8)',
                        'rgba(28, 115, 231, 0.6)',
                        'rgba(28, 115, 231, 0.4)',
                        'rgba(28, 115, 231, 0.2)',
                        'rgba(28, 115, 231, 0.1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                animation: {
                    onComplete: function (e) {
                        console.log(e);
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });`;
        // script3.src = chrome.runtime.getURL("/components/iframe-graph/bar-chart.js");
        container_div[0].insertAdjacentElement("afterend", script3);
    }
}

function updateContent(json) {
    console.log(json);
    var keywords_table = document.getElementsByClassName("mdl-data-table mdl-js-data-table mdl-shadow--2dp");
    console.log(keywords_table[0]);

    var tbody = document.createElement("tbody");
    for (let i = 0; i < json.length; i++) {
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        td.setAttribute("class", "mdl-data-table__cell--non-numeric");
        td.innerHTML = json[i]['entity'];
        tr.appendChild(td);

        var td2 = document.createElement("td");
        td2.setAttribute("class", "mdl-data-table__cell--non-numeric");
        td2.innerHTML = json[i]['overall_score'];
        tr.appendChild(td2);

        tbody.appendChild(tr);
    }
    keywords_table[0].appendChild(tbody);

    displayBarChart(json);

}


function main() {
    if (is_page_at_google_all_menu()) {
        var links = scrape_search_results();
        var query = get_search_query();

        //
        console.log("List of links ====");
        console.log(links);
        console.log("Query:" + query);

        // listener to render graphs
        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
				if (request.type == 'return_data' && request.query == query){
					data = request.data;	
					recieve_data_callback(data);
					sendResponse({
						status:true
					});
				}
                return true;
            }
        );

        send_data(query, links);
        insert_analysis_chart(query);
        initialiseGraphs();
        let testJson = [{
            entity: 'neural network',
            frequency: 123,
            rel_score: 0.9,
            confi_score: 0.8,
            overall_score: 0.9
        }, {
            entity: 'what network',
            frequency: 123,
            rel_score: 0.2,
            confi_score: 0.8,
            overall_score: 0.7
        }, {
            entity: 'ever network',
            frequency: 123,
            rel_score: 0.9,
            confi_score: 0.8,
            overall_score: 0.6
        }, {
            entity: 'ne network',
            frequency: 123,
            rel_score: 0.9,
            confi_score: 0.8,
            overall_score: 0.4
        }, {
            entity: 'w network',
            frequency: 123,
            rel_score: 0.9,
            confi_score: 0.8,
            overall_score: 0.2
        }];
        updateContent(testJson);

    }

}

function loadScript(url, callback) {
    var script = document.createElement("script")
    script.type = "text/javascript";
    if (script.readyState) { //IE
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" ||
                script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else { //Others
        script.onload = function () {
            callback();
        };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}
var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
if (!location.ancestorOrigins.contains(extensionOrigin)) {

    loadScript(chrome.runtime.getURL("Chart.js"), function () {
        //initialization code
        console.log('done');
        main();
    });

}
