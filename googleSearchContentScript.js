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
    return links.slice(0, Math.floor(links.length/2));
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

function open_network_graph(query, data) {
    console.log("sent open network graph");
    var message = {
        type: 'open_network_graph',
        query: query,
        data: data
    }
    chrome.runtime.sendMessage(message);
}


function send_data(query, links) {
    var message = {
        type: 'links',
        query: query,
        links: links,
    };
    console.log(message);
    chrome.runtime.sendMessage(message);


}

var data = null

function recieve_data_callback(data, query) {
    // //render G graphs
    // let testJson = [{
    //     entity_name: 'neural network',
    //     frequency: 445,
    //     rel_score: 0.9,
    //     confi_score: 0.8,
    //     overall_score: 0.9,
    //     url: 'https://en.wikipedia.org/wiki/Main_Page'
    // }, {
    //     entity_name: 'AlexNet',
    //     frequency: 223,
    //     rel_score: 0.2,
    //     confi_score: 0.8,
    //     overall_score: 0.7,
    //     url: 'https://en.wikipedia.org/wiki/Main_Page'
    // }, {
    //     entity_name: 'ResNet',
    //     frequency: 112,
    //     rel_score: 0.9,
    //     confi_score: 0.8,
    //     overall_score: 0.6,
    //     url: 'https://en.wikipedia.org/wiki/Main_Page'
    // }, {
    //     entity_name: 'Yann LeCun',
    //     frequency: 45,
    //     rel_score: 0.9,
    //     confi_score: 0.8,
    //     overall_score: 0.4,
    //     url: 'https://en.wikipedia.org/wiki/Main_Page'
    // }, {
    //     entity_name: 'Andrew',
    //     frequency: 12,
    //     rel_score: 0.9,
    //     confi_score: 0.8,
    //     overall_score: 0.2,
    //     url: 'https://en.wikipedia.org/wiki/Main_Page'
    // }];
    updateContent(data, query);

    // return
}

function initialiseGraphs(query) {
    var top_result_bar = document.getElementById("appbar");

    // THIS IS FOR THE TABS
    var tab_div = document.createElement("div");
    tab_div.setAttribute("class", "mdl-tabs mdl-js-tabs mdl-js-ripple-effect");
    var tab_bar_div = document.createElement("div");
    tab_bar_div.setAttribute("class", "mdl-tabs__tab-bar");
    tab_div.appendChild(tab_bar_div);

    var anchor_keywords = document.createElement("a");
    anchor_keywords.href = "#keywords-panel";
    anchor_keywords.setAttribute("class", "mdl-tabs__tab is-active");
    anchor_keywords.innerHTML = "Keywords";

    var anchor_google = document.createElement("a");
    anchor_google.href = "#google-panel";
    anchor_google.setAttribute("class", "mdl-tabs__tab");
    anchor_google.innerHTML = "Google Trends";

    var anchor_entity_relation = document.createElement("a");
    anchor_entity_relation.href = "#entity-relation-panel";
    anchor_entity_relation.setAttribute("class", "mdl-tabs__tab");
    anchor_entity_relation.innerHTML = "Entity Relation";

    tab_bar_div.appendChild(anchor_keywords);
    tab_bar_div.appendChild(anchor_google);
    tab_bar_div.appendChild(anchor_entity_relation);

    top_result_bar.insertAdjacentElement("afterend", tab_div);


    // KEYWORDS TAB HERE
    var keywords_tab = document.createElement("div");
    keywords_tab.setAttribute("class", "mdl-tabs__panel is-active");
    keywords_tab.setAttribute("id", "keywords-panel");
    tab_div.appendChild(keywords_tab);

    var container_div = document.createElement("div");
    container_div.setAttribute("class", "container");
    container_div.setAttribute("style", "display:flex;margin-bottom:1rem;flex-direction:column; align-items:center;");

    // KEYWORDS DIV HERE
    var top_keywords_div = document.createElement("div");
    top_keywords_div.setAttribute("class", "keywords-container");

    var top_keywords_title = document.createElement("h3");
    top_keywords_title.innerHTML = "Top 5 Keywords";
    top_keywords_title.setAttribute("style", "font-size:16px;margin:0;text-align:center;");

    top_keywords_div.appendChild(top_keywords_title);

    var keywords_table = document.createElement("table");
    keywords_table.setAttribute("class", "mdl-data-table mdl-js-data-table mdl-shadow--2dp");
    // keywords_table.setAttribute("style", "margin-right:5rem;")
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
    th2.innerHTML = "Overall Score";
    tr.appendChild(th2);
    var th3 = document.createElement("th");
    th3.setAttribute("style", "mdl-data-table__cell--non-numeric");
    th3.innerHTML = "Confidence Score";
    tr.appendChild(th3);
    var th4 = document.createElement("th");
    th4.setAttribute("style", "mdl-data-table__cell--non-numeric");
    th4.innerHTML = "Relevance Score";
    tr.appendChild(th4);
    var th5 = document.createElement("th");
    th5.setAttribute("style", "mdl-data-table__cell--non-numeric");
    th5.innerHTML = "Wiki Link";
    tr.appendChild(th5);
    var th6 = document.createElement("th");
    th6.setAttribute("style", "mdl-data-table__cell--non-numeric");
    th6.innerHTML = "Classification";
    tr.appendChild(th6);
    var th7 = document.createElement("th");
    th7.setAttribute("style", "mdl-data-table__cell--non-numeric");
    th7.innerHTML = "Description";
    tr.appendChild(th7);

    top_keywords_div.appendChild(keywords_table);
    container_div.appendChild(top_keywords_div);

    // BARCHART CANVAS HERE
    var barchart_div = document.createElement("div");
    barchart_div.setAttribute("style", "width:45%; height:100%;");

    var barchart_title = document.createElement("h3");
    barchart_title.innerHTML = "Frequency of Top Keywords";
    barchart_title.setAttribute("style", "font-size:16px;margin:0;text-align:center;");
    barchart_div.appendChild(barchart_title);

    var bar_chart_canvas = document.createElement("canvas");
    bar_chart_canvas.setAttribute("id", "barChart");
    bar_chart_canvas.setAttribute("style", "max-height:100% !important; max-width:100% !important;");
    barchart_div.appendChild(bar_chart_canvas);
    container_div.appendChild(barchart_div);

    keywords_tab.appendChild(container_div);

    // TRENDS TAB HERE
    var trends_tab = document.createElement("div");
    trends_tab.setAttribute("class", "mdl-tabs__panel");
    trends_tab.setAttribute("id", "google-panel");
    tab_div.appendChild(trends_tab);

    // GOOGLE TRENDS STUFF
    var google_container = document.createElement("div");
    google_container.setAttribute("class", "google-container");
    google_container.setAttribute("style", "display:flex;justify-content:space-evenly;");

    var trends_div = document.createElement("div");
    trends_div.setAttribute("id", "trends");
    trends_div.setAttribute("style", "width:40%; margin-top:1rem;");
    google_container.appendChild(trends_div);

    // GOOGLE GEO MAP STUFF
    var geo_map_trends_div = document.createElement("div");
    geo_map_trends_div.setAttribute("id", "geo-map-trends");
    geo_map_trends_div.setAttribute("style", "width:40%; margin-top:1rem;");
    google_container.appendChild(geo_map_trends_div);

    loadScript("https://ssl.gstatic.com/trends_nrtr/1480_RC02/embed_loader.js", function () {
        //initialization code
        var trendScript = document.createElement("script");
        trendScript.type = "text/javascript";
        trendScript.innerHTML = `
        var divElem = document.getElementById('trends');
        trends.embed.renderExploreWidgetTo(divElem, "RELATED_QUERIES", {
            "comparisonItem": [{
                "keyword": " ` + query + `",
                "geo": "",
                "time": "today 12-m"
            }],
            "category": 0,
            "property": ""
        }, {
            "exploreQuery": "q=neural%20network&geo=US&date=today 12-m",
            "guestPath": "https://trends.google.com:443/trends/embed/"
        });
        `;
        google_container.appendChild(trendScript);

        var geoMapScript = document.createElement("script");
        geoMapScript.type = "text/javascript";
        geoMapScript.innerHTML = `
        var divElem = document.getElementById('geo-map-trends');
        trends.embed.renderExploreWidgetTo(divElem, "GEO_MAP", {
            "comparisonItem": [{
                "keyword": " ` + query + `",
                "geo": "",
                "time": "today 12-m"
            }],
            "category": 0,
            "property": ""
        }, {
            "exploreQuery": "q=neural%20network&geo=US&date=today 12-m",
            "guestPath": "https://trends.google.com:443/trends/embed/"
        });
        `;
        google_container.appendChild(geoMapScript);
        trends_tab.appendChild(google_container);
    });

    // ENTITY RELATION TAB
    var entity_relation_tab = document.createElement("div");
    entity_relation_tab.setAttribute("class", "mdl-tabs__panel");
    entity_relation_tab.setAttribute("id", "entity-relation-panel");
    // entity_relation_tab.setAttribute("style", "display:flex;");
    tab_div.appendChild(entity_relation_tab);

    top_result_bar.insertAdjacentElement("afterend", tab_div);

    // HIDES THE DIV
    var hideContainer_div = document.getElementsByClassName("mdl-tabs mdl-js-tabs mdl-js-ripple-effect");
    hideContainer_div[0].setAttribute("style", "display:none;");

    // LOADING
    var loading_div = document.createElement("div");
    loading_div.setAttribute("style", "width:100%; height:100%; display:flex; align-items:center; justify-content:center;margin-bottom:2rem;");
    loading_div.setAttribute("class", "loading");
    var loading = document.createElement("div");
    loading.setAttribute("class", "mdl-spinner mdl-spinner--single-color mdl-js-spinner is-active");
    loading_div.appendChild(loading);
    top_result_bar.insertAdjacentElement("afterend", loading_div);

    console.log(tab_div);
    // showMaterialDialog();
}

function formatJson(json) {
    let labels = [];
    let value = [];
    // COZ TOP 5
    for (let i = 0; i < 5; i++) {
        labels.push(json[i].entity_name);
        value.push(json[i].frequency);
    }
    let labelsString = '"';
    labelsString += labels.join('","');
    labelsString += '"';
    return [labelsString, value];
}


function displayBarChart(json) {
    formattedJson = formatJson(json);
    labels = formattedJson[0];
    value = formattedJson[1];
    var container_div = document.getElementsByClassName("container");

    var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
    if (!location.ancestorOrigins.contains(extensionOrigin)) {
        var script3 = document.createElement("script");
        script3.innerHTML = `console.log('running bar chart ');
        var ctx = document.getElementById("barChart").getContext('2d');
        Chart.defaults.global.legend.display = false;
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [` + labels + `],
                datasets: [{
                    label: 'Frequency',
                    data: [` + value + `],
                    backgroundColor: [
                        'rgba(28, 115, 231, 1)',
                        'rgba(28, 115, 231, 1)',
                        'rgba(28, 115, 231, 1)',
                        'rgba(28, 115, 231, 1)',
                        'rgba(28, 115, 231, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
                },
                animation: {
                    onComplete: function (e) {
                        // console.log(e);
                    }
                },
                scales: {
                    xAxes: [{
                        gridLines: {
                          color: 'rgba(0, 0, 0, 0)',
                        },
                        ticks: {
                            beginAtZero: true,
                            userCallback: function (value, index, values) {
                              return '';
                            }
                          }
                      }],
                      yAxes: [{
                        gridLines: {
                          color: 'rgba(0, 0, 0, 0)',
                        },
                        ticks: {
                          beginAtZero: true,
                        }
                      }]
                }
            }
        });`;
        // script3.src = chrome.runtime.getURL("/components/iframe-graph/bar-chart.js");
        container_div[0].insertAdjacentElement("afterend", script3);
    }
}

function updateContent(json, query) {
    // HIDE LOADING
    var loading_div = document.getElementsByClassName("loading");
    loading_div[0].setAttribute("style", "display:none;");

    // UNHIDE CONTAINER
    var hideContainer_div = document.getElementsByClassName("mdl-tabs mdl-js-tabs mdl-js-ripple-effect");
    hideContainer_div[0].setAttribute("style", "display:block;");

    // POPUP BUTTON
    var entity_relation_tab = document.getElementById("entity-relation-panel");
    var relation_entity_button = document.createElement("button");
    relation_entity_button.setAttribute("class", "mdl-button mdl-js-button mdl-button--raised");
    relation_entity_button.innerHTML = "Show Entity-Relationship Graph";
    // relation_entity_button.setAttribute("style", "margin-left:auto; margin-right:auto; margin-top:1rem; margin-bottom:1rem;");
    relation_entity_button.setAttribute("style", "left:41%; margin-top:1rem; margin-bottom:1rem;");

    // result_stats_bar.insertAdjacentElement("afterend", relation_entity_button);
    relation_entity_button.onclick = function () {
        open_network_graph(query, data);
    };
    entity_relation_tab.appendChild(relation_entity_button);

    // DETECT GOOGLE TRENDS
    var trends_header = document.getElementsByClassName("embed-header");
    console.log(trends_header);

    console.log(json);
    var keywords_table = document.getElementsByClassName("mdl-data-table mdl-js-data-table mdl-shadow--2dp");
    console.log(keywords_table[0]);

    var tbody = document.createElement("tbody");

    // COZ TOP 5
    console.log(json);
    for (let i = 0; i < 5; i++) {
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        td.setAttribute("class", "mdl-data-table__cell--non-numeric");
        var a = document.createElement("a");
        a.innerHTML = json[i].entity_name;
        let newGoogleSearchUrl = 'https://www.google.com/search?q=' + json[i].entity_name;
        a.href = newGoogleSearchUrl;
        a.target = '_blank';
        td.appendChild(a);
        tr.appendChild(td);

        var td2 = document.createElement("td");
        td2.setAttribute("class", "mdl-data-table__cell--non-numeric");
        td2.innerHTML = json[i].overall_score.toFixed(2);
        tr.appendChild(td2);

        var td3 = document.createElement("td");
        td3.setAttribute("class", "mdl-data-table__cell--non-numeric");
        td3.innerHTML = json[i].confidence_score.toFixed(2);
        tr.appendChild(td3);

        var td4 = document.createElement("td");
        td4.setAttribute("class", "mdl-data-table__cell--non-numeric");
        td4.innerHTML = json[i].relevance_score.toFixed(2);
        tr.appendChild(td4);

        var td5 = document.createElement("td");
        td5.setAttribute("class", "mdl-data-table__cell--non-numeric");
        var anchor_icon = document.createElement("a");
        // icon_button.setAttribute("style", "mdl-button mdl-js-button mdl-button--icon");

        var link_icon = document.createElement("i");
        link_icon.setAttribute("class", "material-icons");
        link_icon.innerHTML = "link";
        anchor_icon.appendChild(link_icon);
        anchor_icon.href = json[i].url;
        anchor_icon.target = '_blank';
        td5.appendChild(anchor_icon);
        tr.appendChild(td5);

        var td6 = document.createElement("td");
        td6.setAttribute("class", "mdl-data-table__cell--non-numeric");
        td6.innerHTML = json[i].classification;
        tr.appendChild(td6);

        var td7 = document.createElement("td");
        td7.setAttribute("class", "mdl-data-table__cell--non-numeric");
        td7.innerHTML = json[i].description;
        tr.appendChild(td7);

        tbody.appendChild(tr);
    }
    keywords_table[0].appendChild(tbody);

    displayBarChart(json);

}


function main() {
    if (is_page_at_google_all_menu()) {
        var links = scrape_search_results();
        var query = get_search_query();
        console.log(query);
        console.log("List of links ====");
        console.log(links);
        console.log("Query:" + query);

        var search_bar = document.getElementById("hdtb-msb");
        var tell_me_more_button = document.createElement("button");
        tell_me_more_button.setAttribute("class", "mdl-button mdl-js-button mdl-button--raised mdl-button--colored");
        tell_me_more_button.innerHTML = "Tell Me More";
        tell_me_more_button.setAttribute("style", "float:right; margin-right:2rem;");

        initialiseGraphs(query);

        // listener to render graphs
        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                console.log(request);
                if (request.type == 'return_data' && request.query == query) {
                    console.log("GOT RETURN DATA");
                    console.log(request.data);
                    data = request.data;
                    
                    sendResponse({
                        status: true
                    });
                    recieve_data_callback(data, query);
                }
                return true;
            }
        );
        send_data(query, links);

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